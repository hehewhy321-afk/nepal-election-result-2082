import { useMemo } from "react";
import { getCandidateImageUrl } from "@/lib/electionUtils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface FullParliamentMapProps {
    seats: any[];
}

const FullParliamentMap = ({ seats }: FullParliamentMapProps) => {
    // Group by party for legend
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

    // Arched layout configuration for 275 seats
    const ROW_CONFIG = [
        { count: 18, rx: 15, ry: 30 },
        { count: 22, rx: 19, ry: 38 },
        { count: 26, rx: 23, ry: 46 },
        { count: 30, rx: 27, ry: 54 },
        { count: 34, rx: 31, ry: 62 },
        { count: 38, rx: 35, ry: 70 },
        { count: 42, rx: 39, ry: 78 },
        { count: 46, rx: 43, ry: 86 },
        { count: 19, rx: 47, ry: 94 },
    ];

    const seatsWithPositions = useMemo(() => {
        const result: (any)[] = [];
        let seatIdx = 0;

        ROW_CONFIG.forEach((row, rowIdx) => {
            for (let i = 0; i < row.count; i++) {
                if (seatIdx >= seats.length) break;

                const minAngle = 10;
                const maxAngle = 170;
                const angleDeg = maxAngle - (i * ((maxAngle - minAngle) / Math.max(1, row.count - 1)));
                const angleRad = (angleDeg * Math.PI) / 180;

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
        <div className="space-y-6">
            <div className="card-premium p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">165 FPTP + 110 PR • 275 Combined Seats</p>
                    </div>
                </div>

                <TooltipProvider>
                    <div className="relative w-full aspect-[2/1] max-w-[1000px] mx-auto overflow-visible pb-4">
                        {/* Central Label */}
                        <div className="absolute bottom-[4%] left-1/2 -translate-x-1/2 text-center pointer-events-none">
                            <p className="text-3xl sm:text-5xl font-heading font-black text-foreground/80 drop-shadow-sm">२७५</p>
                            <p className="text-sm sm:text-lg font-bold text-muted-foreground/60 -mt-1">सिट</p>
                        </div>

                        {/* Seats */}
                        {seatsWithPositions.map((seat) => (
                            <Tooltip key={seat.id}>
                                <TooltipTrigger asChild>
                                    <button
                                        className={cn(
                                            "absolute w-[1.8%] sm:w-[2.2%] lg:w-[2.5%] aspect-square transition-all duration-300 hover:scale-[1.8] hover:z-20 cursor-help flex items-center justify-center",
                                            seat.isWon ? "opacity-100 drop-shadow-sm" : "opacity-30"
                                        )}
                                        style={{
                                            left: seat.x,
                                            top: seat.y,
                                            transform: `translate(-50%, -50%) rotate(${seat.rotation}deg)`,
                                            color: seat.color || "var(--muted)"
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                                            <path d="M17 7c0-2-1.5-3-5-3S7 5 7 7v4h10V7zM6 12h12l1 5H5l1-5zM8 17l-1 3.5h1.5l1-3.5M16 17l1 3.5h-1.5l-1-3.5" />
                                        </svg>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent className="p-3 max-w-[240px] z-[100]">
                                    <div className="space-y-1.5">
                                        <p className="font-bold text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-1 mb-1">
                                            {seat.isPR ? "PR Seat" : `${seat.district} - Area ${seat.constituency}`}
                                        </p>
                                        <div className="flex gap-3 items-start">
                                            {!seat.isPR && seat.leaderId && (
                                                <div className="relative shrink-0">
                                                    <img
                                                        src={getCandidateImageUrl(seat.leaderId)}
                                                        alt={seat.leaderName}
                                                        className="w-10 h-10 rounded-full object-cover border-2 border-primary/20 bg-muted shadow-sm"
                                                        onError={(e) => (e.currentTarget.style.display = "none")}
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-0.5">
                                                <p className="font-heading font-bold text-sm leading-tight text-primary">
                                                    {seat.leaderName || "Unknown"}
                                                </p>
                                                <p className="text-[10px] font-semibold text-foreground/80">{seat.leaderParty}</p>
                                                {seat.isPR && (
                                                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-primary/10 text-primary uppercase">Proportional Seat</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                </TooltipProvider>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {partyStats.map(([party, stats]) => (
                    <div key={party} className="card-premium p-3 flex flex-col gap-1 hover:border-primary/30 transition-colors">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-2 rounded-full h-2"
                                style={{ backgroundColor: stats.color }}
                            />
                            <span className="text-[10px] font-bold text-muted-foreground truncate uppercase">{party}</span>
                        </div>
                        <span className="text-lg font-black">{stats.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FullParliamentMap;
