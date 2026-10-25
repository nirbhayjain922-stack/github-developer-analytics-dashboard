import { useQuery } from "@tanstack/react-query";
import { getRateLimit } from "../services/githubApi";

export function useGithubRateLimit() {
  return useQuery({
    queryKey: ["githubRateLimit"],
    queryFn: ({ signal }) => getRateLimit({ signal }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 0,
    refetchOnMount: false,
  });
}
