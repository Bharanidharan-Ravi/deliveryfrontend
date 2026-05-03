import { useCallback } from 'react';
import { getDeviceId } from '../utils/deviceFingerprint';

export function useDeviceInfo() {
  const getInfo = useCallback(() => {
    return {
      deviceId: getDeviceId(),
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
    };
  }, []);

  return { getInfo };
}
