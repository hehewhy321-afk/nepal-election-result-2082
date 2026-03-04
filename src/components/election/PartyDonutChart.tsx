import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { PartyStats } from "@/types/election";

interface PartyDonutChartProps {
  data: PartyStats[];
}

const PartyDonutChart = ({ data }: PartyDonutChartProps) => {
  const top10 = data.slice(0, 10);
  const others = data.slice(10);
  const chartData = [
    ...top10,
    ...(others.length > 0
      ? [{ party: "अन्य", totalVotes: others.reduce((s, p) => s + p.totalVotes, 0), candidates: others.reduce((s, p) => s + p.candidates, 0), color: "#9E9E9E" }]
      : []),
  ];

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-lg font-heading font-bold text-card-foreground mb-1">पार्टी अनुसार मत वितरण</h3>
      <p className="text-xs text-muted-foreground mb-4">Party-wise Vote Distribution (Donut)</p>
      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              dataKey="totalVotes"
              nameKey="party"
            >
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => value.toLocaleString()}
              contentStyle={{ borderRadius: 12, fontSize: 12 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11 }}
              formatter={(value) => {
                const str = String(value || "");
                return str.length > 20 ? str.slice(0, 20) + "…" : str;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PartyDonutChart;
