export function ScanButton({ onClick, disabled }) {
  return (
    <button
      id="scan-qr-btn"
      onClick={onClick}
      disabled={disabled}
      className="w-full btn-primary flex items-center justify-center gap-3 py-4 text-base rounded-2xl shadow-glow relative overflow-hidden group"
    >
      {/* Ripple ring animation */}
      <span className="absolute inset-0 rounded-2xl border border-primary/40 scale-100 group-hover:scale-110 transition-transform duration-500 opacity-0 group-hover:opacity-100" />

      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
        <path d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2" strokeLinecap="round" strokeLinejoin="round"/>
        <rect x="7" y="7" width="3" height="3" rx="0.5"/>
        <rect x="14" y="7" width="3" height="3" rx="0.5"/>
        <rect x="7" y="14" width="3" height="3" rx="0.5"/>
        <path d="M14 14h3v3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="font-semibold">Scan QR Code</span>
    </button>
  );
}
