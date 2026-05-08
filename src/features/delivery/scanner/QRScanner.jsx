import { useEffect, useCallback, useRef, useState } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { useDeliveryWorkflowStore } from "../store/useDeliveryWorkflowStore";
import { CameraControls } from "./CameraControls";
import { BlurIndicator } from "./BlurIndicator";

const SCANNER_ELEMENT_ID = "qr-reader";

export function QRScanner({ onStop, setLogs, onScanSuccess }) {
  const setScannedQR = useDeliveryWorkflowStore((s) => s.setScannedQR);
  const setStep = useDeliveryWorkflowStore((s) => s.setStep);

  const scannerRef = useRef(null);
  const isTransitioningRef = useRef(false);
  const isSwitchingRef = useRef(false);
  const isCameraReadyRef = useRef(false);
  const decodedRef = useRef(false);
  const scanModeRef = useRef("barcode");
  const mountTimeRef = useRef(Date.now());
  const scanBufferRef = useRef([]);
  const REQUIRED_CONSECUTIVE_MATCHES = 2;

  const [scanMode, setScanMode] = useState("barcode");
  const [isSwitching, setIsSwitching] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");
  const [torchOn, setTorchOn] = useState(false);
  const [zoom, setZoom] = useState(1.5);
  const [scanError, setScanError] = useState(null);
  const [decoded, setDecoded] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState("checking");

  const addLog = (msg) => {
    if (setLogs)
      setLogs((prev) => [
        `${new Date().toLocaleTimeString()} - ${msg}`,
        ...prev.slice(0, 20),
      ]);
  };

  const getVideoTrack = useCallback(() => {
    try {
      const video = document.querySelector(`#${SCANNER_ELEMENT_ID} video`);
      return video?.srcObject?.getVideoTracks()[0] || null;
    } catch {
      return null;
    }
  }, []);

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        try {
          if (scannerRef.current.isScanning) await scannerRef.current.stop();
        } catch {}
        try {
          await scannerRef.current.clear();
        } catch {}
        scannerRef.current = null;
      }

      const videos = document.querySelectorAll(`#${SCANNER_ELEMENT_ID} video`);
      videos.forEach((video) => {
        if (video.srcObject) {
          video.srcObject.getTracks().forEach((track) => track.stop());
          video.srcObject = null;
        }
      });

      const container = document.getElementById(SCANNER_ELEMENT_ID);
      if (container) container.innerHTML = "";
      scanBufferRef.current = [];
    } catch (err) {
      console.warn("Scanner cleanup failed", err);
    }
  };

  const handleSuccess = useCallback(
    async (decodedText) => {
      if (
        decodedRef.current ||
        isSwitchingRef.current ||
        isTransitioningRef.current ||
        !isCameraReadyRef.current
      )
        return;
      if (Date.now() - mountTimeRef.current < 1500) return;

      if (decodedText.length < 5) return;

      if (scanModeRef.current === "barcode") {
        scanBufferRef.current.push(decodedText);
        if (scanBufferRef.current.length > REQUIRED_CONSECUTIVE_MATCHES) {
          scanBufferRef.current.shift();
        }
        const allMatch =
          scanBufferRef.current.length === REQUIRED_CONSECUTIVE_MATCHES &&
          scanBufferRef.current.every((val) => val === decodedText);
        if (!allMatch) return;
      }

      decodedRef.current = true;
      setDecoded(true);

      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);

      await stopScanner();
      setScannedQR(decodedText);
      if (onScanSuccess) onScanSuccess(decodedText);
    },
    [setScannedQR, setStep],
  );

  useEffect(() => {
    let mounted = true;

    const bootCamera = async () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      scanBufferRef.current = [];

      try {
        setIsCameraReady(false);
        isCameraReadyRef.current = false;

        await stopScanner();
        await new Promise((resolve) => setTimeout(resolve, 600));

        if (!mounted) return;

        setScanError(null);
        setTorchOn(false);
        setZoom(1.5);

        const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = scanner;

        const isBarcode = scanModeRef.current === "barcode";

        // DYNAMIC BOX UPDATE: Restored QR Box back to 260px since controls are on the sides now!
        const dynamicQrBox = (viewfinderWidth) => {
          if (isBarcode) {
            return { width: Math.min(viewfinderWidth * 0.95, 400), height: 60 };
          } else {
            return { width: 260, height: 260 };
          }
        };

        const targetFormats = isBarcode
          ? [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.UPC_A,
            ]
          : [Html5QrcodeSupportedFormats.QR_CODE];

        await scanner.start(
          { facingMode: facingMode },
          { fps: 15, qrbox: dynamicQrBox, formatsToSupport: targetFormats },
          handleSuccess,
          () => {},
        );

        if (!mounted) {
          await stopScanner();
          return;
        }

        setIsCameraReady(true);
        isCameraReadyRef.current = true;

        setTimeout(async () => {
          const track = getVideoTrack();
          if (track) {
            try {
              const capabilities = track.getCapabilities();
              const advancedConstraints = [{ focusMode: "continuous" }];
              if (capabilities.zoom) {
                const clampedZoom = Math.min(
                  Math.max(1.5, capabilities.zoom.min || 1),
                  capabilities.zoom.max || 5,
                );
                advancedConstraints.push({ zoom: clampedZoom });
              }
              await track.applyConstraints({
                width: { ideal: 1280 },
                height: { ideal: 720 },
                advanced: advancedConstraints,
              });
            } catch (e) {}
          }
        }, 300);
      } catch (err) {
        if (mounted) {
          const errMsg =
            typeof err === "string"
              ? err
              : err?.message || "Could not start camera";
          setScanError(`Camera Error: ${errMsg}`);
        }
        await stopScanner();
      } finally {
        isTransitioningRef.current = false;
        if (mounted) {
          setIsSwitching(false);
          isSwitchingRef.current = false;
          mountTimeRef.current = Date.now();
        }
      }
    };

    const checkPermissionsAndStart = async () => {
      try {
        if (!isSwitchingRef.current && mounted) setPermissionStatus("checking");

        await new Promise((resolve) => setTimeout(resolve, 400));
        const cameras = await Html5Qrcode.getCameras();

        if (cameras && cameras.length > 0) {
          if (mounted) {
            setPermissionStatus("granted");
            bootCamera();
          }
        } else {
          throw new Error("No cameras");
        }
      } catch (err) {
        if (mounted) setPermissionStatus("denied");
      }
    };

    checkPermissionsAndStart();

    return () => {
      mounted = false;
      stopScanner();
    };
  }, [facingMode, scanMode, handleSuccess, getVideoTrack]);

  const handleModeToggle = (mode) => {
    if (
      scanModeRef.current === mode ||
      isSwitchingRef.current ||
      isTransitioningRef.current
    )
      return;
    isSwitchingRef.current = true;
    scanModeRef.current = mode;
    setIsSwitching(true);
    setScanMode(mode);
  };

  const handleSwitch = () => {
    if (isSwitchingRef.current || isTransitioningRef.current) return;
    isSwitchingRef.current = true;
    setIsSwitching(true);
    setFacingMode((m) => (m === "environment" ? "user" : "environment"));
  };

  const handleZoomChange = async (newZoom) => {
    setZoom(newZoom);
    const track = getVideoTrack();
    if (!track) return;
    try {
      const capabilities = track.getCapabilities();
      if (capabilities.zoom) {
        const clampedZoom = Math.min(
          Math.max(newZoom, capabilities.zoom.min || 1),
          capabilities.zoom.max || 5,
        );
        await track.applyConstraints({ advanced: [{ zoom: clampedZoom }] });
      }
    } catch (err) {}
  };

  const handleTorch = async () => {
    const track = getVideoTrack();
    if (!track) return;
    try {
      const capabilities = track.getCapabilities();
      if (!capabilities.torch) return;
      const nextState = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: nextState }] });
      setTorchOn(nextState);
    } catch (err) {}
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex bg-card p-1 rounded-full mb-1 w-fit mx-auto border border-white/10 shadow-lg">
        <button
          onClick={() => handleModeToggle("barcode")}
          disabled={isSwitching || permissionStatus !== "granted"}
          className={`px-5 py-2 text-[11px] uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${scanMode === "barcode" ? "bg-primary text-white shadow-md" : "text-muted hover:text-white"} ${isSwitching || permissionStatus !== "granted" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          Barcode
        </button>
        <button
          onClick={() => handleModeToggle("qr")}
          disabled={isSwitching || permissionStatus !== "granted"}
          className={`px-5 py-2 text-[11px] uppercase tracking-wider font-bold rounded-full transition-all duration-300 ${scanMode === "qr" ? "bg-primary text-white shadow-md" : "text-muted hover:text-white"} ${isSwitching || permissionStatus !== "granted" ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          QR Code
        </button>
      </div>

      <style>{`
        #${SCANNER_ELEMENT_ID} img, 
        #${SCANNER_ELEMENT_ID} br { display: none !important; }
        #qr-shaded-region { border-color: rgba(0,0,0,0.5) !important; transition: all 0.3s ease; }
        #qr-shaded-region > div { display: none !important; }
        
        #${SCANNER_ELEMENT_ID} video { 
          object-fit: cover !important; 
          width: 100% !important; 
          height: 100% !important; 
          opacity: ${isCameraReady ? 1 : 0};
          transition: opacity 0.5s ease-in-out; 
        }
      `}</style>

      <div className="relative w-full aspect-[4/3] max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 bg-black shadow-xl">
        {(!isCameraReady || permissionStatus === "checking" || isSwitching) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/90 backdrop-blur-md z-20 transition-all duration-300">
            <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-muted animate-pulse">
              {isSwitching ? "Switching mode..." : "Starting Lens..."}
            </p>
          </div>
        )}

        {permissionStatus === "denied" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-card z-20 px-6 text-center">
            <span className="text-4xl mb-3">📷🚫</span>
            <p className="text-red-400 font-bold mb-1">Camera Access Blocked</p>
            <p className="text-xs text-muted">
              Please allow camera permissions and refresh.
            </p>
          </div>
        )}

        <div id={SCANNER_ELEMENT_ID} className="w-full h-full object-cover" />

        {isCameraReady && permissionStatus === "granted" && !isSwitching && (
          <div className="absolute inset-0 pointer-events-none z-10 transition-all duration-500">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out"
              style={{
                width: scanMode === "barcode" ? "min(95%, 400px)" : "260px",
                height: scanMode === "barcode" ? "60px" : "260px",
              }}
            >
              <div className="absolute top-0 left-0 w-6 h-6 border-t-[3px] border-l-[3px] border-primary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-6 h-6 border-t-[3px] border-r-[3px] border-primary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-[3px] border-l-[3px] border-primary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-[3px] border-r-[3px] border-primary rounded-br-lg" />
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-primary/80 animate-scan-line shadow-[0_0_12px_var(--primary)]" />
            </div>
          </div>
        )}

        {decoded && (
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm flex items-center justify-center z-30 transition-all">
            <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-3xl text-primary shadow-lg shadow-primary/20 animate-scale-in">
              ✓
            </div>
          </div>
        )}

        <BlurIndicator />

        {/* DYNAMIC CONTROLS RENDER */}
        {isCameraReady &&
          permissionStatus === "granted" &&
          !isSwitching &&
          (scanMode === "barcode" ? (
            // Barcode Bottom Layout
            <div className="absolute bottom-0 inset-x-0 pt-16 pb-4 px-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-40">
              <CameraControls
                layout="bottom"
                facingMode={facingMode}
                onSwitch={handleSwitch}
                torchOn={torchOn}
                onTorch={handleTorch}
                zoom={zoom}
                onZoom={handleZoomChange}
              />
            </div>
          ) : (
            // QR Sides Layout
            <div className="absolute inset-0 pointer-events-none z-40">
              <CameraControls
                layout="sides"
                facingMode={facingMode}
                onSwitch={handleSwitch}
                torchOn={torchOn}
                onTorch={handleTorch}
                zoom={zoom}
                onZoom={handleZoomChange}
              />
            </div>
          ))}
      </div>

      {scanError && (
        <p className="text-xs text-red-400 text-center px-4">{scanError}</p>
      )}

      <button
        className="w-full rounded-2xl border border-red-500/20 bg-red-500/10 py-3 text-red-400 font-medium transition-colors active:bg-red-500/20 mt-1 disabled:opacity-50"
        disabled={isSwitching}
        onClick={async () => {
          await stopScanner();
          onStop?.();
        }}
      >
        Stop Scan
      </button>

      <p className="text-[11px] text-muted text-center pb-2">
        Align {scanMode === "barcode" ? "barcode" : "QR code"} strictly within
        the target area
      </p>
    </div>
  );
}
