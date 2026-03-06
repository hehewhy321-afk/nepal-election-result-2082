import { useState, useMemo } from "react";
import { useElectionData } from "@/hooks/useElectionData";
import { getPartyStats, getProvinceStats, getTopCandidates, getDistrictStats } from "@/lib/electionUtils";
import type { Candidate } from "@/types/election";
import HeroSection from "@/components/election/HeroSection";
import StatsCards from "@/components/election/StatsCards";
import PartyChart from "@/components/election/PartyChart";
import ProvinceChart from "@/components/election/ProvinceChart";
import DistrictTable from "@/components/election/DistrictTable";
import SearchFilter from "@/components/election/SearchFilter";
import CandidateGrid from "@/components/election/CandidateGrid";
import CandidateDetailModal from "@/components/election/CandidateDetailModal";
import ConstituencyList from "@/components/election/ConstituencyList";
import ConstituencyDetail from "@/components/election/ConstituencyDetail";
import AutoRefreshTimer from "@/components/election/AutoRefreshTimer";
import WinnerSlider from "@/components/election/WinnerSlider";
import CountingProgress from "@/components/election/CountingProgress";
import FindMyConstituency from "@/components/election/FindMyConstituency";
import GenderByProvinceChart from "@/components/election/GenderByProvinceChart";
import TopWinnersLeaderboard from "@/components/election/TopWinnersLeaderboard";
import CSVExportButton from "@/components/election/CSVExportButton";
import ResultStatus from "@/components/election/ResultStatus";
import DashboardNav, { TabType } from "@/components/election/DashboardNav";
import OverviewView from "@/components/election/OverviewView";
import ParliamentMap from "@/components/election/ParliamentMap";
import PartyResultsView from "@/components/election/PartyResultsView";
import CandidatesView from "@/components/election/CandidatesView";
import WinnersGallery from "@/components/election/WinnersGallery";
import PRSimulatorView from "@/components/election/PRSimulatorView";
import { Loader2, Trophy } from "lucide-react";

const REFRESH_INTERVAL = 60; // seconds

