import { useMemo } from "react";
import type { Candidate } from "@/types/election";
import { Trophy, Clock, Medal, Users } from "lucide-react";
import CandidateGrid from "./CandidateGrid";
import { Progress } from "@/components/ui/progress";

interface WinnersGalleryProps {
    data: Candidate[];
    onSelectCandidate: (candidate: Candidate) => void;
}

const WinnersGallery = ({ data, onSelectCandidate }: WinnersGalleryProps) => {
    const winners = useMemo(() => {
        return data.filter(c => c.Rank === "1" && c.TotalVoteReceived > 0);
    }, [data]);

    const totalSeats = 165;
    const progress = (winners.length / totalSeats) * 100;

    if (winners.length === 0) {
        return (
            <div className="space-y-6">
                <div className="card-premium p-8 text-center bg-gradient-to-b from-card to-accent/5">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-primary opacity-40" />
                    </div>
                    <h2 className="text-3xl font-heading font-bold mb-3">No Results Declared Yet</h2>
                    <p className="text-muted-foreground max-w-lg mx-auto mb-8 text-lg">
                        Vote counting is currently in progress. The official winners for all 165 Federal Parliament seats will appear here in real-time.
                    </p>

                    <div className="max-w-md mx-auto p-4 bg-background/50 rounded-2xl border border-border/50 inline-flex items-center gap-3 text-sm font-medium">
                        <Clock className="w-4 h-4 text-primary animate-pulse" />
                        <span>Auto-refreshes every 60 seconds as per ECN updates</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="card-premium p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                            <Medal className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Declared Seats</p>
                            <p className="text-2xl font-bold font-heading">0 / 165</p>
                        </div>
                    </div>
                    <div className="card-premium p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Candidates</p>
                            <p className="text-2xl font-bold font-heading">{data.length.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="card-premium p-6 flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center shadow-lg">
                            <Trophy className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Winners Gallery</p>
                            <p className="text-sm font-medium text-purple-500">Live Tracking Active</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="card-premium p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                    <h2 className="text-2xl font-heading font-bold flex items-center gap-3">
                        <Trophy className="w-7 h-7 text-yellow-500" />
                        Winners Gallery
                    </h2>
                    <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">
                        Federal Parliament 2082
                    </p>
                </div>

                <div className="w-full md:w-64 space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase">
                        <span>Progress</span>
                        <span>{winners.length} / 165 Seats</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            <CandidateGrid data={winners} onSelectCandidate={onSelectCandidate} />
        </div>
    );
};

export default WinnersGallery;
