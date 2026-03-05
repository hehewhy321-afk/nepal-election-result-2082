import { useState, useMemo } from "react";
import type { Candidate } from "@/types/election";
import { MapPin, ChevronRight } from "lucide-react";

interface Props {
    data: Candidate[];
    onSelectConstituency: (constituency: { id: number; district: string }) => void;
    onSelectCandidate: (c: Candidate) => void;
}

const FindMyConstituency = ({ data, onSelectConstituency, onSelectCandidate }: Props) => {
    const [district, setDistrict] = useState("");
    const [constId, setConstId] = useState("");

    const districts = useMemo(() => {
        return [...new Set(data.map((c) => c.DistrictName))].sort();
    }, [data]);

    const filteredConsts = useMemo(() => {
        if (!district) return [];
        const seen = new Map<string, string>();
        data
            .filter((c) => c.DistrictName === district)
            .forEach((c) => {
                const cid = String(c.SCConstID);
                if (!seen.has(cid)) seen.set(cid, cid);
            });
        return [...seen.entries()].sort((a, b) => Number(a[0]) - Number(b[0]));
    }, [data, district]);

    // Leading candidate for selected constituency
    const leader = useMemo(() => {
        if (!constId || !district) return null;
        const inConst = data
            .filter((c) => String(c.SCConstID) === String(constId) && c.DistrictName === district)
            .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
        return inConst[0] || null;
    }, [data, constId, district]);

    const second = useMemo(() => {
        if (!constId || !district) return null;
        const inConst = data
            .filter((c) => String(c.SCConstID) === String(constId) && c.DistrictName === district)
            .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
        return inConst[1] || null;
    }, [data, constId, district]);

    const margin =
        leader && second
            ? (leader.TotalVoteReceived || 0) - (second.TotalVoteReceived || 0)
            : null;

    return (
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-blue-500/10">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                </div>
                <div>
                    <h3 className="text-sm font-heading font-bold text-foreground leading-tight">
                        Find My Constituency
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                        Select your district and constituency to jump directly to results
                    </p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
                <select
                    value={district}
                    onChange={(e) => { setDistrict(e.target.value); setConstId(""); }}
                    className="flex-1 px-3 py-2 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
                >
                    <option value="">Select District</option>
                    {districts.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                </select>

                <select
                    value={constId}
                    onChange={(e) => setConstId(e.target.value)}
                    disabled={!district}
                    className="flex-1 px-3 py-2 rounded-lg border border-border/60 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 disabled:opacity-40"
                >
                    <option value="">Select Area</option>
                    {filteredConsts.map(([id]) => (
                        <option key={id} value={id}>Area {id}</option>
                    ))}
                </select>
            </div>

            {/* Result preview */}
            {leader && constId && (
                <div className="rounded-xl border border-border/50 bg-muted/40 p-3 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                        <div>
                            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                                Leading — Area {constId}, {district}
                            </p>
                            <p className="text-base font-heading font-bold text-foreground mt-0.5">
                                {leader.CandidateName}
                            </p>
                            <p className="text-xs text-muted-foreground">{leader.PoliticalPartyName}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                            {(leader.TotalVoteReceived || 0) > 0 ? (
                                <>
                                    <p className="text-xl font-heading font-black text-primary">
                                        {(leader.TotalVoteReceived || 0).toLocaleString()}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground">votes</p>
                                </>
                            ) : (
                                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300">
                                    Pending
                                </span>
                            )}
                        </div>
                    </div>

                    {second && margin !== null && margin > 0 && (
                        <p className="text-xs text-muted-foreground border-t border-border/40 pt-2">
                            Margin over {second.CandidateName} ({second.PoliticalPartyName}):{" "}
                            <strong className="text-foreground">{margin.toLocaleString()} votes</strong>
                        </p>
                    )}

                    <div className="flex gap-2 pt-1">
                        <button
                            onClick={() => onSelectCandidate(leader)}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border/60 hover:border-primary/40 hover:text-primary transition-colors"
                        >
                            View leader profile
                            <ChevronRight className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => onSelectConstituency({ id: Number(constId), district })}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            All candidates
                            <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindMyConstituency;
