import { useState, useMemo } from "react";
import { useElectionData } from "@/hooks/useElectionData";
import { getPartyStats, getProvinceStats, getGenderStats, getTopCandidates, getDistrictStats } from "@/lib/electionUtils";
import type { Candidate } from "@/types/election";
import HeroSection from "@/components/election/HeroSection";
import StatsCards from "@/components/election/StatsCards";
import PartyChart from "@/components/election/PartyChart";
import ProvinceChart from "@/components/election/ProvinceChart";
import GenderPieChart from "@/components/election/GenderPieChart";
import AgeDistributionChart from "@/components/election/AgeDistributionChart";
import TopCandidatesTable from "@/components/election/TopCandidatesTable";
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
import DemographicsCharts from "@/components/election/DemographicsCharts";
import TopWinnersLeaderboard from "@/components/election/TopWinnersLeaderboard";
import CSVExportButton from "@/components/election/CSVExportButton";
import PartyComparison from "@/components/election/PartyComparison";
import ResultStatus from "@/components/election/ResultStatus";
import { Loader2 } from "lucide-react";

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

  // Modal / detail state
  const [selectedConstituency, setSelectedConstituency] = useState<number | null>(null);
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
  const genderStats = useMemo(() => getGenderStats(filteredData), [filteredData]);
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
          <p className="text-lg font-heading font-bold text-foreground">डाटा लोड हुँदैछ...</p>
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
          <h2 className="text-xl font-heading font-bold text-foreground mb-2">डाटा लोड गर्न सकिएन</h2>
          <p className="text-sm text-muted-foreground">
            Unable to load election data. Please try again later. / कृपया पछि पुनः प्रयास गर्नुहोस्।
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

        {/* ── Result Status Banner ── */}
        {data && (
          <ResultStatus data={data} isFetching={isFetching} lastUpdated={lastUpdated} />
        )}

        {/* ── Stats ── */}
        <StatsCards data={filteredData} />

        {/* ── Progress & Quick Jump ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <CountingProgress data={data || []} />
          <FindMyConstituency
            data={data || []}
            onSelectConstituency={setSelectedConstituency}
            onSelectCandidate={setSelectedCandidate}
          />
        </div>

        {/* ── Winner / Constituency Spotlight Slider ── */}
        {data && data.length > 0 && (
          <WinnerSlider data={filteredData.length > 0 ? filteredData : data} onSelectCandidate={setSelectedCandidate} />
        )}

        {/* ── Search & Filters + Auto Refresh ── */}
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
              intervalSeconds={REFRESH_INTERVAL}
            />
          </div>
        </div>

        {/* ── Top Leaders ── */}
        <TopWinnersLeaderboard data={data || []} onSelectCandidate={setSelectedCandidate} />

        {/* ── High Priority Analysis ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PartyChart data={partyStats} />
          <ProvinceChart data={provinceStats} />
        </div>

        <PartyComparison data={filteredData} parties={parties} />

        {/* ── Candidate Results Grid (Active filter or General) ── */}
        <div className="space-y-6">
          {(district !== "all" || constituency !== "all") ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-1 h-6 rounded-full gradient-nepal shadow-sm" />
                  <h2 className="font-heading font-bold text-lg text-foreground">
                    {district !== "all" ? district : ""}
                    {constituency !== "all" ? ` · Area / क्षेत्र ${constituency}` : ""} – Result / परिणाम
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Found {filteredData.length} candidates
                </p>
              </div>
              <CandidateGrid data={filteredData} onSelectCandidate={setSelectedCandidate} />
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center gap-2">
                <span className="w-1 h-6 rounded-full gradient-nepal shadow-sm" />
                <h2 className="font-heading font-bold text-lg text-foreground">
                  Highlighting Candidates / प्रमुख उम्मेदवारहरू
                </h2>
              </div>
              <CandidateGrid data={filteredData} onSelectCandidate={setSelectedCandidate} />
            </div>
          )}
        </div>

        {/* ── Detailed Result Lists ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TopCandidatesTable data={topCandidates} />
          <ConstituencyList data={filteredData} onSelect={setSelectedConstituency} />
        </div>

        <DistrictTable data={districtStats} />

        <div className="pt-8 border-t border-border/30">
          <div className="mb-6">
            <h2 className="text-xl font-heading font-bold text-foreground">Data Insights & Analytics</h2>
            <p className="text-sm text-muted-foreground">Detailed breakdowns and demographic analysis of the 2082 election</p>
          </div>

          <div className="space-y-5">
            {/* ── Charts Row: Gender + Provincial Gender ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <GenderPieChart data={genderStats} />
              <GenderByProvinceChart data={filteredData} />
            </div>

            {/* ── Charts Row: Demographics & Age ── */}
            <DemographicsCharts data={filteredData} />
            <AgeDistributionChart data={filteredData} />
          </div>
        </div>

        {/* ── Footer ── */}
        <footer className="text-center py-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Source / स्रोत: Election Commission Nepal · निर्वाचन आयोग नेपाल
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1">result.election.gov.np</p>
        </footer>
      </div>

      {/* ── Constituency Detail modal ── */}
      {selectedConstituency !== null && data && (
        <ConstituencyDetail
          data={data}
          constituencyId={selectedConstituency}
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
