import { useAuthStore } from '../../store/useAuthStore';

export function Screen({ children, title, showBack, onBack, step, totalSteps }) {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="screen">
      {/* Header */}
      <header className="screen-header">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              id="screen-back-btn"
              onClick={onBack}
              className="icon-btn"
              aria-label="Go back"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4L6 10L12 16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <h1 className="screen-title">{title}</h1>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{user.username}</span>
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-semibold text-primary">
              {user.username?.[0]?.toUpperCase()}
            </div>
          </div>
        )}
      </header>

      {/* Step Progress Bar */}
      {totalSteps && (
        <div className="step-bar">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`step-dot ${i < step ? 'step-done' : i === step ? 'step-active' : 'step-idle'}`}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <main className="screen-body">{children}</main>
    </div>
  );
}
