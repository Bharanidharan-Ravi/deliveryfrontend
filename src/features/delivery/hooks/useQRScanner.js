import { useEffect, useRef, useCallback } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { config } from "../../../config/appConfig";

export function useQRScanner({
  onScanSuccess,
  onScanError,
  facingMode = "environment",
}) {
  const scannerRef = useRef(null);
  const isRunning = useRef(false);

  const start = useCallback(
    async (elementId) => {
      if (isRunning.current) return;

      try {
        scannerRef.current = new Html5Qrcode(elementId);

        const scanConfig = {
          fps: config.qrFps,
          qrbox: config.qrBoxSize,
          aspectRatio: 1.0,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
        };
        try {
          await scannerRef.current.start(
            {
              facingMode,
            },
            scanConfig,
            onScanSuccess,
            onScanError,
          );
        } catch (err) {
          console.warn(
            "[QRScanner] Environment camera failed. Falling back to user camera.",
          );
          await scannerRef.current.start(
            {
              facingMode: "user",
            },
            scanConfig,
            onScanSuccess,
            onScanError,
          );
        }

        isRunning.current = true;
      } catch (err) {
        console.error("[QRScanner] Failed to start:", err);
      }
    },
    [facingMode, onScanSuccess, onScanError],
  );

  const stop = useCallback(async () => {
    if (scannerRef.current && isRunning.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.warn("[QRScanner] Stop error:", err);
      } finally {
        isRunning.current = false;
      }
    }
  }, []);

  // Auto-cleanup on component unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return { start, stop, isRunning };
}
