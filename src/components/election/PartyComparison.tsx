import { useMemo, useState, useEffect } from "react";
import type { Candidate } from "@/types/election";
import { getPartyStats } from "@/lib/electionUtils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { GitCompareArrows } from "lucide-react";

const COMPARE_COLORS = ["#C62828", "#1565C0", "#F9A825", "#2E7D32", "#6A1B9A"];

interface Props {
  data: Candidate[];
  parties: string[];
}

const PartyComparison = ({ data, parties }: Props) => {
  const [selectedParties, setSelectedParties] = useState<string[]>([]);

  useEffect(() => {
    if (selectedParties.length === 0 && parties.length > 0) {
      const defaults = [
        "नेपाली काँग्रेस",
        "नेपाल कम्युनिष्ट पार्टी (एकीकृत मार्क्सवादी-लेनिनवादी)",
        "नेपाल कम्युनिस्ट पार्टी (माओवादी केन्द्र)",
        "राष्ट्रिय स्वतन्त्र पार्टी"
      ];
      // Filter the official parties list to find matches for our defaults
      const found = parties.filter(p => defaults.some(d => p.startsWith(d) || d.startsWith(p)));
      if (found.length > 0) {
        setSelectedParties(found.slice(0, 5));
      }
    }
  }, [parties, selectedParties.length]);

  const allPartyStats = useMemo(() => getPartyStats(data), [data]);

  const addParty = (party: string) => {
    if (party && !selectedParties.includes(party) && selectedParties.length < 5) {
      setSelectedParties([...selectedParties, party]);
    }
  };

  const removeParty = (party: string) => {
    setSelectedParties(selectedParties.filter((p) => p !== party));
  };

  const comparisonData = useMemo(() => {
    return selectedParties.map((party) => {
      const stats = allPartyStats.find((p) => p.party === party);
      const partyCandidates = data.filter((c) => c.PoliticalPartyName === party);
      const maleCount = partyCandidates.filter((c) => c.Gender === "पुरुष").length;
      const femaleCount = partyCandidates.filter((c) => c.Gender === "महिला").length;
      const provinces = new Set(partyCandidates.map((c) => c.StateName)).size;
      const districts = new Set(partyCandidates.map((c) => c.DistrictName)).size;
      const avgAge = partyCandidates.length > 0
        ? Math.round(partyCandidates.reduce((s, c) => s + (c.AGE_YR || 0), 0) / partyCandidates.length)
        : 0;

      return {
        party: party.length > 25 ? party.slice(0, 25) + "…" : party,
        fullName: party,
        totalVotes: stats?.totalVotes || 0,
        candidates: stats?.candidates || 0,
        male: maleCount,
        female: femaleCount,
        provinces,
        districts,
        avgAge,
      };
    });
  }, [selectedParties, data, allPartyStats]);

  const chartData = [
    { metric: "कुल मत", ...Object.fromEntries(comparisonData.map((d, i) => [`party${i}`, d.totalVotes])) },
    { metric: "उम्मेदवार", ...Object.fromEntries(comparisonData.map((d, i) => [`party${i}`, d.candidates])) },
    { metric: "जिल्ला", ...Object.fromEntries(comparisonData.map((d, i) => [`party${i}`, d.districts])) },
    { metric: "प्रदेश", ...Object.fromEntries(comparisonData.map((d, i) => [`party${i}`, d.provinces])) },
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-1">
        <GitCompareArrows className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-heading font-bold text-card-foreground">पार्टी तुलना</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Compare up to 5 parties side by side</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Select onValueChange={addParty} value="">
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="दल थप्नुहोस्..." />
          </SelectTrigger>
          <SelectContent>
            {parties
              .filter((p) => !selectedParties.includes(p))
              .slice(0, 20)
              .map((p) => (
                <SelectItem key={p} value={p}>
                  {p.length > 35 ? p.slice(0, 35) + "…" : p}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {selectedParties.map((p, i) => (
          <span
            key={p}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-primary-foreground"
            style={{ backgroundColor: COMPARE_COLORS[i] }}
          >
            {p.length > 18 ? p.slice(0, 18) + "…" : p}
            <button onClick={() => removeParty(p)} className="ml-1 hover:opacity-70">×</button>
          </span>
        ))}
      </div>

      {comparisonData.length >= 2 && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
            {comparisonData.map((d, i) => (
              <div key={d.fullName} className="p-3 rounded-lg border border-border bg-background">
                <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: COMPARE_COLORS[i] }} />
                <p className="text-xs font-semibold truncate">{d.fullName}</p>
                <p className="text-lg font-heading font-bold text-primary">{d.totalVotes.toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">मत</p>
                <div className="mt-2 space-y-1 text-[11px] text-muted-foreground">
                  <p>उम्मेदवार: {d.candidates}</p>
                  <p>पुरुष/महिला: {d.male}/{d.female}</p>
                  <p>औसत उमेर: {d.avgAge}</p>
                  <p>जिल्ला: {d.districts} • प्रदेश: {d.provinces}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="metric" fontSize={11} />
                <YAxis fontSize={11} tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                <Legend
                  formatter={(value) => {
                    const idx = parseInt(value.replace("party", ""));
                    return comparisonData[idx]?.party || value;
                  }}
                />
                {comparisonData.map((_, i) => (
                  <Bar key={i} dataKey={`party${i}`} fill={COMPARE_COLORS[i]} radius={[4, 4, 0, 0]} barSize={30} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {comparisonData.length < 2 && (
        <div className="text-center py-12 text-muted-foreground">
          <GitCompareArrows className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">कम्तिमा २ दल छान्नुहोस्</p>
          <p className="text-xs">Select at least 2 parties to compare</p>
        </div>
      )}
    </div>
  );
};

export default PartyComparison;
