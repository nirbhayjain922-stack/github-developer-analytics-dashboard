export default function ErrorMessage({
  message,
  isCached = false,
  onRetry,
  retryLabel = "Try again",
  retryDisabled = false,
}) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="rounded-xl border border-github-danger/40 bg-github-danger/10 px-4 py-3 text-sm text-github-danger"
      role="alert"
    >
      <p>{message}</p>
      {isCached && (
        <p className="mt-2 text-github-muted">Showing previously loaded data for this username.</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={retryDisabled}
          className="mt-3 inline-flex min-h-11 items-center rounded-lg border border-github-danger/40 bg-github-card px-4 py-2 text-sm font-semibold text-github-text transition hover:bg-github-bg disabled:cursor-not-allowed disabled:opacity-60"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
