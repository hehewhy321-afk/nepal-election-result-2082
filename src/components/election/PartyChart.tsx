import { useState } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis,
} from "recharts";
import type { PartyStats } from "@/types/election";
import { PieChart as PieIcon, BarChart2 } from "lucide-react";

interface Props {
    data: PartyStats[];
}

const PartyChart = ({ data }: Props) => {
    const [view, setView] = useState<"donut" | "bar">("donut");

    const top10 = data.slice(0, 10);
    const others = data.slice(10);
    const donutData = [
        ...top10,
        ...(others.length > 0
            ? [{ party: "Others", totalVotes: others.reduce((s, p) => s + p.totalVotes, 0), candidates: others.reduce((s, p) => s + p.candidates, 0), color: "#9E9E9E" }]
            : []),
    ];

    const barData = data.slice(0, 15).map((d) => ({
        ...d,
        shortName: d.party.length > 20 ? d.party.slice(0, 20) + "…" : d.party,
    }));

    return (
        <div className="card-premium p-5 sm:p-6">
            {/* Header + toggle */}
            <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                    <h3 className="text-lg font-heading font-bold text-card-foreground">
                        Party-wise Analysis
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Performance of {data.length} political parties
                    </p>
                </div>
                <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setView("donut")}
                        title="Donut chart"
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${view === "donut"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <PieIcon className="w-3.5 h-3.5" />
                        Donut
                    </button>
                    <button
                        onClick={() => setView("bar")}
                        title="Bar chart"
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${view === "bar"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        <BarChart2 className="w-3.5 h-3.5" />
                        Bar
                    </button>
                </div>
            </div>

            <div className="h-[380px]">
                <ResponsiveContainer width="100%" height="100%">
                    {view === "donut" ? (
                        <PieChart>
                            <Pie
                                data={donutData}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={130}
                                paddingAngle={2}
                                dataKey="totalVotes"
                                nameKey="party"
                            >
                                {donutData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number, _name, props) => [
                                    `${value.toLocaleString()} votes · ${props.payload.candidates} candidates`,
                                    props.payload.party,
                                ]}
                                contentStyle={{ borderRadius: 12, fontSize: 12 }}
                            />
                            <Legend
                                wrapperStyle={{ fontSize: 11 }}
                                formatter={(value) => {
                                    const s = String(value || "");
                                    return s.length > 22 ? s.slice(0, 22) + "…" : s;
                                }}
                            />
                        </PieChart>
                    ) : (
                        <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
                            <XAxis
                                type="number"
                                tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
                                fontSize={11}
                            />
                            <YAxis
                                type="category"
                                dataKey="shortName"
                                width={148}
                                fontSize={10}
                                tick={{ fill: "hsl(var(--foreground))" }}
                            />
                            <Tooltip
                                formatter={(v: number, _name, props) => [
                                    `${v.toLocaleString()} votes · ${props.payload.candidates} candidates`,
                                    props.payload.party,
                                ]}
                                contentStyle={{ borderRadius: 12, fontSize: 12 }}
                            />
                            <Bar dataKey="totalVotes" radius={[0, 6, 6, 0]} barSize={18}>
                                {barData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default PartyChart;
