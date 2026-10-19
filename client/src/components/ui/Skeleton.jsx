export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-200/80 dark:bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

function CardSkeleton() {
  return (
    <div className="card space-y-3">
      <Skeleton className="h-40 w-full !rounded-xl" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-4/5" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-7 w-20 !rounded-full" />
        <Skeleton className="h-7 w-20 !rounded-full" />
      </div>
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading portfolio…</span>
      <section className="container-page grid items-center gap-12 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.2fr_1fr]">
        <div className="space-y-5">
          <Skeleton className="h-6 w-40 !rounded-full" />
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-11 w-32 !rounded-xl" />
            <Skeleton className="h-11 w-32 !rounded-xl" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-sm">
          <Skeleton className="aspect-square w-full !rounded-3xl" />
        </div>
      </section>

      <div className="container-page grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 4 }) {
  return (
    <div className="container-page grid gap-6 py-16 sm:grid-cols-2" aria-busy="true">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="container-page max-w-3xl space-y-4 py-16" aria-busy="true">
      <span className="sr-only">Loading…</span>
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="mt-4 h-64 w-full !rounded-2xl" />
    </div>
  );
}
