const UNKNOWN_LANGUAGE = "Unknown";

export function calculateTotalStars(repositories = []) {
  return repositories.reduce((total, repo) => total + (repo.stargazers_count ?? 0), 0);
}

export function calculateTotalForks(repositories = []) {
  return repositories.reduce((total, repo) => total + (repo.forks_count ?? 0), 0);
}

export function calculateTotalIssues(repositories = []) {
  return repositories.reduce((total, repo) => total + (repo.open_issues_count ?? 0), 0);
}

export function getMostStarredRepository(repositories = []) {
  if (!repositories.length) {
    return null;
  }

  return repositories.reduce((best, repo) =>
    (repo.stargazers_count ?? 0) > (best.stargazers_count ?? 0) ? repo : best
  );
}

export function getMostForkedRepository(repositories = []) {
  if (!repositories.length) {
    return null;
  }

  return repositories.reduce((best, repo) =>
    (repo.forks_count ?? 0) > (best.forks_count ?? 0) ? repo : best
  );
}

export function getUniqueLanguages(repositories = []) {
  const languages = repositories
    .map((repo) => repo.language)
    .filter(Boolean);

  const unique = [...new Set(languages)].sort((a, b) => a.localeCompare(b));
  const hasUnknown = repositories.some((repo) => !repo.language);

  return hasUnknown ? [...unique, UNKNOWN_LANGUAGE] : unique;
}

export function calculateLanguageDistribution(repositories = []) {
  const counts = repositories.reduce((accumulator, repo) => {
    const language = repo.language || UNKNOWN_LANGUAGE;
    accumulator[language] = (accumulator[language] || 0) + 1;
    return accumulator;
  }, {});

  const total = repositories.length || 1;

  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percent: Math.round((value / total) * 100),
    }))
    .sort((a, b) => b.value - a.value);
}

export function sortRepositories(
  repositories = [],
  sortType = "stars",
  direction = "desc"
) {
  const copy = [...repositories];
  const dir = direction === "asc" ? 1 : -1;

  const compare = (left, right) => {
    switch (sortType) {
      case "forks":
        return (left.forks_count ?? 0) - (right.forks_count ?? 0);
      case "updated": {
        const leftTime = new Date(left.updated_at).getTime() || 0;
        const rightTime = new Date(right.updated_at).getTime() || 0;
        return leftTime - rightTime;
      }
      case "name":
        return (left.name || "").localeCompare(right.name || "", undefined, {
          sensitivity: "base",
        });
      case "stars":
      default:
        return (left.stargazers_count ?? 0) - (right.stargazers_count ?? 0);
    }
  };

  return copy.sort((a, b) => compare(a, b) * dir);
}

export function filterRepositories(
  repositories = [],
  languageOrOptions = "all",
  searchQuery = ""
) {
  const options =
    languageOrOptions && typeof languageOrOptions === "object"
      ? languageOrOptions
      : { language: languageOrOptions, query: searchQuery };

  const language = options.language || "all";
  const needle = String(options.query || "").trim().toLowerCase();

  return repositories.filter((repo) => {
    const matchesLanguage =
      !language || language === "all"
        ? true
        : language === UNKNOWN_LANGUAGE
          ? !repo.language
          : repo.language === language;

    const matchesQuery =
      !needle ||
      String(repo.name || "")
        .toLowerCase()
        .includes(needle);

    return matchesLanguage && matchesQuery;
  });
}

export function getRecentlyUpdatedRepositories(repositories = [], limit = 5) {
  return sortRepositories(repositories, "updated", "desc").slice(0, limit);
}

export function getMostPopularRepositories(repositories = [], limit = 8) {
  return sortRepositories(repositories, "stars", "desc")
    .slice(0, limit)
    .map((repo) => ({
      name: repo.name,
      stars: repo.stargazers_count ?? 0,
      forks: repo.forks_count ?? 0,
      url: repo.html_url,
    }));
}

export function calculateAnalytics(repositories = []) {
  const languageDistribution = calculateLanguageDistribution(repositories);

  return {
    repositoryCount: repositories.length,
    totalStars: calculateTotalStars(repositories),
    totalForks: calculateTotalForks(repositories),
    totalIssues: calculateTotalIssues(repositories),
    languageCount: getUniqueLanguages(repositories).length,
    mostStarred: getMostStarredRepository(repositories),
    mostForked: getMostForkedRepository(repositories),
    languageDistribution,
  };
}

/**
 * Groups public events by calendar date. This is real GitHub event activity,
 * not a contribution calendar (which the unauthenticated REST API does not expose).
 */
export function calculateActivityByDate(events = []) {
  const counts = events.reduce((accumulator, event) => {
    if (!event?.created_at) {
      return accumulator;
    }

    const date = event.created_at.slice(0, 10);
    accumulator[date] = (accumulator[date] || 0) + 1;
    return accumulator;
  }, {});

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function calculateEventTypeDistribution(events = []) {
  const counts = events.reduce((acc, event) => {
    const type = event?.type || "UnknownEvent";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

export function getAccountAge(createdAt, now = new Date()) {
  const created = new Date(createdAt);
  if (!createdAt || Number.isNaN(created.getTime())) return "Not available";
  let years = now.getFullYear() - created.getFullYear();
  const beforeAnniversary = now.getMonth() < created.getMonth() || (now.getMonth() === created.getMonth() && now.getDate() < created.getDate());
  if (beforeAnniversary) years -= 1;
  return `${years} ${years === 1 ? "year" : "years"}`;
}

export function formatDate(value) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "0";
  }

  return Number(value).toLocaleString();
}

export function displayText(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "Not available";
  }

  return value;
}

export function normalizeWebsite(url) {
  if (!url) {
    return null;
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `https://${url}`;
}
