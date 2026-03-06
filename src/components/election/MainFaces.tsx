import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Candidate } from '@/types/election';
import { getTopCandidatesByConstituency, getCandidateImageUrl, getSymbolImageUrl, getPartyColor } from '@/lib/electionUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Info, TrendingUp, Search } from 'lucide-react';

interface MainFacesProps {
    data: Candidate[];
}

const DEFAULT_BATTLEGROUNDS = [
    { distId: 4, constId: "5", label: "Jhapa-5" },
    { distId: 52, constId: "1", label: "Rukum East-1" },
    { distId: 27, constId: "2", label: "Bhaktapur-2" },
    { distId: 35, constId: "2", label: "Chitwan-2" },
    { distId: 22, constId: "4", label: "Sarlahi-4" },
    { distId: 26, constId: "3", label: "Kathmandu-3" },
    { distId: 49, constId: "1", label: "Myagdi-1" },
    { distId: 16, constId: "1", label: "Siraha-1" },
    { distId: 42, constId: "1", label: "Gulmi-1" },
    { distId: 28, constId: "3", label: "Lalitpur-3" },
    { distId: 36, constId: "1", label: "Gorkha-1" },
    { distId: 40, constId: "1", label: "Tanahun-1" },
    { distId: 77, constId: "1", label: "Nawalparasi West-1" },
    { distId: 4, constId: "1", label: "Jhapa-1" },
    { distId: 10, constId: "1", label: "Sunsari-1" },
    { distId: 24, constId: "1", label: "Dhading-1" },
    { distId: 71, constId: "2", label: "Kailali-2" },
];

export const MainFaces: React.FC<MainFacesProps> = ({ data }) => {
    const [selectedDistrict, setSelectedDistrict] = useState<string>("");
    const [selectedArea, setSelectedArea] = useState<string>("");
    const [exploredArea, setExploredArea] = useState<{ distId: number, constId: string, label: string } | null>(null);

    // Extract unique districts and their areas for the selector
    const { districts, areasByDistrict } = useMemo(() => {
        const dMap = new Map<number, string>();
        const aMap = new Map<number, Set<string>>();

        data.forEach(c => {
            dMap.set(Number(c.DistrictCd), c.DistrictName);
            if (!aMap.has(Number(c.DistrictCd))) aMap.set(Number(c.DistrictCd), new Set());
            aMap.get(Number(c.DistrictCd))?.add(String(c.SCConstID));
        });

        return {
            districts: Array.from(dMap.entries()).map(([id, name]) => ({ id, name })),
            areasByDistrict: aMap
        };
    }, [data]);

    const handleAddExplored = () => {
        if (selectedDistrict && selectedArea) {
            const distName = districts.find(d => d.id === Number(selectedDistrict))?.name || "";
            setExploredArea({
                distId: Number(selectedDistrict),
                constId: selectedArea,
                label: `${distName}-${selectedArea}`
            });
        }
    };

    const BattlegroundCard = ({ distId, constId, label }: { distId: number, constId: string, label: string }) => {
        const top3 = getTopCandidatesByConstituency(data, distId, constId, 3);
        if (top3.length === 0) return null;

        return (
            <Card className="overflow-hidden border-border/50 bg-card/30 backdrop-blur-md hover:border-primary/30 transition-all duration-300">
                <CardHeader className="p-4 pb-2 bg-muted/20">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-primary" />
                            {label}
                        </CardTitle>
                        <Badge variant="outline" className="text-[10px] uppercase font-mono tracking-tight">
                            Top 3 Battle
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-4">
                    <div className="space-y-4 relative">
                        {top3.map((candidate, idx) => (
                            <div key={candidate.CandidateID || idx} className="relative">
                                <div className="flex items-center gap-3">
                                    <div className="relative group">
                                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/50 transition-colors">
                                            <img
                                                src={getCandidateImageUrl(candidate.CandidateID)}
                                                alt={candidate.CandidateName}
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.src = 'https://result.election.gov.np/Images/Candidate/0.jpg')}
                                            />
                                        </div>
                                        <div
                                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border border-background overflow-hidden bg-white"
                                            title={candidate.PoliticalPartyName}
                                        >
                                            <img
                                                src={getSymbolImageUrl(candidate.SymbolID)}
                                                alt="Symbol"
                                                className="w-full h-full object-contain p-0.5"
                                            />
                                        </div>
                                        <div className="absolute -top-1 -left-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold shadow-sm">
                                            {idx + 1}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold truncate leading-tight">
                                            {candidate.CandidateName}
                                        </h4>
                                        <p className="text-[10px] text-muted-foreground truncate mb-1">
                                            {candidate.PoliticalPartyName}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-mono font-bold text-primary">
                                                {candidate.TotalVoteReceived?.toLocaleString()}
                                            </span>
                                            <span className="text-[10px] text-muted-foreground">votes</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar to visual compare */}
                                <div className="mt-2 h-1 w-full bg-muted/30 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full"
                                        style={{
                                            width: `${(candidate.TotalVoteReceived / top3[0].TotalVoteReceived) * 100}%`,
                                            backgroundColor: getPartyColor(candidate.PoliticalPartyName, idx)
                                        }}
                                    />
                                </div>

                                {/* VS Indicator */}
                                {idx < top3.length - 1 && (
                                    <div className="absolute -bottom-2.5 left-7 z-10">
                                        <span className="px-1.5 py-0.5 bg-background border border-border rounded text-[8px] font-black italic text-muted-foreground uppercase leading-none">
                                            VS
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <section className="space-y-8 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Main Faces / <span className="text-primary/70">Battlegrounds</span>
                    </h2>
                    <p className="text-muted-foreground text-sm max-w-xl">
                        Real-time "VS" layout of the top 3 contenders in highly contested areas.
                    </p>
                </div>

                {/* Dynamic Lookup Area */}
                <div className="flex items-center gap-2 w-full md:w-auto p-1 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex-1 md:w-48">
                        <Select onValueChange={setSelectedDistrict}>
                            <SelectTrigger className="h-9 border-none bg-transparent shadow-none focus:ring-0">
                                <SelectValue placeholder="Select District" />
                            </SelectTrigger>
                            <SelectContent>
                                {districts.map(d => (
                                    <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex-1 md:w-32">
                        <Select onValueChange={setSelectedArea} disabled={!selectedDistrict}>
                            <SelectTrigger className="h-9 border-none bg-transparent shadow-none focus:ring-0">
                                <SelectValue placeholder="Area" />
                            </SelectTrigger>
                            <SelectContent>
                                {selectedDistrict && Array.from(areasByDistrict.get(Number(selectedDistrict)) || []).map(area => (
                                    <SelectItem key={area} value={area}>{area}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <button
                        disabled={!selectedArea}
                        onClick={handleAddExplored}
                        className="p-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 transition-colors"
                    >
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <AnimatePresence>
                    {exploredArea && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="border-2 border-primary/50 rounded-xl"
                        >
                            <BattlegroundCard {...exploredArea} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {DEFAULT_BATTLEGROUNDS.map((bg) => (
                    <BattlegroundCard key={bg.label} {...bg} />
                ))}
            </div>
        </section>
    );
};
