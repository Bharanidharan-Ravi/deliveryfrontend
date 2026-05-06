import { PWAUpdatePrompt } from '../components/common/PWAUpdatePrompt';
import AppRouter from '../core/routing/AppRouter';

export default function App() {
  return (
    <>
      <AppRouter />
      <PWAUpdatePrompt />
    </>
  );
}