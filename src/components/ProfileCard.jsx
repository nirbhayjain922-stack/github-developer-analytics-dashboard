import { displayText, formatDate, formatNumber, normalizeWebsite } from "../utils/dataTransform";

export default function ProfileCard({ user }) {
  const website = normalizeWebsite(user.blog);
  const created = formatDate(user.created_at);

  return (
    <article className="min-w-0 rounded-xl border border-github-border bg-github-card p-5 shadow-card sm:p-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <img
          src={user.avatar_url}
          alt={`${user.login} avatar`}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
          className="h-24 w-24 rounded-full border border-github-border object-cover"
        />
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-2xl font-semibold text-white">
            {displayText(user.name)}
          </h2>
          <p className="mt-1 text-github-link">@{user.login}</p>
          <p className="mt-3 text-sm leading-6 text-github-muted">
            {displayText(user.bio)}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
        <div className="min-w-0">
          <dt className="text-github-muted">Location</dt>
          <dd className="break-words">{displayText(user.location)}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-github-muted">Website</dt>
          <dd>
            {website ? (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="break-all text-github-link hover:underline"
              >
                {user.blog}
              </a>
            ) : (
              "Not available"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-github-muted">Followers</dt>
          <dd>{formatNumber(user.followers)}</dd>
        </div>
        <div>
          <dt className="text-github-muted">Following</dt>
          <dd>{formatNumber(user.following)}</dd>
        </div>
        <div>
          <dt className="text-github-muted">Public repositories</dt>
          <dd>{formatNumber(user.public_repos)}</dd>
        </div>
        <div>
          <dt className="text-github-muted">Public gists</dt>
          <dd>{formatNumber(user.public_gists)}</dd>
        </div>
        <div>
          <dt className="text-github-muted">Account created</dt>
          <dd>{created}</dd>
        </div>
        <div className="min-w-0">
          <dt className="text-github-muted">GitHub profile</dt>
          <dd>
            <a
              href={user.html_url}
              target="_blank"
              rel="noreferrer"
              className="text-github-link hover:underline"
            >
              View on GitHub
            </a>
          </dd>
        </div>
      </dl>
    </article>
  );
}
