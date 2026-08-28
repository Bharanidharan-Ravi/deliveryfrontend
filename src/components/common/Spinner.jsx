export function Spinner({ size = 'md', label = 'Loading...' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  
  return (
    <div className="flex flex-col items-center justify-center gap-3" role="status" aria-label={label}>
      <div
        // 🚀 FIXED: Swapped hardcoded 'border-surface-light' for adaptive 'border-primary/20'
        className={`${sizes[size]} rounded-full border-2 border-primary/20 border-t-primary animate-spin`}
      />
      
      {/* 🚀 PRO TIP: Only render the label if a label string actually exists */}
      {label && (
        <span className="text-xs font-medium text-muted">
          {label}
        </span>
      )}
    </div>
  );
}