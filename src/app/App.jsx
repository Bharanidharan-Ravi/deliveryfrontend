import { useEffect } from 'react';
import { PWAUpdatePrompt } from '../components/common/PWAUpdatePrompt';
import AppRouter from '../core/routing/AppRouter';
import { useThemeStore } from '../store/useThemeStore';

export default function App() {
  const initTheme = useThemeStore((s) => s.initTheme);
  
  useEffect(() => {
    initTheme();
  }, [initTheme]);
  return (
    <>
      <AppRouter />
      <PWAUpdatePrompt />
    </>
  );
}