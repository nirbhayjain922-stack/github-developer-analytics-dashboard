import { Link, useLocation } from "react-router-dom";

export const PAGE_LINKS = [
  { to: "/", label: "Home", description: "Go to Home" },
  { to: "/dashboard/octocat", label: "Dashboard", description: "Go to Dashboard" },
  { to: "/compare", label: "Compare", description: "Go to Compare" },
  { to: "/about", label: "About", description: "Go to About" },
];

function isCurrentPath(pathname, to) {
  if (to === "/") {
    return pathname === "/";
  }

  if (to.startsWith("/dashboard")) {
    return pathname.startsWith("/dashboard");
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function PageButtons({ title = "Move between pages" }) {
  const location = useLocation();

  return (
    <nav className="rounded-xl border border-github-border bg-github-card p-4 sm:p-5" aria-label="Page links">
      <p className="mb-3 text-sm font-medium text-github-muted">{title}</p>
      <div className="flex flex-wrap gap-3">
        {PAGE_LINKS.map((page) => {
          const isCurrent = isCurrentPath(location.pathname, page.to);

          if (isCurrent) {
            return (
              <span
                key={page.to}
                className="inline-flex min-h-11 cursor-default items-center rounded-lg border border-github-border bg-github-border px-4 py-2 text-sm font-semibold text-white"
                aria-current="page"
              >
                {page.label} (current)
              </span>
            );
          }

          return (
            <Link
              key={page.to}
              to={page.to}
              className="inline-flex min-h-11 items-center rounded-lg bg-github-link px-4 py-2 text-sm font-semibold text-github-bg transition-colors hover:bg-blue-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-github-link"
            >
              {page.description}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
