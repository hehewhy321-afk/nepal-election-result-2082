import { useMemo } from "react";
import type { Candidate } from "@/types/election";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { X, User, MapPin } from "lucide-react";
import { getPartyColor } from "@/lib/electionUtils";

interface Props {
  data: Candidate[];
  constituencyId: string | number;
  districtName: string;
  onClose: () => void;
}

const ConstituencyDetail = ({ data, constituencyId, districtName, onClose }: Props) => {
  const candidates = useMemo(() => {
    return data
      .filter((c) => String(c.SCConstID) === String(constituencyId) && c.DistrictName === districtName)
      .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
  }, [data, constituencyId, districtName]);

  const stateName = candidates[0]?.StateName || "";
  const totalVotes = candidates.reduce((s, c) => s + (c.TotalVoteReceived || 0), 0);

  const chartData = candidates.slice(0, 10).map((c, i) => ({
    name: c.CandidateName.length > 15 ? c.CandidateName.slice(0, 15) + "…" : c.CandidateName,
    votes: c.TotalVoteReceived || 0,
    color: getPartyColor(c.PoliticalPartyName, i),
  }));

  return (
    <div className="fixed inset-0 z-50 bg-foreground/50 backdrop-blur-sm flex items-start justify-center pt-8 pb-8 overflow-y-auto">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-3xl mx-4 border border-border">
        <div className="gradient-nepal rounded-t-2xl px-6 py-5 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold text-primary-foreground">
              Constituency Area No. {constituencyId}
            </h2>
            <p className="text-sm text-primary-foreground/80 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" /> {districtName}, {stateName}
            </p>
            <p className="text-xs text-primary-foreground/60 mt-0.5">
              Total Votes: {totalVotes.toLocaleString()} • Candidates: {candidates.length}
            </p>
          </div>
          <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground p-1">
            <X className="w-6 h-6" />
          </button>
        </div>

        {chartData.length > 0 && (
          <div className="px-6 pt-5">
            <h3 className="text-sm font-heading font-semibold text-card-foreground mb-2">Vote Distribution</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 5, right: 15 }}>
                  <XAxis type="number" fontSize={11} tickFormatter={(v) => v.toLocaleString()} />
                  <YAxis type="category" dataKey="name" width={120} fontSize={10} />
                  <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Bar dataKey="votes" radius={[0, 6, 6, 0]} barSize={18}>
                    {chartData.map((e, i) => (
                      <Cell key={i} fill={e.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="px-6 pb-6 pt-3">
          <h3 className="text-sm font-heading font-semibold text-card-foreground mb-2">All Candidates</h3>
          <div className="overflow-x-auto max-h-[300px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">#</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Party</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Votes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((c, i) => (
                  <TableRow key={c.CandidateID}>
                    <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full gradient-nepal flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{c.CandidateName}</p>
                          <p className="text-xs text-muted-foreground">{c.Gender}, {c.AGE_YR} Years</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs max-w-[150px] truncate">{c.PoliticalPartyName}</TableCell>
                    <TableCell className="text-xs">{c.SymbolName}</TableCell>
                    <TableCell className="text-right font-heading font-bold text-primary">
                      {(c.TotalVoteReceived || 0).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConstituencyDetail;