const Index = () => {
  const [autoRefresh, setAutoRefresh] = useState(false);
  const { data, isLoading, error, isFetching, dataUpdatedAt } = useElectionData(
    autoRefresh ? REFRESH_INTERVAL * 1000 : undefined
  );

  // Filter state
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("all");
  const [district, setDistrict] = useState("all");
  const [constituency, setConstituency] = useState("all");
  const [party, setParty] = useState("all");

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabType>("overview");

  // Modal / detail state
  const [selectedConstituency, setSelectedConstituency] = useState<{ id: string; district: string } | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : undefined;

  // ── Derived filter lists ──────────────────────────────────────────
  const provinces = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((c) => c.StateName))].sort();
  }, [data]);

  const districts = useMemo(() => {
    if (!data) return [];
    return [...new Set(
      data
        .filter((c) => province === "all" || c.StateName === province)
        .map((c) => c.DistrictName)
    )].sort();
  }, [data, province]);

  const constituencies = useMemo(() => {
    if (!data) return [];
    return [...new Set(
      data
        .filter((c) => {
          if (province !== "all" && c.StateName !== province) return false;
          if (district !== "all" && c.DistrictName !== district) return false;
          return true;
        })
        .map((c) => String(c.SCConstID))
    )].sort((a, b) => Number(a) - Number(b));
  }, [data, province, district]);

  const parties = useMemo(() => {
    if (!data) return [];
    const partyMap = new Map<string, number>();
    data.forEach((c) => partyMap.set(c.PoliticalPartyName, (partyMap.get(c.PoliticalPartyName) || 0) + 1));
    return [...partyMap.entries()].sort((a, b) => b[1] - a[1]).map(([p]) => p);
  }, [data]);

  // ── Filtered data ─────────────────────────────────────────────────
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((c) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.CandidateName.toLowerCase().includes(q) &&
          !String(c.CandidateID).includes(q) &&
          !String(c.SCConstID).includes(q) &&
          !c.DistrictName.toLowerCase().includes(q) &&
          !c.PoliticalPartyName.toLowerCase().includes(q)
        ) return false;
      }
      if (province !== "all" && c.StateName !== province) return false;
      if (district !== "all" && c.DistrictName !== district) return false;
      if (constituency !== "all" && String(c.SCConstID) !== constituency) return false;
      if (party !== "all" && c.PoliticalPartyName !== party) return false;
      return true;
    });
  }, [data, search, province, district, constituency, party]);

  // ── Statistics ────────────────────────────────────────────────────
  const partyStats = useMemo(() => getPartyStats(filteredData), [filteredData]);
  const provinceStats = useMemo(() => getProvinceStats(filteredData), [filteredData]);
  const topCandidates = useMemo(() => getTopCandidates(filteredData), [filteredData]);
  const districtStats = useMemo(() => getDistrictStats(filteredData), [filteredData]);

  // ── Loading / error states ────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="relative mx-auto w-16 h-16 mb-6">
            <div className="absolute inset-0 rounded-full gradient-nepal opacity-20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full gradient-nepal flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          </div>
          <p className="text-lg font-heading font-bold text-foreground">Loading Data...</p>
          <p className="text-sm text-muted-foreground mt-1">Loading election data from Election Commission Nepal</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">Failed to Load Data</h2>
          <p className="text-sm text-muted-foreground">
            Unable to load election data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <div className="container mx-auto px-3 sm:px-4 -mt-6 relative z-20 space-y-5 pb-16 max-w-screen-xl">
        {/* ── Dashboard Navigation ── */}
        <DashboardNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* ── Result Status Banner ── */}
        {data && (
          <ResultStatus data={data} isFetching={isFetching} lastUpdated={lastUpdated} />
        )}

        {/* ── Tab Content ── */}
        {activeTab === "overview" && (
          <OverviewView
            data={data || []}
            filteredData={filteredData}
            partyStats={partyStats}
            provinceStats={provinceStats}
            topCandidates={topCandidates}
            onSelectCandidate={setSelectedCandidate}
            onSelectConstituency={setSelectedConstituency}
          />
        )}

        {activeTab === "parliament" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <ParliamentMap data={data || []} />
            <ProvinceChart data={provinceStats} />
          </div>
        )}

        {activeTab === "party" && (
          <PartyResultsView data={data || []} parties={parties} districtStats={districtStats} />
        )}

        {activeTab === "pr" && (
          <PRSimulatorView partyStats={partyStats} />
        )}

        {activeTab === "candidates" && (
          <CandidatesView
            filteredData={filteredData}
            search={search}
            setSearch={setSearch}
            province={province}
            setProvince={setProvince}
            provinces={provinces}
            district={district}
            setDistrict={setDistrict}
            districts={districts}
            constituency={constituency}
            setConstituency={setConstituency}
            constituencies={constituencies}
            party={party}
            setParty={setParty}
            parties={parties}
            isFetching={isFetching}
            autoRefresh={autoRefresh}
            setAutoRefresh={setAutoRefresh}
            refreshInterval={REFRESH_INTERVAL}
            onSelectCandidate={setSelectedCandidate}
          />
        )}

        {activeTab === "winners" && (
          <WinnersGallery data={data || []} onSelectCandidate={setSelectedCandidate} />
        )}

        {activeTab === "search" && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">Find Results by Area</h2>
                <p className="text-muted-foreground">Select your region to see the latest vote counts</p>
              </div>

              <FindMyConstituency
                data={data || []}
                onSelectConstituency={setSelectedConstituency}
                onSelectCandidate={setSelectedCandidate}
              />
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Source: Election Commission Nepal
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">result.election.gov.np</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Developed by: <a href="https://github.com/hehewhy321-afk">Saif Ali</a></p>
        </footer>
      </div>

      {/* ── Constituency Detail modal ── */}
      {selectedConstituency !== null && data && (
        <ConstituencyDetail
          data={data}
          constituencyId={selectedConstituency.id}
          districtName={selectedConstituency.district}
          onClose={() => setSelectedConstituency(null)}
        />
      )}

      {/* ── Candidate Detail modal ── */}
      <CandidateDetailModal
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </div>
  );
};

export default Index;
