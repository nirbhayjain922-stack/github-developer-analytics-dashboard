import { Link } from "react-router-dom";
import PageButtons from "../components/PageButtons";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-xl flex-col justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-white">Page not found</h1>
      <p className="mt-3 text-github-muted">
        That route does not exist. Use a button below to open a real page.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="inline-flex rounded-lg bg-github-link px-4 py-2 text-sm font-semibold text-github-bg"
        >
          Back to Home
        </Link>
        <Link
          to="/dashboard/octocat"
          className="inline-flex rounded-lg bg-github-success px-4 py-2 text-sm font-semibold text-white"
        >
          Open Dashboard
        </Link>
      </div>
      <div className="mt-8 text-left">
        <PageButtons title="All pages" />
      </div>
    </main>
  );
}
