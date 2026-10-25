import { useMemo, useState } from "react";
import EmptyState from "./EmptyState";
import {
  filterRepositories,
  formatDate,
  formatNumber,
  getUniqueLanguages,
  sortRepositories,
} from "../utils/dataTransform";

const DEFAULT_FILTERS = {
  sortType: "stars",
  direction: "desc",
  language: "all",
  query: "",
  forks: false,
  archived: false,
};

export default function RepositoryTable({ repositories, fetchedNote }) {
  const [sortType, setSortType] = useState(DEFAULT_FILTERS.sortType);
  const [direction, setDirection] = useState(DEFAULT_FILTERS.direction);
  const [language, setLanguage] = useState(DEFAULT_FILTERS.language);
  const [query, setQuery] = useState(DEFAULT_FILTERS.query);
  const [showForks, setShowForks] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  const languages = useMemo(
    () => getUniqueLanguages(repositories),
    [repositories]
  );

  const visibleRepositories = useMemo(() => {
    const filtered = filterRepositories(repositories, { language, query }).filter((repo) =>
      (showForks || !repo.fork) && (showArchived || !repo.archived)
    );
    return sortRepositories(filtered, sortType, direction);
  }, [repositories, language, query, sortType, direction, showForks, showArchived]);

  const hasActiveFilters =
    language !== DEFAULT_FILTERS.language ||
    query.trim() !== "" ||
    sortType !== DEFAULT_FILTERS.sortType ||
    direction !== DEFAULT_FILTERS.direction;
  const filtersActive = hasActiveFilters || showForks || showArchived;

  const clearFilters = () => {
    setSortType(DEFAULT_FILTERS.sortType);
    setDirection(DEFAULT_FILTERS.direction);
    setLanguage(DEFAULT_FILTERS.language);
    setQuery(DEFAULT_FILTERS.query);
    setShowForks(false);
    setShowArchived(false);
  };

  const handleSortTypeChange = (nextType) => {
    setSortType(nextType);
    setDirection(nextType === "name" ? "asc" : "desc");
  };

  if (!repositories.length) {
    return (
      <EmptyState
        title="No public repositories"
        description="GitHub did not return any public repositories for this developer."
      />
    );
  }

  return (
    <section id="repositories" className="rounded-xl border border-github-border bg-github-card p-4 shadow-card sm:p-6">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Repositories</h2>
            <p className="mt-1 text-sm text-github-muted">
              {visibleRepositories.length} of {repositories.length} retrieved repositories match
              the current filters.
            </p>
            {fetchedNote && (
              <p className="mt-1 text-xs text-github-muted">{fetchedNote}</p>
            )}
          </div>
          {filtersActive && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-github-border px-4 py-2 text-sm font-medium text-github-text transition hover:bg-github-bg"
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <label className="text-sm text-github-muted" htmlFor="repo-search">
            Search by name
            <input
              id="repo-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Find a repository"
              className="control-field"
            />
          </label>
          <label className="text-sm text-github-muted" htmlFor="repo-language">
            Language
            <select
              id="repo-language"
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              className="control-field"
            >
              <option value="all">All languages</option>
              {languages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-github-muted" htmlFor="repo-sort">
            Sort by
            <select
              id="repo-sort"
              value={sortType}
              onChange={(event) => handleSortTypeChange(event.target.value)}
              className="control-field"
            >
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="updated">Last updated</option>
              <option value="name">Repository name</option>
            </select>
          </label>
          <label className="text-sm text-github-muted" htmlFor="repo-direction">
            Order
            <select
              id="repo-direction"
              value={direction}
              onChange={(event) => setDirection(event.target.value)}
              className="control-field"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-github-muted">
          <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={showForks} onChange={(e) => setShowForks(e.target.checked)} />Include forked repositories</label>
          <label className="inline-flex min-h-11 items-center gap-2"><input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} />Include archived repositories</label>
        </div>
      </div>

      {visibleRepositories.length === 0 ? (
        <EmptyState
          title="No repositories match"
          description="Try a different name, language, or clear the filters to see retrieved repositories again."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex min-h-11 items-center rounded-lg bg-github-link px-4 py-2 text-sm font-semibold text-github-bg hover:bg-blue-400"
            >
              Clear filters
            </button>
          }
        />
      ) : (
        <>
          <ul className="space-y-3 lg:hidden">
            {visibleRepositories.map((repo) => (
              <li
                key={repo.id ?? repo.name}
                className="rounded-lg border border-github-border bg-github-bg p-4"
              >
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-github-link hover:underline"
                >
                  {repo.name}
                </a>
                <p className="mt-2 text-sm text-github-muted">
                  {repo.description || "No description"}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-github-muted">
                  <div>
                    <dt className="uppercase tracking-wide">Stars</dt>
                    <dd className="text-github-text">{formatNumber(repo.stargazers_count)}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wide">Forks</dt>
                    <dd className="text-github-text">{formatNumber(repo.forks_count)}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wide">Language</dt>
                    <dd className="text-github-text">{repo.language || "Unknown"}</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-wide">Updated</dt>
                    <dd className="text-github-text">{formatDate(repo.updated_at)}</dd>
                  </div>
                </dl>
                <details className="mt-3 border-t border-github-border pt-3 text-sm"><summary className="min-h-11 cursor-pointer pt-2 text-github-link">Repository details</summary><dl className="grid grid-cols-2 gap-2 text-xs text-github-muted"><div><dt>Default branch</dt><dd>{repo.default_branch || "Not available"}</dd></div><div><dt>License</dt><dd>{repo.license?.spdx_id || "Not specified"}</dd></div><div><dt>Visibility</dt><dd>{repo.visibility || "public"}</dd></div><div><dt>Created</dt><dd>{formatDate(repo.created_at)}</dd></div><div><dt>Archived</dt><dd>{repo.archived ? "Yes" : "No"}</dd></div></dl></details>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto lg:block">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-github-border text-github-muted">
                <tr>
                  <th scope="col" className="px-3 py-3 font-medium">Name</th>
                  <th scope="col" className="px-3 py-3 font-medium">Description</th>
                  <th scope="col" className="px-3 py-3 font-medium">Stars</th>
                  <th scope="col" className="px-3 py-3 font-medium">Forks</th>
                  <th scope="col" className="px-3 py-3 font-medium">Open issues</th>
                  <th scope="col" className="px-3 py-3 font-medium">Language</th>
                  <th scope="col" className="px-3 py-3 font-medium">Updated</th>
                </tr>
              </thead>
              <tbody>
                {visibleRepositories.map((repo) => (
                  <tr
                    key={repo.id ?? repo.name}
                    className="border-b border-github-border/70 last:border-0"
                  >
                    <td className="px-3 py-3 font-medium">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-github-link hover:underline"
                      >
                        {repo.name}
                      </a>
                      <details className="mt-1 text-xs"><summary className="min-h-8 cursor-pointer text-github-muted">Details</summary><span>{repo.description || "No description"} · {repo.fork ? "Fork" : "Original"}{repo.archived ? " · Archived" : ""} · branch {repo.default_branch || "unknown"} · {repo.license?.spdx_id || "No license specified"}</span></details>
                    </td>
                    <td className="max-w-xs px-3 py-3 text-github-muted">
                      {repo.description || "Not available"}
                    </td>
                    <td className="px-3 py-3">{formatNumber(repo.stargazers_count)}</td>
                    <td className="px-3 py-3">{formatNumber(repo.forks_count)}</td>
                    <td className="px-3 py-3">{formatNumber(repo.open_issues_count)}</td>
                    <td className="px-3 py-3">{repo.language || "Not available"}</td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatDate(repo.updated_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
