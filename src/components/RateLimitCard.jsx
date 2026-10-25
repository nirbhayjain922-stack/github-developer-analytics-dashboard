import { formatNumber } from "../utils/dataTransform";
import ErrorMessage from "./ErrorMessage";

export default function RateLimitCard({
  rateLimit,
  isLoading,
  isError,
  isFetching,
  error,
  onRetry,
}) {
  const core = rateLimit?.resources?.core || rateLimit?.rate;
  const limit = core?.limit ?? 0;
  const remaining = core?.remaining ?? 0;
  const used = typeof core?.used === "number" ? core.used : Math.max(limit - remaining, 0);

  return (
    <article className="min-w-0 rounded-xl border border-github-border bg-github-card p-5 shadow-card sm:p-6">
      <h2 className="text-lg font-semibold text-white">GitHub API</h2>
      <p className="mt-1 text-sm text-github-muted">
        Live rate-limit data from <code>/rate_limit</code>.
      </p>

      {isLoading && (
        <p className="mt-4 text-sm text-github-muted">Checking API quota...</p>
      )}

      {isError && (
        <div className="mt-4">
          <ErrorMessage
            message={error?.message || "The GitHub rate-limit status could not be loaded."}
            isCached={Boolean(rateLimit)}
            onRetry={onRetry}
            retryDisabled={isFetching}
            retryLabel={isFetching ? "Checking..." : "Try again"}
          />
        </div>
      )}

      {!isLoading && core && (
        <dl className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div>
            <dt className="text-xs uppercase tracking-wide text-github-muted">Limit</dt>
            <dd className="mt-1 text-xl font-semibold">{formatNumber(limit)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-github-muted">Used</dt>
            <dd className="mt-1 text-xl font-semibold">{formatNumber(used)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-github-muted">Remaining</dt>
            <dd className="mt-1 text-xl font-semibold text-github-success">
              {formatNumber(remaining)}
            </dd>
          </div>
        </dl>
      )}
    </article>
  );
}
