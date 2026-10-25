export default function EmptyState({ title, description, action }) {
  return (
    <section className="rounded-xl border border-dashed border-github-border bg-github-card px-6 py-10 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-github-muted">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </section>
  );
}
