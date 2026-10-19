export default function TechMarquee({ items = [] }) {
  if (!items.length) return null;
  const loop = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden border-y border-slate-200/70 py-6 dark:border-white/10"
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-4 will-change-transform">
        {loop.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-sm text-slate-500 dark:text-slate-400"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand-500 to-accent-cyan" />
            {item}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-slate-50 to-transparent dark:from-slate-950" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-slate-50 to-transparent dark:from-slate-950" />
    </div>
  );
}
