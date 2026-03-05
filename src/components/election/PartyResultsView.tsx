import { useMemo } from "react";
import type { Candidate } from "@/types/election";
import { getPartyStats, getPartyColor } from "@/lib/electionUtils";
import { Progress } from "@/components/ui/progress";
import PartyChart from "./PartyChart";
import PartyComparison from "./PartyComparison";
import DistrictTable from "./DistrictTable";

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

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <PartyChart data={partyStats} />
                        <div className="card-premium p-6 flex flex-col justify-center">
                            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Quick Insights</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Total Parties</span>
                                    <span className="font-bold">{partyCounts.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Main Contestants</span>
                                    <span className="font-bold">{partyCounts.filter(p => p.count > 100).length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Independents</span>
                                    <span className="font-bold">{partyCounts.find(p => p.party.includes("स्वतन्त्र"))?.count || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PartyComparison data={data} parties={parties} />
                </div>

                <div className="card-premium p-6 space-y-6 overflow-hidden">
                    <div>
                        <h3 className="font-heading font-bold text-lg mb-1">Party Candidates Count</h3>
                        <p className="text-xs text-muted-foreground">Number of candidates fielded in all 165 constituencies</p>
                    </div>

                    <div className="space-y-5 h-[600px] overflow-y-auto pr-2 no-scrollbar">
                        {partyCounts.map((p, idx) => (
                            <div key={p.party} className="space-y-1.5">
                                <div className="flex justify-between text-xs font-bold">
                                    <span className="truncate max-w-[200px]">{p.party}</span>
                                    <span>{p.count}</span>
                                </div>
                                <Progress
                                    value={(p.count / maxCount) * 100}
                                    className="h-1.5"
                                    style={{
                                        backgroundColor: `${getPartyColor(p.party, idx)}15`,
                                        // We can't easily set the indicator color via style on shadcn progress without custom implementation
                                    }}
                                // Using inline style for indicator if feasible or just standard theme
                                />
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
