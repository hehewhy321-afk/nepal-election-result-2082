import { useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import type { Candidate } from "@/types/election";
import { Users } from "lucide-react";

interface Props {
    data: Candidate[];
}

const BUCKETS = [
    { label: "18–30", min: 18, max: 30 },
    { label: "31–40", min: 31, max: 40 },
    { label: "41–50", min: 41, max: 50 },
    { label: "51–60", min: 51, max: 60 },
    { label: "61–70", min: 61, max: 70 },
    { label: "71+", min: 71, max: 200 },
];

const AgeDistributionChart = ({ data }: Props) => {
    const chartData = useMemo(() => {
        return BUCKETS.map(({ label, min, max }) => {
            const inBucket = data.filter((c) => {
                const age = c.AGE_YR || 0;
                return age >= min && age <= max;
            });
            const male = inBucket.filter((c) => c.Gender === "पुरुष").length;
            const female = inBucket.filter((c) => c.Gender !== "पुरुष").length;
            return { label, male, female, total: inBucket.length };
        });
    }, [data]);

    const totalWithAge = data.filter((c) => c.AGE_YR && c.AGE_YR > 0).length;
    const avgAge = totalWithAge > 0
        ? Math.round(data.reduce((s, c) => s + (c.AGE_YR || 0), 0) / totalWithAge)
        : 0;

    return (
        <div className="card-premium p-5 sm:p-6">
            <div className="flex items-start justify-between mb-4 gap-3">
                <div>
                    <h3 className="text-lg font-heading font-bold text-card-foreground">
                        उमेर वितरण
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Age Distribution by Gender · Avg age: {avgAge} yrs
                    </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
                    <Users className="w-3.5 h-3.5" />
                    {data.length.toLocaleString()} candidates
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ left: 0, right: 10, top: 5, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                        <XAxis dataKey="label" fontSize={12} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                        <YAxis
                            fontSize={11}
                            tick={{ fill: "hsl(var(--muted-foreground))" }}
                            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v))}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: 12, fontSize: 12 }}
                            formatter={(val: number, name: string) => [
                                val.toLocaleString(),
                                name === "male" ? "Male (पुरुष)" : "Female (महिला)",
                            ]}
                        />
                        <Legend
                            formatter={(value) => (value === "male" ? "Male · पुरुष" : "Female · महिला")}
                            wrapperStyle={{ fontSize: 12 }}
                        />
                        <Bar dataKey="male" name="male" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={36} />
                        <Bar dataKey="female" name="female" stackId="a" fill="#ec4899" radius={[6, 6, 0, 0]} barSize={36} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AgeDistributionChart;
