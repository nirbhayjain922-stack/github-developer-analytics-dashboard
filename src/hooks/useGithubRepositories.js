import { useQuery } from "@tanstack/react-query";
import { getRepositories } from "../services/githubApi";

/**
 * Fetches and caches public repositories for a username.
 * Components only consume this hook — they never call Axios.
 */
export function useGithubRepositories(username) {
  return useQuery({
    queryKey: ["githubRepositories", username],
    queryFn: ({ signal }) => getRepositories(username, { signal }),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
