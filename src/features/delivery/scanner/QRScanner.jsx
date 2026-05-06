import { useEffect, useCallback, useRef, useState } from 'react';
import { useQRScanner } from '../hooks/useQRScanner';
import {useDeliveryWorkflowStore} from '../store/useDeliveryWorkflowStore';
import { CameraControls } from './CameraControls';
import { BlurIndicator } from './BlurIndicator';

const SCANNER_ELEMENT_ID = 'qr-reader';

export function QRScanner() {
  const setScannedQR = useDeliveryWorkflowStore((s) => s.setScannedQR);
  const setStep = useDeliveryWorkflowStore((s) => s.setStep);
  const [facingMode, setFacingMode] = useState('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [zoom, setZoom] = useState(1.5);
  const [scanError, setScanError] = useState(null);
  const [decoded, setDecoded] = useState(false);
  const streamRef = useRef(null);

  const handleSuccess = useCallback(
    (decodedText) => {
      if (decoded) return;
      setDecoded(true);
      setScannedQR(decodedText);

      // Small delay for visual feedback before transitioning
      setTimeout(() => setStep(3), 400);
    },
    [decoded, setScannedQR, setStep]
  );

  const { start, stop } = useQRScanner({
    onScanSuccess: handleSuccess,
    onScanError: () => {},
    facingMode,
  });

  useEffect(() => {
    start(SCANNER_ELEMENT_ID);
    return () => { stop(); };
  }, [start, stop, facingMode]);

  const handleSwitch = () => {
    stop();
    setFacingMode((m) => (m === 'environment' ? 'user' : 'environment'));
  };

  const handleTorch = async () => {
    try {
      const track = streamRef.current?.getVideoTracks()[0];
      if (!track) return;
      const next = !torchOn;
      await track.applyConstraints({ advanced: [{ torch: next }] });
      setTorchOn(next);
    } catch {
      // Torch not supported silently
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Viewfinder */}
      <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <div id={SCANNER_ELEMENT_ID} className="w-full h-full" />

        {/* Corner frame overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-[22%]">
            {/* Corners */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-primary rounded-tl-md" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-primary rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-primary rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-primary rounded-br-md" />
            {/* Scan line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/70 animate-scan-line" />
          </div>
        </div>

        {/* Success flash */}
        {decoded && (
          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-primary/30 border-2 border-primary flex items-center justify-center text-2xl">✓</div>
          </div>
        )}

        <BlurIndicator />
      </div>

      {scanError && <p className="text-xs text-red-400 text-center">{scanError}</p>}

      {/* Camera Controls */}
      <CameraControls
        facingMode={facingMode}
        onSwitch={handleSwitch}
        torchOn={torchOn}
        onTorch={handleTorch}
        zoom={zoom}
        onZoom={setZoom}
      />

      <p className="text-xs text-muted text-center">Point camera at the invoice QR code</p>
    </div>
  );
}
