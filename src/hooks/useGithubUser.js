import { useQuery } from "@tanstack/react-query";
import { getUser } from "../services/githubApi";

/**
 * Fetches and caches a GitHub user profile.
 * Query key includes the username so octocat and torvalds stay separate.
 *
 * Caching: the first visit hits the GitHub API. Later visits for the same
 * username reuse cached data until staleTime expires (5 minutes).
 */
export function useGithubUser(username) {
  return useQuery({
    queryKey: ["githubUser", username],
    queryFn: ({ signal }) => getUser(username, { signal }),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
