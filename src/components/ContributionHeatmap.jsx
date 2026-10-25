import { formatDate } from "../utils/dataTransform";

export default function ContributionHeatmap({ events }) {
  const latestEvents = (events || []).slice(0, 8);

  return (
    <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
      <h2 className="text-lg font-semibold text-white">Recent public events</h2>
      <p className="mt-3 text-sm leading-6 text-github-muted">
        GitHub&apos;s green contribution calendar is not available from the public REST API,
        so this dashboard does not invent heatmap squares. The list below is the latest
        public activity GitHub actually returned.
      </p>

      {latestEvents.length === 0 ? (
        <p className="mt-4 text-sm text-github-muted">
          No recent public events were returned for this developer.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {latestEvents.map((event) => (
            <li
              key={event.id || `${event.type}-${event.created_at}`}
              className="rounded-lg border border-github-border bg-github-bg px-3 py-2 text-sm"
            >
              <p className="font-medium text-white">{event.type || "Event"}</p>
              <p className="mt-1 text-github-muted">
                {event.repo?.name || "Repository not available"} · {formatDate(event.created_at)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
