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

    // Group by party for legend - ONLY count if they are actually leading
    const partyStats = useMemo(() => {
        const stats = new Map<string, { count: number; color: string }>();
        seats.forEach(s => {
            if (s.leaderParty) {
                const existing = stats.get(s.leaderParty) || { count: 0, color: s.color };
                existing.count += 1;
                stats.set(s.leaderParty, existing);
            }
        });
        return Array.from(stats.entries()).sort((a, b) => b[1].count - a[1].count);
    }, [seats]);

    // Arched layout configuration
    // Row 1-7 totaling 165 seats
    // We use explicit X and Y radii percentages to perfectly fit an aspect-[2/1] container
    const ROW_CONFIG = [
        { count: 14, rx: 18, ry: 36 },
        { count: 18, rx: 23, ry: 46 },
        { count: 22, rx: 28, ry: 56 },
        { count: 26, rx: 33, ry: 66 },
        { count: 30, rx: 38, ry: 76 },
        { count: 34, rx: 43, ry: 86 },
        { count: 21, rx: 48, ry: 96 }, // Total 165
    ];

    const seatsWithPositions = useMemo(() => {
        const result: (any)[] = [];
        let seatIdx = 0;

        ROW_CONFIG.forEach((row, rowIdx) => {
            for (let i = 0; i < row.count; i++) {
                if (seatIdx >= seats.length) break;

                // Calculate angle: distribute seats across an arc
                // Using 10 to 170 degrees so the bottom seats don't hit the flat baseline exactly
                const minAngle = 10;
                const maxAngle = 170;
                const angleDeg = maxAngle - (i * ((maxAngle - minAngle) / Math.max(1, row.count - 1)));
                const angleRad = (angleDeg * Math.PI) / 180;

                // Pure percentage positioning relative to center bottom (50%, 95%)
                const x = 50 + row.rx * Math.cos(angleRad);
                const y = 95 - row.ry * Math.sin(angleRad);

                result.push({
                    ...seats[seatIdx],
                    x: `${x}%`,
                    y: `${y}%`,
                    rotation: 90 - angleDeg
                });
                seatIdx++;
            }
        });
        return result;
    }, [seats]);

    return (
        <div className="space-y-8">
            <div className="card-premium p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-xl font-heading font-bold">House of Representatives</h2>
                        <p className="text-sm text-muted-foreground">Arched seating layout • 165 Total Seats</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                            <span className="text-muted-foreground">Won / Leading</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-800 border border-border" />
                            <span className="text-muted-foreground">Awaiting Results</span>
                        </div>
                    </div>
                </div>

                <TooltipProvider>
                    <div className="relative w-full aspect-[2/1] max-w-[1000px] mx-auto overflow-visible pb-4">
                        {/* Central Label - Nepali style */}
                        <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
                            <p className="text-3xl sm:text-5xl font-heading font-black text-foreground/80 drop-shadow-sm">१६५</p>
                            <p className="text-sm sm:text-lg font-bold text-muted-foreground/60 -mt-1">सिट</p>
                        </div>

                        {/* Seats */}
                        {seatsWithPositions.map((seat) => (
                            <Tooltip key={seat.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        className={cn(
                                            "absolute w-[2.2%] sm:w-[2.6%] lg:w-[3%] aspect-square transition-all duration-300 hover:scale-[1.8] hover:z-20 cursor-help flex items-center justify-center",
                                            seat.leaderVotes > 0 ? "text-primary opacity-100" : "text-slate-300 dark:text-slate-700 opacity-50"
                                        )}
                                        style={{
                                            left: seat.x,
                                            top: seat.y,
                                            transform: `translate(-50%, -50%) rotate(${seat.rotation}deg)`,
                                            color: seat.leaderVotes > 0 ? seat.color : undefined
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h1zM9 7v4h6V7a3 3 0 0 0-6 0z" />
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="p-3 max-w-[240px] z-[100]">
                                    <div className="space-y-1.5">
                                        <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1 mb-1">
                                            {seat.district} - Area {seat.constituency}
                                        </p>
                                        {seat.leaderVotes > 0 ? (
                                            <>
                                                <p className="font-heading font-bold text-sm leading-tight text-primary">
                                                    {seat.leaderName}
                                                </p>
                                                <p className="text-[11px] font-semibold text-foreground/80">{seat.leaderParty}</p>
                                                <div className="pt-1.5 mt-1 border-t border-border/40 flex justify-between items-center">
                                                    <span className="text-[9px] font-black text-muted-foreground uppercase">Votes Received</span>
                                                    <span className="text-xs font-black tabular-nums">{seat.leaderVotes.toLocaleString()}</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex items-center gap-2 py-1">
                                                <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                                                <p className="text-[11px] font-medium text-muted-foreground italic">Counting in progress...</p>
                                            </div>
                                        )}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {partyStats.map(([party, stats]) => (
                    <div key={party} className="card-premium p-3.5 flex flex-col gap-1 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2.5 h-2.5 rounded-full shadow-sm"
                                style={{ backgroundColor: stats.color }}
                            />
                            <span className="text-[11px] font-bold text-muted-foreground truncate uppercase tracking-tight">{party}</span>
                        </div>
                        <span className="text-xl font-heading font-black tabular-nums">{stats.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParliamentMap;
