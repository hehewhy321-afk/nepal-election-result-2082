import { useMemo } from "react";
import { getParliamentSeats } from "@/lib/electionUtils";
import type { Candidate } from "@/types/election";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ParliamentMapProps {
    data: Candidate[];
}

const ParliamentMap = ({ data }: ParliamentMapProps) => {
    const seats = useMemo(() => getParliamentSeats(data), [data]);

    // Group by party for legend
    const partyStats = useMemo(() => {
        const stats = new Map<string, { count: number; color: string }>();
        seats.forEach(s => {
            const existing = stats.get(s.leaderParty) || { count: 0, color: s.color };
            existing.count += 1;
            stats.set(s.leaderParty, existing);
        });
        return Array.from(stats.entries()).sort((a, b) => b[1].count - a[1].count);
    }, [seats]);

    return (
        <div className="space-y-8">
            <div className="card-premium p-6">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-xl font-heading font-bold">House of Representatives</h2>
                        <p className="text-sm text-muted-foreground">Constituency-wise seat distribution (165 Total)</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-primary" />
                            <span>Won / Leading</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-muted border border-border" />
                            <span>Awaiting Results</span>
                        </div>
                    </div>
                </div>

                <TooltipProvider>
                    <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-33 gap-1.5 md:gap-2">
                        {seats.map((seat) => (
                            <Tooltip key={seat.id}>
                                <TooltipTrigger asChild>
                                    <div
                                        className={cn(
                                            "aspect-square rounded-[20%] transition-all duration-300 hover:scale-125 hover:z-10 cursor-help border shadow-sm",
                                            seat.leaderVotes > 0 ? "border-transparent" : "bg-muted/30 border-dashed border-border/50"
                                        )}
                                        style={{
                                            backgroundColor: seat.leaderVotes > 0 ? seat.color : undefined,
                                            boxShadow: seat.leaderVotes > 0 ? `0 0 10px ${seat.color}33` : undefined
                                        }}
                                    />
                                </TooltipTrigger>
                                <TooltipContent className="p-3 max-w-[240px]">
                                    <div className="space-y-1.5">
                                        <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                                            {seat.district} - Area {seat.constituency}
                                        </p>
                                        {seat.leaderVotes > 0 ? (
                                            <>
                                                <p className="font-heading font-bold">{seat.leaderName}</p>
                                                <p className="text-xs font-medium text-primary">{seat.leaderParty}</p>
                                                <div className="pt-1 mt-1 border-t border-border flex justify-between items-center">
                                                    <span className="text-[10px] font-bold">VOTES:</span>
                                                    <span className="text-xs font-bold tabular-nums">{seat.leaderVotes.toLocaleString()}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-xs italic text-muted-foreground">No votes counted yet</p>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {partyStats.map(([party, stats]) => (
                    <div key={party} className="card-premium p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: stats.color }}
                            />
                            <span className="text-sm font-medium truncate max-w-[140px]">{party}</span>
                        </div>
                        <span className="text-lg font-heading font-bold tabular-nums">{stats.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParliamentMap;
