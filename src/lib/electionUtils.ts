import type { Candidate, PartyStats, ProvinceStats, GenderStats } from "@/types/election";

export const getCandidateImageUrl = (candidateId: number) =>
  `https://result.election.gov.np/Images/Candidate/${candidateId}.jpg`;

export const getSymbolImageUrl = (symbolId: number) =>
  `https://result.election.gov.np/Images/symbol-hor-pa/${symbolId}.jpg`;

const PARTY_COLORS: Record<string, string> = {
  "नेपाली काँग्रेस": "#E74C3C",
  "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी लेनिनवादी)": "#E53935",
  "नेकपा (एकीकृत समाजवादी)": "#FF9800",
  "राष्ट्रिय स्वतन्त्र पार्टी": "#2196F3",
  "राष्ट्रिय प्रजातन्त्र पार्टी": "#4CAF50",
  "जनता समाजवादी पार्टी, नेपाल": "#9C27B0",
  "लोकतान्त्रिक समाजवादी पार्टी, नेपाल": "#00BCD4",
  "नेपाल मजदुर किसान पार्टी": "#795548",
  "जनमत पार्टी": "#607D8B",
  "नागरिक उन्मुक्ति पार्टी": "#FF5722",
};

const CHART_COLORS = [
  "#C62828", "#1565C0", "#F9A825", "#2E7D32", "#6A1B9A",
  "#EF6C00", "#00838F", "#4E342E", "#37474F", "#D84315",
  "#AD1457", "#283593", "#558B2F", "#6D4C41", "#455A64",
];

export function getPartyColor(party: string, index: number): string {
  return PARTY_COLORS[party] || CHART_COLORS[index % CHART_COLORS.length];
}

export function getPartyStats(data: Candidate[]): PartyStats[] {
  const map = new Map<string, { totalVotes: number; candidates: number }>();
  data.forEach((c) => {
    const existing = map.get(c.PoliticalPartyName) || { totalVotes: 0, candidates: 0 };
    existing.totalVotes += c.TotalVoteReceived || 0;
    existing.candidates += 1;
    map.set(c.PoliticalPartyName, existing);
  });

  return Array.from(map.entries())
    .map(([party, stats], i) => ({
      party,
      ...stats,
      color: getPartyColor(party, i),
    }))
    .sort((a, b) => b.totalVotes - a.totalVotes);
}

export function getProvinceStats(data: Candidate[]): ProvinceStats[] {
  const map = new Map<string, { totalVotes: number; candidates: number }>();
  data.forEach((c) => {
    const existing = map.get(c.StateName) || { totalVotes: 0, candidates: 0 };
    existing.totalVotes += c.TotalVoteReceived || 0;
    existing.candidates += 1;
    map.set(c.StateName, existing);
  });

  return Array.from(map.entries())
    .map(([province, stats]) => ({ province, ...stats }))
    .sort((a, b) => b.totalVotes - a.totalVotes);
}

export function getGenderStats(data: Candidate[]): GenderStats[] {
  const map = new Map<string, number>();
  data.forEach((c) => {
    map.set(c.Gender, (map.get(c.Gender) || 0) + 1);
  });
  return Array.from(map.entries()).map(([gender, count]) => ({ gender, count }));
}

export function getTopCandidates(data: Candidate[], limit = 20): Candidate[] {
  return [...data].sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0)).slice(0, limit);
}

export function getDistrictStats(data: Candidate[]) {
  const map = new Map<string, { totalVotes: number; candidates: number }>();
  data.forEach((c) => {
    const existing = map.get(c.DistrictName) || { totalVotes: 0, candidates: 0 };
    existing.totalVotes += c.TotalVoteReceived || 0;
    existing.candidates += 1;
    map.set(c.DistrictName, existing);
  });
  return Array.from(map.entries())
    .map(([district, stats]) => ({ district, ...stats }))
    .sort((a, b) => b.totalVotes - a.totalVotes);
}

export function getParliamentSeats(data: Candidate[]) {
  const constituencies = new Map<string, Candidate[]>();

  data.forEach((c) => {
    const key = `${c.DistrictCd}-${c.SCConstID}`;
    const existing = constituencies.get(key) || [];
    existing.push(c);
    constituencies.set(key, existing);
  });

  return Array.from(constituencies.entries()).map(([id, candidates]) => {
    // Sort by votes to find leader
    const sorted = [...candidates].sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
    const leader = sorted[0];
    const leaderVotes = leader.TotalVoteReceived || 0;
    const totalVotes = candidates.reduce((sum, c) => sum + (c.TotalVoteReceived || 0), 0);

    return {
      id,
      district: leader.DistrictName,
      constituency: String(leader.SCConstID),
      leaderId: leaderVotes > 0 ? leader.CandidateID : null,
      leaderName: leaderVotes > 0 ? leader.CandidateName : null,
      leaderParty: leaderVotes > 0 ? leader.PoliticalPartyName : null,
      leaderVotes,
      totalVotes,
      isWon: leader.Rank === "1" && leaderVotes > 0,
      color: leaderVotes > 0 ? getPartyColor(leader.PoliticalPartyName, 0) : undefined
    };
  });
}

/**
 * Returns exactly one unique winner per constituency by deduplicating 
 * any redundant "Rank 1" entries from the raw data feed.
 */
export function getUniqueWinners(data: Candidate[]): Candidate[] {
  const byConstituency = new Map<string, Candidate[]>();

  // Group by unique constituency identifier
  data.forEach((c) => {
    if (c.Rank === "1" && (c.TotalVoteReceived || 0) > 0) {
      const key = `${c.DistrictCd}-${c.SCConstID}`;
      const existing = byConstituency.get(key) || [];
      existing.push(c);
      byConstituency.set(key, existing);
    }
  });

  const winners: Candidate[] = [];

  // Extract strictly the single highest voted candidate per constituency group
  byConstituency.forEach((candidates) => {
    const sorted = [...candidates].sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
    if (sorted.length > 0) {
      winners.push(sorted[0]);
    }
  });

  return winners;
}
export function getTopCandidatesByConstituency(
  data: Candidate[],
  districtCd: number,
  constId: number | string,
  limit = 3
): Candidate[] {
  return data
    .filter(
      (c) =>
        Number(c.DistrictCd) === districtCd && String(c.SCConstID) === String(constId)
    )
    .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0))
    .slice(0, limit);
}

export function getConstituencyOptions(data: Candidate[]) {
  const districtsMap = new Map<number, string>();
  const constsMap = new Map<string, { districtCd: number; constId: string; label: string }>();

  data.forEach((c) => {
    districtsMap.set(Number(c.DistrictCd), c.DistrictName);
    const key = `${c.DistrictCd}-${c.SCConstID}`;
    if (!constsMap.has(key)) {
      constsMap.set(key, {
        districtCd: Number(c.DistrictCd),
        constId: String(c.SCConstID),
        label: `${c.DistrictName}-${c.SCConstID}`,
      });
    }
  });

  return {
    districts: Array.from(districtsMap.entries()).map(([id, name]) => ({ id, name })),
    constituencies: Array.from(constsMap.values()),
  };
}
