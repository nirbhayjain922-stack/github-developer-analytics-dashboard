import { formatDate, formatNumber, getRecentlyUpdatedRepositories } from "../utils/dataTransform";

export default function RecentReposList({ repositories = [] }) {
  const recent = getRecentlyUpdatedRepositories(repositories, 5);

  return (
    <section className="min-w-0 rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
      <h2 className="text-lg font-semibold text-white">Recently updated</h2>
      <p className="mt-1 text-sm text-github-muted">
        The five most recently updated repositories from the retrieved list.
      </p>

      {recent.length === 0 ? (
        <p className="mt-4 text-sm text-github-muted">No retrieved repositories to show.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {recent.map((repo) => (
            <li
              key={repo.id ?? repo.name}
              className="rounded-lg border border-github-border bg-github-bg px-3 py-3"
            >
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-github-link hover:underline"
              >
                {repo.name}
              </a>
              <p className="mt-1 text-xs text-github-muted">
                Updated {formatDate(repo.updated_at)} · {formatNumber(repo.stargazers_count)} stars
                · {repo.language || "Unknown"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
