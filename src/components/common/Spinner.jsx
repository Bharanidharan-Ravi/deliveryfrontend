export function Spinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
      <div
        className={`${sizes[size]} rounded-full border-2 border-surface-light border-t-primary animate-spin`}
      />
      <span className="text-xs text-muted">{label}</span>
    </div>
  );
}
