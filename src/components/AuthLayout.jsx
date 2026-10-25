import githubMark from "../assets/github-mark.svg";

export default function AuthLayout({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <main className="auth-shell relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />
        <div className="auth-orb auth-orb-three" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur">
            <img src={githubMark} alt="" className="h-5 w-5" />
            <span className="text-sm font-medium text-github-text">
              GitHub Developer Analytics
            </span>
          </div>
          <h1 className="mt-8 max-w-lg text-5xl font-semibold leading-tight tracking-tight text-white">
            See a developer&apos;s GitHub story
            <span className="auth-gradient-text"> in one dashboard.</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-github-muted">
            Sign in with email and password. No OTP, no extra steps — then open
            live profile, repository, and language analytics.
          </p>
          <ul className="mt-8 grid max-w-md gap-3 text-sm text-github-text">
            <li className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
              Real GitHub REST data, not dummy numbers
            </li>
            <li className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
              Compare developers side by side
            </li>
            <li className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 backdrop-blur">
              Fast return visits with cached results
            </li>
          </ul>
        </section>

        <section className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src={githubMark} alt="" className="h-8 w-8" />
            <p className="text-lg font-semibold text-white">GitHub Analytics</p>
          </div>
          <article className="rounded-3xl border border-white/10 bg-[#161b22]/80 p-7 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-github-link">
              {eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-github-muted">{subtitle}</p>
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-center text-sm">{footer}</div>}
          </article>
        </section>
      </div>
    </main>
  );
}
