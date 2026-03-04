import { useQuery } from "@tanstack/react-query";
import type { Candidate } from "@/types/election";

// In dev, Vite proxies /election-api → https://result.election.gov.np (bypasses CORS).
// In production, the browser fetches directly – election.gov.np should allow it or
// the local copy is used as fallback.
const PROXY_URL =
  "/election-api/JSONFiles/ElectionResultCentral2082.txt?_search=true&nd=1772632829696&rows=10000&page=1&sidx=_id&sord=desc";
const LOCAL_URL = "/data/election-results-2082.json";

async function fetchElectionData(): Promise<Candidate[]> {
  const parseText = (text: string) => {
    const clean = text.startsWith("\uFEFF") ? text.slice(1) : text;
    return JSON.parse(clean) as Candidate[];
  };

  // 1. Try via Proxy (Vite in dev, Vercel rewrite in prod)
  try {
    const res = await fetch(PROXY_URL, { signal: AbortSignal.timeout(15000) });
    if (res.ok) return parseText(await res.text());
  } catch (error) {
    console.warn("Proxy fetch failed, falling back to local data...", error);
  }

  // 2. Local cache fallback
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
    refetchInterval: refetchInterval || false,
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
