export const config = {
  defaultZoom: 1.5,
  enableFlashlight: true,
  blurThreshold: 100,        // Laplacian variance — lower = blurry
  maxImageSizeMB: 5,
  qrFps: 10,
  qrBoxSize: { width: 250, height: 250 },
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  pwa: {
    enableInstallPrompt: true,
  },
};
