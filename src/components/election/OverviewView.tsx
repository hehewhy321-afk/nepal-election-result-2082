import type { Candidate, PartyStats, ProvinceStats } from "@/types/election";
import StatsCards from "./StatsCards";
import CountingProgress from "./CountingProgress";
import FindMyConstituency from "./FindMyConstituency";
import WinnerSlider from "./WinnerSlider";
import TopWinnersLeaderboard from "./TopWinnersLeaderboard";
import PartyChart from "./PartyChart";
import ProvinceChart from "./ProvinceChart";
import CandidateGrid from "./CandidateGrid";

interface OverviewViewProps {
    data: Candidate[];
    filteredData: Candidate[];
    partyStats: PartyStats[];
    provinceStats: ProvinceStats[];
    topCandidates: Candidate[];
    onSelectCandidate: (candidate: Candidate) => void;
    onSelectConstituency: (constituency: { id: number; district: string }) => void;
}

const OverviewView = ({
    data,
    filteredData,
    partyStats,
    provinceStats,
    topCandidates,
    onSelectCandidate,
    onSelectConstituency
}: OverviewViewProps) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <StatsCards data={filteredData} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <CountingProgress data={data || []} />
                <FindMyConstituency
                    data={data || []}
                    onSelectConstituency={onSelectConstituency}
                    onSelectCandidate={onSelectCandidate}
                />
            </div>

            {data && data.length > 0 && (
                <WinnerSlider data={filteredData.length > 0 ? filteredData : data} onSelectCandidate={onSelectCandidate} />
            )}

            <TopWinnersLeaderboard data={data || []} onSelectCandidate={onSelectCandidate} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <PartyChart data={partyStats} />
                <ProvinceChart data={provinceStats} />
            </div>

            <div className="space-y-4">
                <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full gradient-nepal shadow-sm" />
                    Featured Candidates
                </h2>
                <CandidateGrid
                    data={topCandidates.length > 0 ? topCandidates.slice(0, 8) : data.slice(0, 8)}
                    onSelectCandidate={onSelectCandidate}
                />
            </div>
        </div>
    );
};

export default OverviewView;
