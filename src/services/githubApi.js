import axios from "axios";

const GITHUB_API_BASE_URL = "https://api.github.com";

export const MAX_REPO_PAGES = 5;
export const REPOS_PER_PAGE = 100;
export const MAX_FETCHED_REPOS = MAX_REPO_PAGES * REPOS_PER_PAGE;

const githubClient = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  },
  timeout: 15000,
});

// This browser-only app uses public endpoints without credentials. Never put a
// GitHub token in Vite env vars: VITE_* values are bundled into client code.

function isCanceled(error) {
  return (
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError"
  );
}

export function getGithubErrorMessage(error) {
  const status = error?.response?.status;
  const apiMessage = error?.response?.data?.message;

  if (error?.code === "ERR_NETWORK" || error?.message === "Network Error") {
    return "We could not connect to GitHub. Check your internet connection and try again.";
  }

  if (error?.code === "ECONNABORTED") {
    return "The request to GitHub took too long. Please try again.";
  }

  if (status === 404) {
    return "No GitHub user was found with that username. Check the spelling and try again.";
  }

  if (status === 401) {
    return "GitHub rejected the request (authentication failed). Public profile data is available without a token; check your network or deployment configuration.";
  }

  if (status === 403 || status === 429) {
    const message = typeof apiMessage === "string" ? apiMessage.toLowerCase() : "";
    const remaining = error?.response?.headers?.["x-ratelimit-remaining"];
    const isRateLimit =
      status === 429 ||
      remaining === "0" ||
      message.includes("rate limit") ||
      message.includes("api rate limit");

    if (isRateLimit) {
      return "GitHub has temporarily limited requests from this network. Wait a few minutes, then try again.";
    }

    return "GitHub denied this request. The profile may be private or restricted.";
  }

  if (status >= 500) {
    return "GitHub is having trouble right now. Please try again in a moment.";
  }

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return "GitHub could not complete this request. Please try again.";
  }

  return "Something went wrong while loading GitHub data. Please try again.";
}

function throwFormattedError(error) {
  if (isCanceled(error)) {
    throw error;
  }

  if (
    error instanceof Error &&
    !error.response &&
    !error.isAxiosError &&
    !error.code
  ) {
    throw error;
  }

  const formatted = new Error(getGithubErrorMessage(error));
  formatted.status = error?.response?.status;
  formatted.original = error;
  throw formatted;
}

export async function getUser(username, { signal } = {}) {
  try {
    const { data } = await githubClient.get(`/users/${encodeURIComponent(username)}`, {
      signal,
    });

    return data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function getRepositories(username, { signal } = {}) {
  try {
    const repositories = [];

    for (let page = 1; page <= MAX_REPO_PAGES; page += 1) {
      if (signal?.aborted) {
        const abortError = new Error("canceled");
        abortError.code = "ERR_CANCELED";
        abortError.name = "CanceledError";
        throw abortError;
      }

      const { data } = await githubClient.get(
        `/users/${encodeURIComponent(username)}/repos`,
        {
          signal,
          params: {
            per_page: REPOS_PER_PAGE,
            page,
            sort: "updated",
            direction: "desc",
          },
        }
      );

      if (!Array.isArray(data)) {
        throw new Error("GitHub returned an unexpected response for repositories.");
      }

      repositories.push(...data);

      if (data.length < REPOS_PER_PAGE) {
        break;
      }
    }

    return repositories;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function getUserEvents(username, { signal } = {}) {
  try {
    const { data } = await githubClient.get(
      `/users/${encodeURIComponent(username)}/events/public`,
      {
        signal,
        params: {
          per_page: 100,
        },
      }
    );

    return Array.isArray(data) ? data : [];
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function getRateLimit({ signal } = {}) {
  try {
    const { data } = await githubClient.get("/rate_limit", { signal });
    return data;
  } catch (error) {
    throwFormattedError(error);
  }
}

export async function getUserAndRepositories(username, { signal } = {}) {
  const [user, repositories] = await Promise.all([
    getUser(username, { signal }),
    getRepositories(username, { signal }),
  ]);

  return {
    user,
    repositories,
  };
}

export async function compareDevelopers(username1, username2, { signal } = {}) {
  const [first, second] = await Promise.all([
    getUserAndRepositories(username1, { signal }),
    getUserAndRepositories(username2, { signal }),
  ]);

  return {
    first,
    second,
  };
}

export function isPartialRepositoryList(user, repositories = []) {
  const publicRepos = user?.public_repos ?? 0;
  return repositories.length < publicRepos;
}
