import { useRegisterSW } from 'virtual:pwa-register/react';

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('[PWA] Service worker registered:', r);
    },
    onRegisterError(error) {
      console.error('[PWA] Registration error:', error);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 z-50 animate-slide-up">
      <div className="bg-surface border border-white/10 rounded-2xl px-5 py-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">Update available</p>
          <p className="text-xs text-muted mt-0.5">Reload to get the latest version</p>
        </div>
        <button
          id="pwa-update-btn"
          onClick={() => updateServiceWorker(true)}
          className="btn-primary shrink-0 text-sm"
        >
          Update
        </button>
      </div>
    </div>
  );
}
