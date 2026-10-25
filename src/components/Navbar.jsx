import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import githubMark from "../assets/github-mark.svg";
import { useAuth } from "../context/AuthContext";

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard/octocat", label: "Dashboard" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-github-border text-white"
        : "text-github-muted hover:bg-github-card hover:text-github-text",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 border-b border-github-border bg-github-canvas/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3" aria-label="Primary">
        <Link to="/" className="flex items-center gap-2 text-github-text">
          <img src={githubMark} alt="" className="h-6 w-6" />
          <span className="text-sm font-semibold tracking-wide sm:text-base">
            GitHub Analytics
          </span>
        </Link>

        <button
          type="button"
          className="min-h-11 rounded-md border border-github-border px-3 py-1.5 text-sm text-github-text md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? "Close" : "Menu"}
        </button>

        <div className="hidden items-center gap-3 md:flex">
          <ul className="flex items-center gap-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={linkClass} end={link.to === "/"}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          {user && (
            <div className="flex items-center gap-3 border-l border-github-border pl-3">
              <span className="max-w-[12rem] truncate text-xs text-github-muted" title={user.email}>
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md border border-github-border px-3 py-1.5 text-sm font-medium text-github-text transition hover:bg-github-card"
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </nav>

      {isOpen && (
        <ul id="mobile-nav" className="space-y-1 border-t border-github-border px-4 py-3 md:hidden">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={linkClass}
                end={link.to === "/"}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          {user && (
            <li className="pt-2">
              <p className="px-3 pb-2 text-xs text-github-muted">{user.email}</p>
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full rounded-md border border-github-border px-3 py-2 text-left text-sm font-medium text-github-text"
              >
                Log out
              </button>
            </li>
          )}
        </ul>
      )}
    </header>
  );
}
