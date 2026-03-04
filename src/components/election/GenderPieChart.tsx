import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { GenderStats } from "@/types/election";
import { Users2 } from "lucide-react";

const COLORS = ["#3b82f6", "#ec4899", "#94a3b8"];

interface Props {
  data: GenderStats[];
}

const GenderPieChart = ({ data }: Props) => {
  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="card-premium p-5 sm:p-6 h-[420px] flex flex-col group transition-all duration-300">
      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-3">
          <div className="w-1.5 h-10 rounded-full gradient-nepal shadow-sm" />
          <div>
            <h3 className="text-lg font-heading font-bold text-foreground leading-tight">
              लैङ्गिक विविधता
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Gender Distribution of Candidates
            </p>
          </div>
        </div>
        <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
          <Users2 className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={4}
              dataKey="count"
              nameKey="gender"
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                padding: "8px 12px",
                fontSize: "12px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              layout="horizontal"
              align="center"
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "11px", fontWeight: 600, paddingTop: "20px" }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Central Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-12">
          <p className="text-2xl font-black text-foreground">
            {total.toLocaleString()}
          </p>
          <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold font-heading">
            Total Candidates
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenderPieChart;
