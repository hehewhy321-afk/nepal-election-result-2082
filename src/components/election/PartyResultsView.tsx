import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import type { Candidate } from "@/types/election";
import { getPartyStats, getPartyColor } from "@/lib/electionUtils";
import { Progress } from "@/components/ui/progress";
import PartyChart from "./PartyChart";
import PartyComparison from "./PartyComparison";
import DistrictTable from "./DistrictTable";
import { toPng } from "html-to-image";
import { ShareCard } from "./ShareCard";
import { Share2, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface PartyResultsViewProps {
    data: Candidate[];
    parties: string[];
    districtStats: any[];
}

const PartyResultsView = ({ data, parties, districtStats }: PartyResultsViewProps) => {
    const partyStats = useMemo(() => getPartyStats(data), [data]);

    // Calculate total candidates per party
    const partyCounts = useMemo(() => {
        const counts = new Map<string, number>();
        data.forEach(c => {
            counts.set(c.PoliticalPartyName, (counts.get(c.PoliticalPartyName) || 0) + 1);
        });
        return Array.from(counts.entries())
            .map(([party, count]) => ({ party, count }))
            .sort((a, b) => b.count - a.count);
    }, [data]);

    const maxCount = Math.max(...partyCounts.map(p => p.count));

    const [sharingParty, setSharingParty] = useState<string | null>(null);
    const [shareSuccess, setShareSuccess] = useState<string | null>(null);

    const handleShareParty = async (party: any) => {
        setSharingParty(party.party);
        try {
            await new Promise(r => setTimeout(r, 300));
            const node = document.getElementById(`share-party-${party.party.replace(/\s+/g, '-')}`);
            if (!node) throw new Error("Capture node not found");

            let dataUrl;
            try {
                // Attempt 1: Full capture
                dataUrl = await toPng(node, {
                    quality: 1.0,
                    pixelRatio: 2,
                    skipFonts: false,
                    cacheBust: true,
                });
            } catch (corsErr) {
                console.warn("CORS/Capture error, retrying in Safe Mode...");
                // Attempt 2: Safe Mode (Filter out external images that cause CORS issues)
                dataUrl = await toPng(node, {
                    quality: 1.0,
                    pixelRatio: 2,
                    skipFonts: false,
                    cacheBust: true,
                    filter: (node: any) => {
                        if (node.tagName === 'IMG' && node.src && node.src.includes('election.gov.np')) {
                            return false;
                        }
                        return true;
                    }
                });
            }

            const link = document.createElement('a');
            link.download = `${party.party.replace(/\s+/g, '_')}_Stats_2082.png`;
            link.href = dataUrl;
            link.click();

            setShareSuccess(party.party);
            toast.success(`${party.party} result card ready!`);
            setTimeout(() => setShareSuccess(null), 2000);
        } catch (err) {
            console.error("Final capture failure:", err);
            toast.error("Could not generate card. Please try again.");
        } finally {
            setSharingParty(null);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <PartyChart data={partyStats} />
                        <div className="card-premium p-6 flex flex-col">
                            <h3 className="text-sm font-black text-primary/60 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Efficiency Metrics
                            </h3>
                            <div className="space-y-6">
                                {useMemo(() => {
                                    const topEfficiency = [...partyStats]
                                        .filter(p => (p.seatsWon || 0) > 0 && p.totalVotes > 50000)
                                        .sort((a, b) => (a.totalVotes / (a.seatsWon || 1)) - (b.totalVotes / (b.seatsWon || 1)))[0];

                                    const topStrike = [...partyStats]
                                        .filter(p => p.candidates > 10)
                                        .sort((a, b) => ((b.seatsWon || 0) / b.candidates) - ((a.seatsWon || 0) / a.candidates))[0];

                                    const totalCandidates = partyStats.reduce((acc, p) => acc + p.candidates, 0);
                                    const totalVotes = partyStats.reduce((acc, p) => acc + p.totalVotes, 0);
                                    const supportDensity = totalCandidates > 0 ? Math.round(totalVotes / totalCandidates) : 0;

                                    return (
                                        <>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground">Most Efficient</span>
                                                    <span className="text-xs font-bold" style={{ color: topEfficiency?.color || 'var(--primary)' }}>
                                                        {topEfficiency?.party || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end bg-accent/20 p-2 rounded-lg mt-1 group hover:bg-accent/30 transition-colors">
                                                    <span className="text-xs">Votes per Seat</span>
                                                    <span className="font-mono font-black text-lg">
                                                        {topEfficiency ? Math.round(topEfficiency.totalVotes / (topEfficiency.seatsWon || 1)).toLocaleString() : "0"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-black uppercase text-muted-foreground">Highest Strike Rate</span>
                                                    <span className="text-xs font-bold" style={{ color: topStrike?.color || 'var(--destructive)' }}>
                                                        {topStrike?.party || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-end bg-accent/20 p-2 rounded-lg mt-1 group hover:bg-accent/30 transition-colors">
                                                    <span className="text-xs">Winning %</span>
                                                    <span className="font-mono font-black text-lg">
                                                        {topStrike ? (((topStrike.seatsWon || 0) / topStrike.candidates) * 100).toFixed(1) : "0"}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] font-black uppercase text-muted-foreground">Voter Support Density</span>
                                                <div className="flex justify-between items-end bg-accent/20 p-2 rounded-lg mt-1 group hover:bg-accent/30 transition-colors">
                                                    <span className="text-xs">Avg Votes/Candidate</span>
                                                    <span className="font-mono font-black text-lg">
                                                        {supportDensity.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </>
                                    );
                                }, [partyStats])}
                            </div>
                            <div className="mt-auto pt-6 border-t border-border/40">
                                <p className="text-[10px] leading-relaxed text-muted-foreground italic flex items-start gap-1.5">
                                    <span className="shrink-0 w-3 h-3 rounded-full bg-accent/50 flex items-center justify-center text-[8px] not-italic font-bold">i</span>
                                    Calculations based on major parties (&gt;50k total votes) to prioritize statistically significant insights.
                                </p>
                            </div>
                        </div>
                    </div>
                    <PartyComparison data={data} parties={parties} />
                </div>

                <div className="card-premium p-6 space-y-6 overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-heading font-bold text-lg mb-1">Performance Index</h3>
                            <p className="text-xs text-muted-foreground">Conversion of candidates to actual seats won</p>
                        </div>
                        <div className="bg-primary/10 px-2 py-1 rounded text-[10px] font-black text-primary">LIVE</div>
                    </div>

                    <div className="space-y-5 h-[650px] overflow-y-auto pr-2 no-scrollbar">
                        {partyStats.map((p, idx) => (
                            <div key={p.party} className="space-y-2 group">
                                <div className="flex justify-between text-xs font-bold items-center">
                                    <div className="flex items-center gap-2 truncate max-w-[180px]">
                                        <div className="w-1 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                                        <span className="truncate">{p.party}</span>
                                    </div>
                                    <div className="flex gap-3 font-mono">
                                        <span className="text-primary">{p.seatsWon || 0}W</span>
                                        <span className="opacity-40">/</span>
                                        <span className="text-muted-foreground">{p.candidates}F</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShareParty(p);
                                            }}
                                            disabled={!!sharingParty}
                                            className={cn(
                                                "w-5 h-5 rounded-full flex items-center justify-center transition-all ml-1",
                                                shareSuccess === p.party ? "bg-emerald-500 text-white" : "hover:bg-primary/20 text-muted-foreground/50 hover:text-primary"
                                            )}
                                        >
                                            {sharingParty === p.party ? (
                                                <Clock className="w-3 h-3 animate-spin" />
                                            ) : shareSuccess === p.party ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                <Share2 className="w-3 h-3" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {/* Hidden Capture Node for this party */}
                                <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
                                    <div id={`share-party-${p.party.replace(/\s+/g, '-')}`}>
                                        <ShareCard type="party" data={p} />
                                    </div>
                                </div>
                                <div className="relative h-1.5 w-full bg-accent/20 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(p.candidates / Math.max(...partyStats.map(ps => ps.candidates))) * 100}%` }}
                                        className="absolute left-0 top-0 h-full opacity-30"
                                        style={{ backgroundColor: p.color }}
                                    />
                                    {p.seatsWon && p.seatsWon > 0 && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((p.seatsWon || 0) / p.candidates) * 100}%` }}
                                            className="absolute left-0 top-0 h-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                                            style={{ backgroundColor: p.color }}
                                        />
                                    )}
                                </div>
                                {p.seatsWon && p.seatsWon > 0 && (
                                    <div className="flex justify-between text-[9px] uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-muted-foreground text-[10px]">Strike Rate</span>
                                        <span className="font-black" style={{ color: p.color }}>{(((p.seatsWon || 0) / p.candidates) * 100).toFixed(1)}%</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-primary" />
                    District Wise Vote Distribution
                </h3>
                <DistrictTable data={districtStats} />
            </div>
        </div>
    );
};

export default PartyResultsView;
