import { useRef, useCallback } from 'react';

export function useCamera() {
  const streamRef = useRef(null);
  const trackRef = useRef(null);

  const getTrack = () => {
    const stream = streamRef.current;
    if (!stream) return null;
    return stream.getVideoTracks()[0] || null;
  };

  const setZoom = useCallback(async (zoomValue) => {
    const track = getTrack();
    if (!track) return;
    const capabilities = track.getCapabilities();
    if (!capabilities.zoom) return;
    const clampedZoom = Math.min(Math.max(zoomValue, capabilities.zoom.min), capabilities.zoom.max);
    await track.applyConstraints({ advanced: [{ zoom: clampedZoom }] });
  }, []);

  const setTorch = useCallback(async (enabled) => {
    const track = getTrack();
    if (!track) return;
    const capabilities = track.getCapabilities();
    if (!capabilities.torch) return;
    await track.applyConstraints({ advanced: [{ torch: enabled }] });
  }, []);

  const setStream = useCallback((stream) => {
    streamRef.current = stream;
    trackRef.current = stream?.getVideoTracks()[0] || null;
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    trackRef.current = null;
  }, []);

  return { setZoom, setTorch, setStream, stopStream };
}
