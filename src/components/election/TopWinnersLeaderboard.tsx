import type { Candidate } from "@/types/election";
import { Trophy, Medal } from "lucide-react";
import { getPartyColor, getCandidateImageUrl } from "@/lib/electionUtils";
import { useState } from "react";

interface Props {
    data: Candidate[];
    onSelectCandidate: (c: Candidate) => void;
}

function getLeaders(data: Candidate[]): Candidate[] {
    // One leader per constituency — the candidate with the highest votes
    const byConst = new Map<string, Candidate>();
    data.forEach((c) => {
        const existing = byConst.get(c.SCConstID);
        if (!existing || (c.TotalVoteReceived || 0) > (existing.TotalVoteReceived || 0)) {
            byConst.set(c.SCConstID, c);
        }
    });
    return [...byConst.values()]
        .filter((c) => (c.TotalVoteReceived || 0) > 0)
        .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
}

const RankIcon = ({ rank }: { rank: number }) => {
    if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-400" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="text-xs font-bold text-muted-foreground w-4 text-center">{rank}</span>;
};

const PAGE_SIZE = 20;

const TopWinnersLeaderboard = ({ data, onSelectCandidate }: Props) => {
    const [page, setPage] = useState(1);
    const leaders = getLeaders(data);
    const hasVotes = leaders.length > 0;
    const paged = leaders.slice(0, page * PAGE_SIZE);

    return (
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-yellow-500/10">
                        <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                    </div>
                    <div>
                        <h3 className="text-sm font-heading font-bold text-foreground">
                            Top Vote Getters
                        </h3>
                        <p className="text-[11px] text-muted-foreground">
                            Highest vote-getters nationwide · one per constituency
                        </p>
                    </div>
                </div>
                {hasVotes && (
                    <span className="text-xs text-muted-foreground">{leaders.length} constituencies reporting</span>
                )}
            </div>

            {!hasVotes ? (
                <div className="px-5 py-10 text-center">
                    <p className="text-sm text-muted-foreground">
                        No votes counted yet. This leaderboard will populate as counting begins.
                    </p>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-border/30">
                        {paged.map((c, i) => {
                            const rank = i + 1;
                            const color = getPartyColor(c.PoliticalPartyName, i);
                            return (
                                <button
                                    key={c.CandidateID}
                                    onClick={() => onSelectCandidate(c)}
                                    className="w-full flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors text-left group"
                                >
                                    <div className="w-6 flex-shrink-0 flex items-center justify-center">
                                        <RankIcon rank={rank} />
                                    </div>

                                    <div className="relative flex-shrink-0">
                                        <div
                                            className="w-10 h-10 rounded-lg overflow-hidden border-2 bg-muted flex items-center justify-center p-0.5"
                                            style={{ borderColor: `${color}40` }}
                                        >
                                            <img
                                                src={getCandidateImageUrl(c.CandidateID)}
                                                alt={c.CandidateName}
                                                className="w-full h-full object-cover rounded-md"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                    target.parentElement!.innerHTML = `<div class="w-full h-full flex items-center justify-center text-white text-[10px] font-bold" style="background: linear-gradient(135deg, ${color}, ${color}99)">${c.CandidateName.charAt(0)}</div>`;
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                            {c.CandidateName}
                                        </p>
                                        <p className="text-[11px] text-muted-foreground truncate">
                                            {c.PoliticalPartyName} · {c.DistrictName} · Constituency {c.SCConstID}
                                        </p>
                                    </div>

                                    <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-heading font-bold" style={{ color }}>
                                            {(c.TotalVoteReceived || 0).toLocaleString()}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground">votes</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {paged.length < leaders.length && (
                        <div className="px-5 py-3 border-t border-border/40 text-center">
                            <button
                                onClick={() => setPage((p) => p + 1)}
                                className="text-xs font-semibold text-primary hover:underline"
                            >
                                Show more ({leaders.length - paged.length} remaining)
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TopWinnersLeaderboard;
