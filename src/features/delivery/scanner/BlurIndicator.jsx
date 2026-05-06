export function BlurIndicator({ isBlurry = false }) {
  if (!isBlurry) return null;

  return (
    <div className="absolute bottom-3 inset-x-3 bg-red-500/80 backdrop-blur-sm rounded-xl px-3 py-2 flex items-center gap-2 animate-fade-in">
      <span className="text-sm">⚠️</span>
      <span className="text-xs text-white font-medium">Image is blurry — hold steady</span>
    </div>
  );
}
