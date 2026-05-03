/**
 * Generate a stable device fingerprint stored in localStorage.
 * Not cryptographically unique — used as a soft device identifier.
 */
export function getDeviceId() {
  let deviceId = localStorage.getItem('deviceId');
  if (!deviceId) {
    deviceId = generateFingerprint();
    localStorage.setItem('deviceId', deviceId);
  }
  return deviceId;
}

function generateFingerprint() {
  const raw = [
    navigator.userAgent,
    navigator.language,
    navigator.platform,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
  ].join('|');

  // Simple non-cryptographic hash (djb2)
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) + hash + raw.charCodeAt(i);
    hash = hash & hash; // Convert to 32-bit int
  }
  return 'dev_' + Math.abs(hash).toString(16);
}
