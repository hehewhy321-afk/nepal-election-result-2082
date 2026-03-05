import type { Candidate } from "@/types/election";
import SearchFilter from "./SearchFilter";
import CandidateGrid from "./CandidateGrid";
import CSVExportButton from "./CSVExportButton";
import AutoRefreshTimer from "./AutoRefreshTimer";

interface CandidatesViewProps {
    filteredData: Candidate[];
    search: string;
    setSearch: (v: string) => void;
    province: string;
    setProvince: (v: string) => void;
    provinces: string[];
    district: string;
    setDistrict: (v: string) => void;
    districts: string[];
    constituency: string;
    setConstituency: (v: string) => void;
    constituencies: string[];
    party: string;
    setParty: (v: string) => void;
    parties: string[];
    isFetching: boolean;
    autoRefresh: boolean;
    setAutoRefresh: (v: boolean) => void;
    refreshInterval: number;
    onSelectCandidate: (candidate: Candidate) => void;
}

const CandidatesView = ({
    filteredData,
    search,
    setSearch,
    province,
    setProvince,
    provinces,
    district,
    setDistrict,
    districts,
    constituency,
    setConstituency,
    constituencies,
    party,
    setParty,
    parties,
    isFetching,
    autoRefresh,
    setAutoRefresh,
    refreshInterval,
    onSelectCandidate
}: CandidatesViewProps) => {
    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col lg:flex-row gap-3">
                <div className="flex-1 min-w-0">
                    <SearchFilter
                        search={search}
                        onSearchChange={setSearch}
                        province={province}
                        onProvinceChange={(v) => { setProvince(v); setDistrict("all"); setConstituency("all"); }}
                        provinces={provinces}
                        district={district}
                        onDistrictChange={(v) => { setDistrict(v); setConstituency("all"); }}
                        districts={districts}
                        constituency={constituency}
                        onConstituencyChange={setConstituency}
                        constituencies={constituencies}
                        party={party}
                        onPartyChange={setParty}
                        parties={parties}
                    />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <CSVExportButton data={filteredData} />
                    <AutoRefreshTimer
                        isRefreshing={isFetching}
                        enabled={autoRefresh}
                        onToggle={setAutoRefresh}
                        intervalSeconds={refreshInterval}
                    />
                </div>
            </div>

            <div className="space-y-6">
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="w-1 h-6 rounded-full gradient-nepal shadow-sm" />
                        <h2 className="font-heading font-bold text-lg text-foreground">
                            Candidate Directory {search ? `(Search: ${search})` : ""}
                        </h2>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">
                        Found {filteredData.length} candidates
                    </p>
                </div>
                <CandidateGrid data={filteredData} onSelectCandidate={onSelectCandidate} />
            </div>
        </div>
    );
};

export default CandidatesView;
