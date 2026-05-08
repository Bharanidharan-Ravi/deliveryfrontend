export function CameraControls({ facingMode, onSwitch, torchOn, onTorch, zoom, onZoom, layout = 'bottom' }) {
  
  // SIDE LAYOUT (For QR Code Mode - Beautiful floating pills)
  if (layout === 'sides') {
    return (
      <>
        {/* Left Side: Vertical Zoom Pill */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 p-1 backdrop-blur-md z-50 border border-white/10 shadow-2xl pointer-events-auto">
          <span className="text-[11px] text-primary font-bold tabular-nums">{zoom.toFixed(1)}×</span>
          
          {/* Wrapper for vertical rotation */}
          <div className="w-6 h-32 flex justify-center items-center relative my-1">
            <input
              type="range"
              min="1"
              max="4"
              step="0.1"
              value={zoom}
              onChange={(e) => onZoom(parseFloat(e.target.value))}
              className="absolute w-32 h-1.5 accent-primary rounded-full cursor-pointer origin-center -rotate-90"
            />
          </div>
          
          <span className="text-[10px] text-muted font-bold tabular-nums">1.0×</span>
        </div>

        {/* Right Side: Action Buttons Pill */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 p-1 rounded-full backdrop-blur-md z-50 border border-white/10 shadow-2xl pointer-events-auto">
          <button
            id="camera-switch-btn"
            onClick={onSwitch}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            title={facingMode === 'environment' ? 'Switch to front camera' : 'Switch to rear camera'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button
            id="camera-torch-btn"
            onClick={onTorch}
            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${torchOn ? 'bg-amber-400/20 border border-amber-400/50 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
            title={torchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={torchOn ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </>
    );
  }

  // BOTTOM LAYOUT (For Barcode Mode)
  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs text-muted w-6">1×</span>
        <input
          id="camera-zoom-slider"
          type="range"
          min="1"
          max="4"
          step="0.1"
          value={zoom}
          onChange={(e) => onZoom(parseFloat(e.target.value))}
          className="flex-1 accent-primary h-1.5 rounded-full cursor-pointer"
        />
        <span className="text-xs text-muted w-6 text-right">4×</span>
        <span className="text-xs text-primary font-medium tabular-nums w-8 text-right">{zoom.toFixed(1)}×</span>
      </div>

      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onSwitch}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <button
          onClick={onTorch}
          className={`w-12 h-12 flex items-center justify-center rounded-full transition-colors ${torchOn ? 'bg-amber-400/20 border border-amber-400/50 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.4)]' : 'bg-white/10 text-white hover:bg-white/20'}`}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill={torchOn ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}