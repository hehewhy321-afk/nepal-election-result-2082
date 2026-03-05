import { useQuery } from "@tanstack/react-query";
import type { Candidate } from "@/types/election";

// The official endpoint ElectionResultCentral2082.txt is offline (Returns 404).
// We use the centralized, high-speed GitHub feed that updates every 15 minutes.
const CENTRALIZED_FEED_URL = "https://raw.githubusercontent.com/hehewhy321/nepal-election-2082-data/main/data/election-results-2082.json";
const LOCAL_URL = "/data/election-results-2082.json";

async function fetchElectionData(): Promise<Candidate[]> {
  const parseText = (text: string) => {
    const clean = text.startsWith("\uFEFF") ? text.slice(1) : text;
    return JSON.parse(clean) as Candidate[];
  };

  // Try fetching from the live centralized feed first for real-time updates
  try {
    // Add cache-busting query param so browsers don't hold stale data
    const liveRes = await fetch(`${CENTRALIZED_FEED_URL}?t=${new Date().getTime()}`);
    if (liveRes.ok) {
      return parseText(await liveRes.text());
    }
  } catch (error) {
    console.warn("Live centralized feed failed, falling back to local snapshot.");
  }

  // Local cache fallback
  const res = await fetch(LOCAL_URL);
  if (!res.ok) throw new Error("Failed to load election data");
  return parseText(await res.text());
}

export function useElectionData(refetchInterval?: number) {
  return useQuery<Candidate[]>({
    queryKey: ["election-results-2082"],
    queryFn: fetchElectionData,
    staleTime: 5 * 60 * 1000,       // 5 minutes
    gcTime: 30 * 60 * 1000,          // 30 minutes
    refetchInterval: refetchInterval || 5 * 60 * 1000,
    retry: 2,
  });
}

/** Returns true if at least some candidates have votes recorded */
export function isResultsAvailable(data: Candidate[]): boolean {
  return data.some((c) => (c.TotalVoteReceived || 0) > 0);
}

export function isPartialResults(data: Candidate[]): boolean {
  const withVotes = data.filter((c) => (c.TotalVoteReceived || 0) > 0).length;
  return withVotes > 0 && withVotes < data.length;
}
