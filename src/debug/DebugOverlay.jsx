export function DebugOverlay({
  logs = [],
}) {

  return (
    <div className="fixed bottom-24 left-2 right-2 z-[9999] max-h-48 overflow-auto rounded-xl bg-black/90 border border-lime-500/30 p-2 text-[10px] font-mono text-lime-400">

      <div className="mb-2 text-lime-300 font-bold">
        DEBUG LOGS
      </div>

      <div className="space-y-1">

        {logs.map((log, i) => (

          <div key={i}>
            {log}
          </div>

        ))}

      </div>

    </div>
  );
}