/**
 * Parse JWT token payload (base64 decode, no verification).
 */
export function parseToken(token) {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/**
 * Check if a JWT token is expired.
 */
export function isTokenExpired(token) {
  const payload = parseToken(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

/**
 * Get remaining seconds until token expiry.
 */
export function getTokenTTL(token) {
  const payload = parseToken(token);
  if (!payload?.exp) return 0;
  return Math.max(0, payload.exp * 1000 - Date.now()) / 1000;
}
