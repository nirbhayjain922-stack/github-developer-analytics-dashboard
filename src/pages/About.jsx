import PageButtons from "../components/PageButtons";

export default function About() {
  return (
    <main className="mx-auto w-full max-w-3xl overflow-x-hidden px-4 py-10">
      <article className="rounded-2xl border border-github-border bg-github-card p-6 shadow-card sm:p-10">
        <h1 className="text-3xl font-semibold text-white">About this website</h1>
        <p className="mt-4 leading-7 text-github-muted">
          This project has four main pages that are connected with buttons and the
          top navigation: Home, Dashboard, Compare, and About. Each page uses
          React Router so the buttons open another page without a full reload.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-github-text">
          <li>
            <strong>Home</strong> — search a GitHub username, reopen a recent search, and start analysis.
          </li>
          <li>
            <strong>Dashboard</strong> — live profile, stats, charts, and a filterable repository list.
          </li>
          <li>
            <strong>Compare</strong> — compare two developers side by side.
          </li>
          <li>
            <strong>About</strong> — this page, with links back to every other page.
          </li>
        </ul>
        <p className="mt-6 leading-7 text-github-muted">
          Repository filters, sorting, and name search run on data already loaded from GitHub.
          Star and fork totals are labeled as retrieved data when GitHub pagination cannot return
          every public repository.
        </p>
      </article>

      <div className="mt-8">
        <PageButtons title="Open another page" />
      </div>
    </main>
  );
}
