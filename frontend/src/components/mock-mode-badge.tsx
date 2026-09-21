export function MockModeBadge() {
  return (
    <div className="flex items-center space-x-2 bg-amber-100 border border-amber-300 text-amber-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
      </span>
      <span>MOCK MODE</span>
    </div>
  );
}
