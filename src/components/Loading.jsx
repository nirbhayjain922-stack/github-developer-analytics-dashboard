export default function Loading({ message = "Loading..." }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border border-github-border bg-github-card px-4 py-6 shadow-card"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-5 w-5 animate-spin rounded-full border-2 border-github-border border-t-github-link"
        aria-hidden="true"
      />
      <p className="text-sm text-github-muted">{message}</p>
    </div>
  );
}

export function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-github-border/60 ${className}`}
      aria-hidden="true"
    />
  );
}

export function ProfileSkeleton() {
  return (
    <article
      className="rounded-xl border border-github-border bg-github-card p-6 shadow-card"
      aria-busy="true"
      aria-label="Loading developer profile"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <SkeletonBlock className="h-24 w-24 rounded-full" />
        <div className="min-w-0 flex-1 space-y-3">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-16 w-full" />
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonBlock key={index} className="h-12 w-full" />
        ))}
      </div>
    </article>
  );
}

export function StatsSkeleton() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-github-border bg-github-card px-4 py-5 shadow-card"
        >
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="mt-3 h-8 w-16" />
        </div>
      ))}
    </section>
  );
}
