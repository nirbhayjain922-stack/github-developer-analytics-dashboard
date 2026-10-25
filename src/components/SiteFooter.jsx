import { Link } from "react-router-dom";
import { PAGE_LINKS } from "./PageButtons";

export default function SiteFooter() {
  return (
    <footer className="border-t border-github-border px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <p className="text-sm font-medium text-github-text">Site pages</p>
        <div className="flex flex-wrap justify-center gap-3">
          {PAGE_LINKS.map((page) => (
            <Link
              key={page.to}
              to={page.to}
              className="inline-flex rounded-lg border border-github-border px-4 py-2 text-sm font-semibold text-github-text transition-colors hover:bg-github-card"
            >
              {page.label}
            </Link>
          ))}
        </div>
        <p className="text-center text-xs text-github-muted">
          Built with the GitHub REST API. Unauthenticated requests are limited to 60 per hour.
        </p>
      </div>
    </footer>
  );
}
