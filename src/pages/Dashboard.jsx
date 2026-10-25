import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import PageButtons from "../components/PageButtons";
import ExportPdfButton from "../components/ExportPdfButton";
import ActivityChart from "../components/ActivityChart";
import ActivityTimeline from "../components/ActivityTimeline";
import EventTypeChart from "../components/EventTypeChart";
import EmptyState from "../components/EmptyState";
import ErrorMessage from "../components/ErrorMessage";
import LanguageChart from "../components/LanguageChart";
import Loading, { ProfileSkeleton, StatsSkeleton } from "../components/Loading";
import PopularReposChart from "../components/PopularReposChart";
import ProfileCard from "../components/ProfileCard";
import RateLimitCard from "../components/RateLimitCard";
import RecentReposList from "../components/RecentReposList";
import RepositoryTable from "../components/RepositoryTable";
import SearchBar from "../components/SearchBar";
import RecentSearches from "../components/RecentSearches";
import StatsCard from "../components/StatsCard";
import { useGithubAnalytics } from "../hooks/useGithubAnalytics";
import { useGithubRateLimit } from "../hooks/useGithubRateLimit";
import { useGithubRepositories } from "../hooks/useGithubRepositories";
import { useGithubUser } from "../hooks/useGithubUser";
import { useSearchHistory } from "../hooks/useSearchHistory";
import { formatDate, formatNumber, getAccountAge } from "../utils/dataTransform";
import { MAX_FETCHED_REPOS, isPartialRepositoryList } from "../services/githubApi";

