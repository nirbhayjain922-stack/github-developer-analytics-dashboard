import { Link } from "react-router-dom";

export default function RecentSearches({ history, onClear, onSelect }) {
  if (!history.length) {
    return (
      <section className="rounded-xl border border-dashed border-github-border bg-github-bg/60 px-4 py-5 text-left">
        <h2 className="text-sm font-semibold text-white">Recent searches</h2>
        <p className="mt-2 text-sm text-github-muted">
          Usernames you analyze will appear here so you can open them again quickly.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-github-border bg-github-bg/60 px-4 py-5 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-white">Recent searches</h2>
          <p className="mt-1 text-xs text-github-muted">
            Last {history.length} unique username{history.length === 1 ? "" : "s"} from this browser.
          </p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 rounded-md border border-github-border px-3 py-1.5 text-xs font-medium text-github-muted transition hover:bg-github-card hover:text-github-text"
        >
          Clear history
        </button>
      </div>
      <ul className="mt-3 flex flex-wrap gap-2">
        {history.map((username) => (
          <li key={username.toLowerCase()}>
            <Link
              to={`/dashboard/${encodeURIComponent(username)}`}
              onClick={() => onSelect?.(username)}
              className="inline-flex min-h-11 items-center rounded-full border border-github-border px-3 py-1.5 text-sm text-github-link transition-colors hover:bg-github-card"
            >
              {username}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
