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
    const totalVotes = candidates.reduce((sum, c) => sum + (c.TotalVoteReceived || 0), 0);

    // Simple heuristic for "Won" vs "Leading" - ECN has a Rank field, but we'll use votes
    // For now, if votes > 0, they are "Leading". 
    // Usually Rank "1" and some marker for "Elected" is needed.

    return {
      id,
      district: leader.DistrictName,
      constituency: String(leader.SCConstID),
      leaderName: leader.CandidateName,
      leaderParty: leader.PoliticalPartyName,
      leaderVotes: leader.TotalVoteReceived || 0,
      totalVotes,
      isWon: leader.Rank === "1" && leader.TotalVoteReceived > 0, // Placeholder logic
      color: getPartyColor(leader.PoliticalPartyName, 0)
    };
  });
}
