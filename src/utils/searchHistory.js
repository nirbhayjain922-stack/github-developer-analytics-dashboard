const STORAGE_KEY = "github-analytics-recent-searches";
const MAX_RECENT_SEARCHES = 5;

function normalizeUsername(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function readSearchHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      return [];
    }

    const usernames = [];
    const seen = new Set();

    parsed.forEach((item) => {
      const username = normalizeUsername(item);

      if (!username) {
        return;
      }

      const key = username.toLowerCase();

      if (seen.has(key)) {
        return;
      }

      seen.add(key);
      usernames.push(username);
    });

    return usernames.slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

export function writeSearchHistory(usernames) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usernames.slice(0, MAX_RECENT_SEARCHES)));
  } catch {
    // Ignore quota or private-mode write failures.
  }
}

export function addSearchHistoryUsername(username) {
  const trimmed = normalizeUsername(username);

  if (!trimmed) {
    return readSearchHistory();
  }

  const current = readSearchHistory();
  const next = [
    trimmed,
    ...current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase()),
  ].slice(0, MAX_RECENT_SEARCHES);

  writeSearchHistory(next);
  return next;
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage access errors.
  }

  return [];
}