export default function Dashboard() {
  const { username } = useParams();
  const decodedUsername = decodeURIComponent(username || "").trim();
  const reportRef = useRef(null);
  const { addUsername, history, clearHistory } = useSearchHistory();

  const userQuery = useGithubUser(decodedUsername);
  const repoQuery = useGithubRepositories(decodedUsername);
  const rateLimitQuery = useGithubRateLimit();
  const analyticsQuery = useGithubAnalytics(
    decodedUsername,
    repoQuery.data || []
  );

  const isBusy = userQuery.isFetching || repoQuery.isFetching;
  const showCachedUser = Boolean(userQuery.data) && userQuery.isError;
  const showCachedRepos = Boolean(repoQuery.data) && repoQuery.isError;
  const isPartial = isPartialRepositoryList(userQuery.data, repoQuery.data || []);
  const retrievedCount = repoQuery.data?.length ?? 0;
  const refresh = () => Promise.all([userQuery.refetch(), repoQuery.refetch(), analyticsQuery.refetchEvents(), rateLimitQuery.refetch()]);

  useEffect(() => {
    if (userQuery.data?.login) {
      addUsername(userQuery.data.login);
    }
  }, [userQuery.data?.login, addUsername]);

  const retrievedHint = isPartial
    ? `From ${formatNumber(retrievedCount)} retrieved repositories (up to ${formatNumber(MAX_FETCHED_REPOS)})`
    : "From retrieved public repositories";

  return (
    <main className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-8">
      <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white">GitHub Developer Analytics</h1>
          <p className="mt-2 text-sm text-github-muted">
            Explore public profile, repository, and recent activity data for{" "}
            <span className="break-all text-github-text">
              {decodedUsername || "a GitHub user"}
            </span>
            .
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button type="button" onClick={refresh} disabled={isBusy} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-github-border bg-github-card px-4 py-2.5 text-sm font-semibold text-white transition hover:border-github-link disabled:opacity-60">{isBusy ? "Refreshing…" : "Refresh data"}</button>
        <ExportPdfButton
          targetRef={reportRef}
          filename={`${decodedUsername || "github"}-analytics.pdf`}
          disabled={!userQuery.data}
          label="Export PDF"
        />
        </div>
      </section>
      <nav aria-label="Dashboard sections" className="mb-5 flex gap-2 overflow-x-auto pb-2 text-sm">{[["overview","Overview"],["repositories","Repositories"],["activity","Activity"]].map(([id,label])=><a key={id} href={`#${id}`} className="shrink-0 rounded-full border border-github-border px-3 py-2 text-github-muted hover:border-github-link hover:text-white">{label}</a>)}</nav>
      <div className="mb-6 max-w-xl">
        <SearchBar initialValue={decodedUsername} isBusy={isBusy} />
      </div>
      <div className="mb-6"><RecentSearches history={history} onClear={clearHistory} /></div>

      <div ref={reportRef} data-pdf-root className="space-y-6">
        {userQuery.data && <div className="border-b border-github-border pb-4"><h2 className="text-xl font-semibold text-white">{userQuery.data.login} · GitHub analytics report</h2><p className="mt-1 text-sm text-github-muted">Generated {new Date().toLocaleDateString()} · Public profile data</p></div>}
        {!decodedUsername && (
          <EmptyState
            title="No username provided"
            description="Please enter a GitHub username."
          />
        )}

        {decodedUsername && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="min-w-0 space-y-6 lg:col-span-2">
              {userQuery.isLoading && <ProfileSkeleton />}
              {userQuery.isError && (
                <ErrorMessage
                  message={
                    userQuery.error?.message ||
                    "Something went wrong while loading this profile. Please try again."
                  }
                  isCached={showCachedUser}
                  onRetry={() => userQuery.refetch()}
                  retryDisabled={userQuery.isFetching}
                  retryLabel={userQuery.isFetching ? "Retrying..." : "Try again"}
                />
              )}
              {userQuery.data && <ProfileCard user={userQuery.data} />}
            </div>
            <div className="min-w-0">
              <RateLimitCard
                rateLimit={rateLimitQuery.data}
                isLoading={rateLimitQuery.isLoading}
                isError={rateLimitQuery.isError}
                isFetching={rateLimitQuery.isFetching}
                error={rateLimitQuery.error}
                onRetry={() => rateLimitQuery.refetch()}
              />
            </div>
          </div>
        )}

        {decodedUsername && userQuery.isLoading && <StatsSkeleton />}

        {decodedUsername && userQuery.data && (
          <section id="overview" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              label="Followers"
              value={formatNumber(userQuery.data.followers)}
              hint="From the GitHub profile"
            />
            <StatsCard
              label="Following"
              value={formatNumber(userQuery.data.following)}
              hint="From the GitHub profile"
            />
            <StatsCard
              label="Public repositories"
              value={formatNumber(userQuery.data.public_repos)}
              hint="Complete count from the profile"
            />
            <StatsCard
              label="Account created"
              value={formatDate(userQuery.data.created_at)}
              hint={`GitHub account age: ${getAccountAge(userQuery.data.created_at)}`}
              icon="◷"
            />
            <StatsCard
              label={isPartial ? "Stars (retrieved)" : "Public stars"}
              value={repoQuery.data ? formatNumber(analyticsQuery.analytics.totalStars) : "—"}
              hint={retrievedHint}
            />
            <StatsCard
              label={isPartial ? "Forks (retrieved)" : "Public forks"}
              value={repoQuery.data ? formatNumber(analyticsQuery.analytics.totalForks) : "—"}
              hint={retrievedHint}
            />
            <StatsCard
              label="Public events returned"
              value={analyticsQuery.isLoadingEvents ? "…" : analyticsQuery.isErrorEvents ? "—" : formatNumber(analyticsQuery.events.length)}
              hint="Events in GitHub's limited recent public event window; not contribution totals"
              icon="◉"
            />
            <StatsCard label="Repositories retrieved" value={repoQuery.data ? formatNumber(analyticsQuery.analytics.repositoryCount) : "—"} hint={retrievedHint} />
            <StatsCard label="Languages found" value={repoQuery.data ? formatNumber(analyticsQuery.analytics.languageCount) : "—"} hint="Distinct primary languages across retrieved repositories" />
          </section>
        )}

        {decodedUsername && userQuery.data && isPartial && (
          <p className="rounded-lg border border-github-warning/30 bg-github-card px-4 py-3 text-sm text-github-muted">
            This account has {formatNumber(userQuery.data.public_repos)} public repositories.
            Star, fork, language, and table metrics below use the{" "}
            {formatNumber(retrievedCount)} repositories GitHub returned (maximum{" "}
            {formatNumber(MAX_FETCHED_REPOS)}), not a complete account-wide total.
          </p>
        )}

        {decodedUsername && userQuery.data && (
          <section className="grid gap-4 lg:grid-cols-3">
            <article className="min-w-0 rounded-xl border border-github-border bg-github-card p-5">
              <h2 className="text-sm text-github-muted">Most starred (retrieved)</h2>
              <p className="mt-2 break-words font-medium text-white">
                {analyticsQuery.analytics.mostStarred?.name || "Not available"}
              </p>
            </article>
            <article className="min-w-0 rounded-xl border border-github-border bg-github-card p-5">
              <h2 className="text-sm text-github-muted">Most forked (retrieved)</h2>
              <p className="mt-2 break-words font-medium text-white">
                {analyticsQuery.analytics.mostForked?.name || "Not available"}
              </p>
            </article>
            <article className="min-w-0 rounded-xl border border-github-border bg-github-card p-5">
              <h2 className="text-sm text-github-muted">Public gists</h2>
              <p className="mt-2 font-medium text-white">
                {formatNumber(userQuery.data.public_gists)}
              </p>
            </article>
          </section>
        )}

        {decodedUsername && (
          <section className="grid gap-6 lg:grid-cols-2">
            {repoQuery.isLoading && <Loading message="Loading repositories..." />}
            {repoQuery.isError && (
              <ErrorMessage
                message={
                  repoQuery.error?.message ||
                  "Repositories could not be loaded. Please try again."
                }
                isCached={showCachedRepos}
                onRetry={() => repoQuery.refetch()}
                retryDisabled={repoQuery.isFetching}
                retryLabel={repoQuery.isFetching ? "Retrying..." : "Try again"}
              />
            )}
            {repoQuery.data && (
              <LanguageChart data={analyticsQuery.analytics.languageDistribution} />
            )}
            <ActivityChart
              activity={analyticsQuery.activity}
              isLoading={analyticsQuery.isLoadingEvents}
              isError={analyticsQuery.isErrorEvents}
              onRetry={() => analyticsQuery.refetchEvents()}
            />
            <EventTypeChart events={analyticsQuery.events} />
          </section>
        )}

        {decodedUsername && repoQuery.data && (
          <section className="grid gap-6 lg:grid-cols-2">
            <PopularReposChart repositories={repoQuery.data} />
            <RecentReposList repositories={repoQuery.data} />
          </section>
        )}

        {decodedUsername && <ActivityTimeline events={analyticsQuery.events} isLoading={analyticsQuery.isLoadingEvents} isError={analyticsQuery.isErrorEvents} onRetry={() => analyticsQuery.refetchEvents()} />}

        {decodedUsername && repoQuery.data && (
          <RepositoryTable
            key={decodedUsername}
            repositories={repoQuery.data}
            fetchedNote={
              isPartial
                ? `Showing retrieved repositories only. Profile total: ${formatNumber(userQuery.data?.public_repos)}.`
                : undefined
            }
          />
        )}
      </div>

      <div className="mt-8">
        <PageButtons title="Go to another page" />
      </div>
    </main>
  );
}
