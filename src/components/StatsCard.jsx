export default function StatsCard({ label, value, hint, icon }) {
  return (
    <article title={hint} className="min-w-0 rounded-xl border border-github-border bg-github-card px-4 py-5 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-github-link/60">
      <div className="flex items-center justify-between gap-2"><h3 className="text-sm text-github-muted">{label}</h3>{icon && <span aria-hidden="true" className="text-github-link">{icon}</span>}</div>
      <p className="mt-2 break-words text-2xl font-semibold text-white">{value}</p>
      {hint && <p className="mt-2 text-xs leading-5 text-github-muted">{hint}</p>}
    </article>
  );
}
