export function StatsCard({ open, closed, total }) {
  const stats = [
    { id: 'stat-open',   label: 'Open',   value: open,   color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20' },
    { id: 'stat-closed', label: 'Closed', value: closed, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
    { id: 'stat-total',  label: 'Total',  value: total,  color: 'text-sky-400',    bg: 'bg-sky-400/10',    border: 'border-sky-400/20' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map(({ id, label, value, color, bg, border }) => (
        <div
          key={id}
          id={id}
          className={`flex flex-col items-center justify-center rounded-2xl border ${bg} ${border} py-4 px-2 gap-1`}
        >
          <span className={`text-2xl font-bold tabular-nums ${color}`}>{value}</span>
          <span className="text-xs text-muted font-medium tracking-wide uppercase">{label}</span>
        </div>
      ))}
    </div>
  );
}
