/**
 * Compute Laplacian variance of a grayscale image to detect blur.
 * Returns a number — lower value = blurrier image.
 * Threshold: < 100 is considered blurry (configurable in appConfig.js)
 */
export function computeBlurScore(imageElement) {
  const canvas = document.createElement('canvas');
  const { naturalWidth: w, naturalHeight: h } = imageElement;
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageElement, 0, 0, w, h);

  const { data } = ctx.getImageData(0, 0, w, h);

  // Convert to grayscale
  const gray = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    gray[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Apply Laplacian kernel: [0,1,0],[1,-4,1],[0,1,0]
  let sum = 0;
  let count = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const laplacian =
        gray[idx - w] +
        gray[idx + w] +
        gray[idx - 1] +
        gray[idx + 1] -
        4 * gray[idx];
      sum += laplacian * laplacian;
      count++;
    }
  }

  return count > 0 ? sum / count : 0;
}

export function isBlurry(imageElement, threshold = 100) {
  return computeBlurScore(imageElement) < threshold;
}
