import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { PartyStats } from "@/types/election";

interface Props {
  data: PartyStats[];
}

const PartyBarChart = ({ data }: Props) => {
  const top15 = data.slice(0, 15).map((d) => ({
    ...d,
    shortName: d.party.length > 18 ? d.party.slice(0, 18) + "…" : d.party,
  }));

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-heading font-bold text-card-foreground mb-1">शीर्ष दलहरूको मत</h3>
      <p className="text-xs text-muted-foreground mb-4">Top Parties by Votes (Bar Chart)</p>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={top15} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis type="number" tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)} fontSize={11} />
            <YAxis type="category" dataKey="shortName" width={140} fontSize={10} tick={{ fill: "hsl(220 30% 10%)" }} />
            <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="totalVotes" radius={[0, 6, 6, 0]} barSize={20}>
              {top15.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PartyBarChart;
