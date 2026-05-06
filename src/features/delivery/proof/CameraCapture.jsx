import { useRef, useState, useCallback } from 'react';
import { useDeliveryWorkflowStore } from '../store/useDeliveryWorkflowStore';
import { isBlurry } from '../../../utils/blurDetection';
import { config } from '../../../config/appConfig';
import { BlurIndicator } from '../scanner/BlurIndicator';
import { Spinner } from '../../../components/common/Spinner';

export function CameraCapture({ onCaptured }) {
  const setProofImage = useDeliveryWorkflowStore((s) => s.setProofImage);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [streaming, setStreaming] = useState(false);
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [blurry, setBlurry] = useState(false);
  const [starting, setStarting] = useState(false);

  const startCamera = useCallback(async () => {
    setStarting(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStreaming(true);
    } catch (err) {
      console.error('[CameraCapture]', err);
    } finally {
      setStarting(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreaming(false);
  }, []);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], `proof_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const url = URL.createObjectURL(blob);

        // Create temp image element for blur check
        const img = new Image();
        img.onload = () => {
          const blurDetected = isBlurry(img, config.blurThreshold);
          setBlurry(blurDetected);
          setCapturedUrl(url);
          setCapturedFile(file);
          stopCamera();
        };
        img.src = url;
      },
      'image/jpeg',
      0.92
    );
  }, [stopCamera]);

  const retake = useCallback(() => {
    setCapturedUrl(null);
    setCapturedFile(null);
    setBlurry(false);
    startCamera();
  }, [startCamera]);

  const handleUse = useCallback(() => {
    if (!capturedFile) return;
    setProofImage(capturedFile, capturedUrl);
    onCaptured?.(capturedFile, capturedUrl);
  }, [capturedFile, capturedUrl, setProofImage, onCaptured]);

  return (
    <div className="flex flex-col gap-4">
      {/* Viewfinder / Preview */}
      <div className="relative w-full aspect-video max-w-sm mx-auto rounded-2xl overflow-hidden bg-black border border-white/10">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${capturedUrl ? 'hidden' : ''}`}
          muted
          playsInline
        />
        <canvas ref={canvasRef} className="hidden" />

        {capturedUrl && (
          <img
            id="proof-preview"
            src={capturedUrl}
            alt="Captured proof"
            className="w-full h-full object-cover"
          />
        )}

        {!streaming && !capturedUrl && !starting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span className="text-4xl">📷</span>
            <p className="text-sm text-muted">Camera not started</p>
          </div>
        )}

        {starting && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner label="Starting camera..." />
          </div>
        )}

        {blurry && capturedUrl && <BlurIndicator isBlurry />}
      </div>

      {/* Blur warning text */}
      {blurry && capturedUrl && (
        <p className="text-center text-sm text-red-400">
          Image appears blurry. Please retake for a clear photo.
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!streaming && !capturedUrl && (
          <button id="start-camera-btn" onClick={startCamera} className="flex-1 btn-primary" disabled={starting}>
            {starting ? <Spinner size="sm" label="" /> : '📷 Open Camera'}
          </button>
        )}

        {streaming && (
          <button id="capture-btn" onClick={capture} className="flex-1 btn-primary">
            📸 Capture Photo
          </button>
        )}

        {capturedUrl && (
          <>
            <button id="retake-btn" onClick={retake} className="flex-1 btn-secondary">
              🔄 Retake
            </button>
            <button
              id="use-photo-btn"
              onClick={handleUse}
              disabled={blurry}
              className={`flex-1 ${blurry ? 'btn-disabled' : 'btn-primary'}`}
            >
              ✓ Use Photo
            </button>
          </>
        )}
      </div>
    </div>
  );
}
