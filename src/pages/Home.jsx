import { Link } from "react-router-dom";
import PageButtons from "../components/PageButtons";
import RecentSearches from "../components/RecentSearches";
import SearchBar from "../components/SearchBar";
import { useSearchHistory } from "../hooks/useSearchHistory";

const EXAMPLE_USERS = ["octocat", "gaearon", "sindresorhus", "torvalds"];

export default function Home() {
  const { history, clearHistory } = useSearchHistory();

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-4xl flex-col justify-center overflow-x-hidden px-4 py-12">
      <section className="rounded-2xl border border-github-border bg-github-card px-6 py-12 text-center shadow-card sm:px-10">
        <p className="text-sm uppercase tracking-[0.2em] text-github-muted">
          Real GitHub REST data
        </p>
        <h1 className="mt-4 text-3xl font-semibold text-white sm:text-5xl">
          GitHub Developer Analytics
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base text-github-muted sm:text-lg">
          Analyze GitHub developers using real-time repository and profile data.
        </p>
        <div className="mx-auto mt-8 max-w-xl text-left">
          <SearchBar />
        </div>
        <div className="mx-auto mt-6 max-w-xl">
          <RecentSearches history={history} onClear={clearHistory} />
        </div>
        <div className="mt-8">
          <p className="text-sm text-github-muted">Try an example username</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2">
            {EXAMPLE_USERS.map((username) => (
              <li key={username}>
                <Link
                  to={`/dashboard/${username}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-github-border px-3 py-1.5 text-sm text-github-link transition-colors hover:bg-github-bg"
                >
                  {username}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/dashboard/octocat"
            className="inline-flex min-h-11 items-center rounded-lg bg-github-success px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-600"
          >
            Open Dashboard
          </Link>
          <Link
            to="/compare"
            className="inline-flex min-h-11 items-center rounded-lg bg-github-link px-5 py-2.5 text-sm font-semibold text-github-bg transition-colors hover:bg-blue-400"
          >
            Compare Developers
          </Link>
          <Link
            to="/about"
            className="inline-flex min-h-11 items-center rounded-lg border border-github-border px-5 py-2.5 text-sm font-semibold text-github-text transition-colors hover:bg-github-bg"
          >
            About This Site
          </Link>
        </div>
      </section>
      <div className="mt-8">
        <PageButtons title="Visit another page" />
      </div>
    </main>
  );
}
