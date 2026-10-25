import { useMemo, useState } from "react";
import { formatDate } from "../utils/dataTransform";

function describeEvent(event) {
  const payload = event.payload || {};
  if (event.type === "PushEvent") return payload.ref ? `Pushed to ${payload.ref.replace("refs/heads/", "")}` : "Pushed changes";
  if (event.type === "PullRequestEvent") return payload.action && payload.pull_request?.title ? `${payload.action} pull request: ${payload.pull_request.title}` : "Updated a pull request";
  if (event.type === "IssuesEvent") return payload.action && payload.issue?.title ? `${payload.action} issue: ${payload.issue.title}` : "Updated an issue";
  if (event.type === "WatchEvent") return "Starred this repository";
  if (event.type === "ForkEvent") return "Forked this repository";
  if (event.type === "CreateEvent") return payload.ref ? `Created ${payload.ref_type}: ${payload.ref}` : "Created a repository or branch";
  if (event.type === "IssueCommentEvent") return payload.action ? `${payload.action} a comment` : "Commented on an issue or pull request";
  return event.type?.replace(/Event$/, " event").replace(/([a-z])([A-Z])/g, "$1 $2") || "Public event";
}

export default function ActivityTimeline({ events = [], isLoading, isError, onRetry }) {
  const [type, setType] = useState("all");
  const types = useMemo(() => [...new Set(events.map((event) => event.type).filter(Boolean))].sort(), [events]);
  const visible = type === "all" ? events : events.filter((event) => event.type === type);

  return <section id="activity" className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-lg font-semibold text-white">Recent public activity</h2><p className="mt-1 text-sm text-github-muted">GitHub returns a limited, recent window of public events (up to 100 here). This is not a complete contribution history.</p></div>
      <label className="text-sm text-github-muted">Filter event type<select className="control-field min-w-44" value={type} onChange={(e) => setType(e.target.value)}><option value="all">All event types</option>{types.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    {isLoading && <p className="mt-5 animate-pulse text-sm text-github-muted" role="status">Loading public events…</p>}
    {isError && <div className="mt-5"><p className="text-sm text-github-danger">Public events could not be loaded.</p><button className="mt-2 rounded-md border border-github-border px-3 py-2 text-sm hover:bg-github-bg" onClick={onRetry}>Retry</button></div>}
    {!isLoading && !isError && visible.length === 0 && <p className="mt-5 text-sm text-github-muted">{events.length ? "No events match this filter." : "No recent public events were returned."}</p>}
    {!isLoading && !isError && visible.length > 0 && <ol className="mt-5 space-y-3">{visible.map((event) => <li key={event.id} className="relative rounded-lg border border-github-border bg-github-bg p-4"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-full bg-github-border px-2.5 py-1 text-xs text-github-text">{event.type || "Unknown event"}</span><time className="text-xs text-github-muted" dateTime={event.created_at}>{event.created_at ? new Date(event.created_at).toLocaleString() : "Time not available"}</time></div><p className="mt-3 text-sm text-github-text">{describeEvent(event)}</p>{event.repo?.name && <a className="mt-1 inline-block break-all text-sm text-github-link hover:underline" href={`https://github.com/${event.repo.name}`} target="_blank" rel="noreferrer">{event.repo.name} ↗</a>}</li>)}</ol>}
  </section>;
}
