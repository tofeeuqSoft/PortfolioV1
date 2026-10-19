export default function Spinner({ full = false, label = 'Loading…' }) {
  const spinner = (
    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
        aria-hidden="true"
      />
      <span className="text-sm">{label}</span>
    </div>
  );

  if (!full) return spinner;

  return (
    <div className="flex min-h-screen items-center justify-center" role="status">
      {spinner}
    </div>
  );
}
