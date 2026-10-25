import { useMemo, useRef, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import ExportPdfButton from "../components/ExportPdfButton";
import PageButtons from "../components/PageButtons";
import Loading from "../components/Loading";
import { useGithubCompare } from "../hooks/useGithubCompare";
import { calculateAnalytics, formatNumber } from "../utils/dataTransform";
import { isPartialRepositoryList } from "../services/githubApi";
import { useGithubAnalytics } from "../hooks/useGithubAnalytics";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { getAccountAge } from "../utils/dataTransform";

const METRICS = [
  { key: "followers", label: "Followers", source: "profile" },
  { key: "following", label: "Following", source: "profile" },
  { key: "publicRepos", label: "Public repositories", source: "profile" },
  { key: "retrievedRepos", label: "Retrieved repositories", source: "retrieved" },
  { key: "gists", label: "Gists", source: "profile" },
  { key: "stars", label: "Stars (retrieved)", source: "retrieved" },
  { key: "forks", label: "Forks (retrieved)", source: "retrieved" },
  { key: "mainLanguage", label: "Main language", source: "retrieved" },
  { key: "accountAge", label: "Account age", source: "profile" },
  { key: "activity", label: "Recent public events returned", source: "events" },
  { key: "issues", label: "Open issues (retrieved)", source: "retrieved" },
];

function buildRow(user, repositories) {
  const analytics = calculateAnalytics(repositories);

  return {
    login: user.login,
    avatar: user.avatar_url,
    followers: user.followers ?? 0,
    following: user.following ?? 0,
    publicRepos: user.public_repos ?? 0,
    retrievedRepos: analytics.repositoryCount,
    gists: user.public_gists ?? 0,
    stars: analytics.totalStars,
    forks: analytics.totalForks,
    mainLanguage: analytics.languageDistribution[0]?.name || "Not available",
    accountAge: getAccountAge(user.created_at),
    issues: analytics.totalIssues,
    isPartial: isPartialRepositoryList(user, repositories),
  };
}

export default function Compare() {
  const [username1, setUsername1] = useState("");
  const [username2, setUsername2] = useState("");
  const [submitted, setSubmitted] = useState({ first: "", second: "" });
  const [formError, setFormError] = useState("");
  const reportRef = useRef(null);

  const compareQuery = useGithubCompare(submitted.first, submitted.second);
  const firstActivity = useGithubAnalytics(submitted.first, compareQuery.data?.first.repositories || []);
  const secondActivity = useGithubAnalytics(submitted.second, compareQuery.data?.second.repositories || []);
  const isBusy = compareQuery.isFetching;

  const rows = useMemo(() => {
    if (!compareQuery.data) {
      return null;
    }

    return {
      left: buildRow(compareQuery.data.first.user, compareQuery.data.first.repositories),
      right: buildRow(compareQuery.data.second.user, compareQuery.data.second.repositories),
    };
  }, [compareQuery.data]);
  if (rows) { rows.left.activity = firstActivity.events.length; rows.right.activity = secondActivity.events.length; }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    const first = username1.trim();
    const second = username2.trim();

    if (!first || !second || !/^[a-zA-Z0-9-]{1,39}$/.test(first) || !/^[a-zA-Z0-9-]{1,39}$/.test(second)) {
      setFormError("Enter two valid GitHub usernames (letters, numbers, or hyphens; up to 39 characters).");
      return;
    }

    setFormError("");
    setSubmitted({ first, second });
  };

  return (
    <main className="mx-auto w-full max-w-5xl overflow-x-hidden px-4 py-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white">Developer comparison</h1>
          <p className="mt-2 text-sm text-github-muted">
            Compare public profile and repository data side by side. Repository totals use retrieved public repositories only.
          </p>
        </div>
        <ExportPdfButton
          targetRef={reportRef}
          filename={`${submitted.first}-vs-${submitted.second}.pdf`}
          disabled={!rows}
          label="Export PDF"
        />
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-6 grid gap-4 rounded-xl border border-github-border bg-github-card p-5 sm:p-6 md:grid-cols-2"
      >
        <label className="text-sm text-github-muted" htmlFor="compare-user-1">
          Developer 1
          <input
            id="compare-user-1"
            value={username1}
            disabled={isBusy}
            onChange={(event) => setUsername1(event.target.value)}
            className="control-field"
            placeholder="Enter GitHub username"
          />
        </label>
        <label className="text-sm text-github-muted" htmlFor="compare-user-2">
          Developer 2
          <input
            id="compare-user-2"
            value={username2}
            disabled={isBusy}
            onChange={(event) => setUsername2(event.target.value)}
            className="control-field"
            placeholder="Enter GitHub username"
          />
        </label>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isBusy}
            className="inline-flex min-h-11 items-center rounded-lg bg-github-link px-5 py-2.5 text-sm font-semibold text-github-bg transition-colors hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Comparing..." : "Compare"}
          </button>
        </div>
      </form>

      {formError && (
        <div className="mt-4">
          <ErrorMessage message={formError} />
        </div>
      )}
      {compareQuery.isLoading && (
        <div className="mt-6">
          <Loading message="Loading developer profiles..." />
        </div>
      )}
      {compareQuery.isError && (
        <div className="mt-6">
          <ErrorMessage
            message={
              compareQuery.error?.message ||
              "The comparison could not be completed. Please try again."
            }
            onRetry={() => compareQuery.refetch()}
            retryDisabled={compareQuery.isFetching}
            retryLabel={compareQuery.isFetching ? "Retrying..." : "Try again"}
          />
        </div>
      )}

      {rows && (
        <section
          ref={reportRef}
          data-pdf-root
          className="mt-6 overflow-x-auto rounded-xl border border-github-border bg-github-card p-4 sm:p-6"
        >
          <div className="mb-5 border-b border-github-border pb-4"><h2 className="text-xl font-semibold text-white">{rows.left.login} vs {rows.right.login} · Developer comparison</h2><p className="mt-1 text-sm text-github-muted">Generated {new Date().toLocaleDateString()} · Public profile and retrieved repository data</p></div>
          {(rows.left.isPartial || rows.right.isPartial) && (
            <p className="mb-4 text-sm text-github-muted">
              Star, fork, and issue totals use retrieved repositories, not a complete
              account-wide total, when GitHub returns a partial list.
            </p>
          )}
          <div className="mb-6 grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1.2fr)] items-center gap-2 text-center sm:gap-4">
            <div />
            <div className="min-w-0">
              <img
                src={rows.left.avatar}
                alt={`${rows.left.login} avatar`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="mx-auto h-14 w-14 rounded-full border border-github-border sm:h-16 sm:w-16"
              />
              <p className="mt-2 break-all font-medium text-white">{rows.left.login}</p>
            </div>
            <div className="min-w-0">
              <img
                src={rows.right.avatar}
                alt={`${rows.right.login} avatar`}
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
                className="mx-auto h-14 w-14 rounded-full border border-github-border sm:h-16 sm:w-16"
              />
              <p className="mt-2 break-all font-medium text-white">{rows.right.login}</p>
            </div>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-github-border text-github-muted">
                <th scope="col" className="px-2 py-3 text-left sm:px-3">Metric</th>
                <th scope="col" className="px-2 py-3 sm:px-3">
                  {rows.left.login}
                </th>
                <th scope="col" className="px-2 py-3 sm:px-3">
                  {rows.right.login}
                </th>
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => {
                const leftValue = rows.left[metric.key];
                const rightValue = rows.right[metric.key];
                const leftWins = leftValue > rightValue;
                const rightWins = rightValue > leftValue;

                return (
                  <tr key={metric.key} className="border-b border-github-border/70 last:border-0">
                    <th
                      scope="row"
                      className="px-2 py-3 text-left font-medium text-github-muted sm:px-3"
                    >
                      {metric.label}
                    </th>
                    <td
                      className={`px-2 py-3 text-center sm:px-3 ${leftWins ? "font-semibold text-github-success" : ""}`}
                    >
                      {typeof leftValue === "number" ? formatNumber(leftValue) : leftValue}
                    </td>
                    <td
                      className={`px-2 py-3 text-center sm:px-3 ${rightWins ? "font-semibold text-github-success" : ""}`}
                    >
                      {typeof rightValue === "number" ? formatNumber(rightValue) : rightValue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <section className="mt-6"><h2 className="text-base font-semibold text-white">Metric comparison</h2><p className="mt-1 text-sm text-github-muted">Profile counts and totals from retrieved public repositories.</p><div className="mt-3 h-72 min-w-[480px]" role="img" aria-label={`Comparison chart for ${rows.left.login} and ${rows.right.login}`}><ResponsiveContainer width="100%" height="100%"><BarChart data={[{metric:"Followers",[rows.left.login]:rows.left.followers,[rows.right.login]:rows.right.followers},{metric:"Public repos",[rows.left.login]:rows.left.publicRepos,[rows.right.login]:rows.right.publicRepos},{metric:"Retrieved stars",[rows.left.login]:rows.left.stars,[rows.right.login]:rows.right.stars},{metric:"Retrieved forks",[rows.left.login]:rows.left.forks,[rows.right.login]:rows.right.forks}]}><CartesianGrid stroke="#30363d" vertical={false}/><XAxis dataKey="metric" stroke="#8b949e" tick={{fontSize:11}}/><YAxis allowDecimals={false} stroke="#8b949e"/><Tooltip contentStyle={{backgroundColor:"#161b22",border:"1px solid #30363d",color:"#e6edf3"}}/><Legend/><Bar dataKey={rows.left.login} fill="#58a6ff"/><Bar dataKey={rows.right.login} fill="#3fb950"/></BarChart></ResponsiveContainer></div></section>
        </section>
      )}
      {!submitted.first && !submitted.second && <div className="mt-6 rounded-xl border border-dashed border-github-border bg-github-card p-8 text-center"><h2 className="font-semibold text-white">Ready to compare</h2><p className="mt-2 text-sm text-github-muted">Enter two GitHub usernames above to load public profile, repository, and recent event data.</p></div>}

      <div className="mt-8">
        <PageButtons title="Go to another page" />
      </div>
    </main>
  );
}
