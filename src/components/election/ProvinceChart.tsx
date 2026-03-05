import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { ProvinceStats } from "@/types/election";

const PROVINCE_COLORS = ["#C62828", "#1565C0", "#F9A825", "#2E7D32", "#6A1B9A", "#EF6C00", "#00838F"];

interface Props {
  data: ProvinceStats[];
}

const ProvinceChart = ({ data }: Props) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-heading font-bold text-card-foreground mb-1">Province-wise Votes</h3>
      <p className="text-xs text-muted-foreground mb-4">Total votes received by all candidates in each province</p>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ bottom: 40 }}>
            <XAxis dataKey="province" fontSize={10} angle={-20} textAnchor="end" interval={0} />
            <YAxis tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)} fontSize={11} />
            <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
            <Bar dataKey="totalVotes" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((_, i) => (
                <Cell key={i} fill={PROVINCE_COLORS[i % PROVINCE_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProvinceChart;
