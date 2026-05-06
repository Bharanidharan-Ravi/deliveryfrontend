export function CameraControls({ facingMode, onSwitch, torchOn, onTorch, zoom, onZoom }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Zoom Slider */}
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

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        {/* Switch Camera */}
        <button
          id="camera-switch-btn"
          onClick={onSwitch}
          className="icon-btn-lg"
          title={facingMode === 'environment' ? 'Switch to front camera' : 'Switch to rear camera'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 4v6h6M23 20v-6h-6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Flashlight */}
        <button
          id="camera-torch-btn"
          onClick={onTorch}
          className={`icon-btn-lg ${torchOn ? 'bg-amber-400/20 border-amber-400/50 text-amber-400' : ''}`}
          title={torchOn ? 'Turn off flashlight' : 'Turn on flashlight'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={torchOn ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
