import { useQuery } from "@tanstack/react-query";
import { compareDevelopers } from "../services/githubApi";

/**
 * Loads two developers in parallel through compareDevelopers(), which uses
 * Promise.all so neither user waits for the other to finish first.
 */
export function useGithubCompare(username1, username2) {
  return useQuery({
    queryKey: ["githubCompare", username1, username2],
    queryFn: ({ signal }) => compareDevelopers(username1, username2, { signal }),
    enabled: Boolean(username1 && username2),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}
