import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserEvents } from "../services/githubApi";
import { calculateActivityByDate, calculateAnalytics } from "../utils/dataTransform";

/**
 * Derives dashboard analytics from already-fetched repositories and loads
 * public events for the activity chart. Event fetching is independent of
 * repository fetching, so TanStack Query runs it as its own cached query.
 */
export function useGithubAnalytics(username, repositories = []) {
  const eventsQuery = useQuery({
    queryKey: ["githubEvents", username],
    queryFn: ({ signal }) => getUserEvents(username, { signal }),
    enabled: Boolean(username),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });

  const analytics = useMemo(
    () => calculateAnalytics(repositories),
    [repositories]
  );

  const activity = useMemo(
    () => calculateActivityByDate(eventsQuery.data || []),
    [eventsQuery.data]
  );

  return {
    analytics,
    activity,
    events: eventsQuery.data || [],
    isLoadingEvents: eventsQuery.isLoading,
    isErrorEvents: eventsQuery.isError,
    eventsError: eventsQuery.error,
    isFetchingEvents: eventsQuery.isFetching,
    refetchEvents: eventsQuery.refetch,
  };
}
