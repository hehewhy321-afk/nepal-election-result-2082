import { useMemo } from "react";
import { motion } from "framer-motion";
import { Info, Percent, Trophy, AlertCircle, TrendingUp, Layout } from "lucide-react";
import type { PartyStats } from "@/types/election";
import { getCombinedParliamentSeats } from "@/lib/electionUtils";
import { useElectionData } from "@/hooks/useElectionData";
import FullParliamentMap from "./FullParliamentMap";

interface Props {
    partyStats: PartyStats[];
}

const PRSimulatorView = ({ partyStats }: Props) => {
    const TOTAL_PR_SEATS = 110;
    const THRESHOLD_PERCENT = 3;

    const { qualifiedParties, totalQualifiedVotes, belowThresholdParties } = useMemo(() => {
        const totalVotesAll = partyStats.reduce((acc, curr) => acc + curr.totalVotes, 0);

        const qualified = partyStats.filter(p => (p.totalVotes / totalVotesAll) * 100 >= THRESHOLD_PERCENT);
        const below = partyStats.filter(p => {
            const pct = (p.totalVotes / totalVotesAll) * 100;
            return pct > 0 && pct < THRESHOLD_PERCENT;
        });

        const totalQualVotes = qualified.reduce((acc, curr) => acc + curr.totalVotes, 0);

        return {
            qualifiedParties: qualified,
            totalQualifiedVotes: totalQualVotes,
            belowThresholdParties: below
        };
    }, [partyStats]);

    const seatDistribution = useMemo(() => {
        if (totalQualifiedVotes === 0) return [];

        // Simple Proportional Calculation (Largest Remainder Method - Simplified)
        const initialSeats = qualifiedParties.map(p => {
            const quota = (p.totalVotes / totalQualifiedVotes) * TOTAL_PR_SEATS;
            return {
                ...p,
                exactSeats: quota,
                assignedSeats: Math.floor(quota),
                remainder: quota - Math.floor(quota)
            };
        });

        let assignedCount = initialSeats.reduce((acc, curr) => acc + curr.assignedSeats, 0);
        const remainingSeats = TOTAL_PR_SEATS - assignedCount;

        // Distribute remaining seats to parties with largest remainders
        if (remainingSeats > 0) {
            const sortedByRemainder = [...initialSeats].sort((a, b) => b.remainder - a.remainder);
            for (let i = 0; i < remainingSeats; i++) {
                const partyName = sortedByRemainder[i].party;
                const index = initialSeats.findIndex(p => p.party === partyName);
                initialSeats[index].assignedSeats += 1;
            }
        }

        return initialSeats.sort((a, b) => b.assignedSeats - a.assignedSeats);
    }, [qualifiedParties, totalQualifiedVotes]);

    const { data: rawData } = useElectionData();

    const combinedSeats = useMemo(() => {
        if (!rawData) return [];
        return getCombinedParliamentSeats(rawData, seatDistribution);
    }, [rawData, seatDistribution]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Info */}
            <div className="card-premium p-6 border-l-4 border-l-primary flex gap-5 items-center">
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                    <Percent className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-foreground font-heading">Samanupatik (PR) Simulator</h2>
                    <p className="text-muted-foreground text-sm max-w-2xl">
                        Nepal's Parliament has 110 PR seats. A party must cross the <span className="text-primary font-bold">3% national threshold</span> to qualify for these seats. This calculator estimates the seat distribution based on current vote shares.
                    </p>
                </div>
            </div>

            {/* Parliament Map Section */}
            <div className="card-premium p-1 sm:p-2 bg-muted/20">
                <div className="p-4 border-b border-border/50 flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Layout className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-heading font-bold text-lg">Full Parliament Breakdown</h3>
                        <p className="text-xs text-muted-foreground">Combining 165 FPTP winners with 110 estimated PR seats</p>
                    </div>
                </div>
                <div className="p-4">
                    <FullParliamentMap seats={combinedSeats} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Qualified Parties List */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                            <Trophy className="w-5 h-5 text-yellow-500" />
                            Qualified Parties (Above 3%)
                        </h3>
                        <span className="text-xs font-black px-2 py-1 rounded bg-green-500/10 text-green-600 dark:text-green-400">
                            {qualifiedParties.length} PARTIES QUALIFIED
                        </span>
                    </div>

                    <div className="grid gap-4">
                        {seatDistribution.map((p, idx) => (
                            <motion.div
                                key={p.party}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="card-premium p-4 flex items-center justify-between group hover:border-primary/30 transition-all"
                            >
                                <div className="flex items-center gap-4 flex-1">
                                    <div
                                        className="w-1.5 h-12 rounded-full"
                                        style={{ backgroundColor: p.color }}
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-foreground">{p.party}</span>
                                            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase">
                                                {((p.totalVotes / (partyStats.reduce((a, b) => a + b.totalVotes, 0))) * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted h-1.5 rounded-full mt-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(p.totalVotes / totalQualifiedVotes) * 100}%` }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: p.color }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pl-6 text-right">
                                    <div className="text-2xl font-black text-primary leading-none">
                                        {p.assignedSeats}
                                    </div>
                                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                        EST. SEATS
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar: Below Threshold & Stats */}
                <div className="space-y-6">
                    <div className="card-premium p-5 space-y-4 bg-muted/30">
                        <h3 className="font-heading font-bold text-md flex items-center gap-2 text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            Below Threshold (&lt;3%)
                        </h3>
                        <div className="space-y-3">
                            {belowThresholdParties.length > 0 ? (
                                belowThresholdParties.slice(0, 8).map(p => (
                                    <div key={p.party} className="flex flex-col gap-1">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="truncate max-w-[150px]">{p.party}</span>
                                            <span className="text-muted-foreground">
                                                {((p.totalVotes / (partyStats.reduce((a, b) => a + b.totalVotes, 0))) * 100).toFixed(2)}%
                                            </span>
                                        </div>
                                        <div className="w-full bg-muted h-1 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-400 opacity-30"
                                                style={{ width: `${((p.totalVotes / (partyStats.reduce((a, b) => a + b.totalVotes, 0))) * 100) / 3 * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-muted-foreground italic">No parties currently in this range.</p>
                            )}
                            {belowThresholdParties.length > 8 && (
                                <p className="text-[10px] text-center text-muted-foreground pt-1">
                                    + {belowThresholdParties.length - 8} more minor parties
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="card-premium p-5 space-y-4">
                        <h3 className="font-heading font-bold text-md flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            Simulator Logic
                        </h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <span className="font-black text-xs">1</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Only votes belonging to parties crossing exactly 3% of total valid votes are pooled.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <span className="font-black text-xs">2</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    The pooled votes are divided by 110 to find the initial quota per seat.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <span className="font-black text-xs">3</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    Remaining seats are distributed based on the "Largest Remainder" principle.
                                </p>
                            </div>
                        </div>

                        <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 flex gap-2">
                            <Info className="w-4 h-4 text-blue-500 shrink-0" />
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 italic">
                                Note: This is a simulation and may vary slightly from official ECN calculations due to specific quota rounding rules.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PRSimulatorView;
