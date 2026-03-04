import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { Candidate } from "@/types/election";
import { Layout } from "lucide-react";

interface Props {
    data: Candidate[];
}

const GenderByProvinceChart = ({ data }: Props) => {
    const chartData = useMemo(() => {
        const provinceMap = new Map<string, { province: string; Male: number; Female: number; Other: number }>();

        data.forEach((c) => {
            const province = c.StateName || "Unknown";
            if (!provinceMap.has(province)) {
                provinceMap.set(province, { province, Male: 0, Female: 0, Other: 0 });
            }
            const stats = provinceMap.get(province)!;
            const gender = c.Gender === "पुरुष" || c.Gender === "Male" ? "Male" :
                c.Gender === "महिला" || c.Gender === "Female" ? "Female" : "Other";
            stats[gender]++;
        });

        return Array.from(provinceMap.values()).sort((a, b) => a.province.localeCompare(b.province));
    }, [data]);

    return (
        <div className="card-premium p-5 sm:p-6 h-[420px] flex flex-col group">
            <div className="flex items-start justify-between mb-6 gap-3">
                <div className="flex gap-3">
                    <div className="w-1.5 h-10 rounded-full gradient-nepal shadow-sm" />
                    <div>
                        <h3 className="text-lg font-heading font-bold text-foreground leading-tight">
                            प्रदेश अनुसार लैंगिक प्रतिनिधित्व
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Gender Representation by Province
                        </p>
                    </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md">
                    <Layout className="w-3 h-3" />
                    Provincial View
                </div>
            </div>

            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                        barSize={20}
                    >
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis type="number" hide />
                        <YAxis
                            dataKey="province"
                            type="category"
                            tick={{ fontSize: 11, fill: 'currentColor', fontWeight: 500 }}
                            width={100}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip
                            cursor={{ fill: 'hsl(var(--primary) / 0.05)', radius: 4 }}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                borderColor: 'hsl(var(--border))',
                                borderRadius: '12px',
                                fontSize: '12px',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                border: '1px solid hsl(var(--border))',
                                padding: '8px 12px',
                            }}
                            itemStyle={{ padding: '2px 0' }}
                        />
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '11px', fontWeight: 600, paddingBottom: '20px' }}
                        />
                        <Bar dataKey="Male" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} name="Male / पुरुष" />
                        <Bar dataKey="Female" stackId="a" fill="#ec4899" radius={[0, 0, 0, 0]} name="Female / महिला" />
                        <Bar dataKey="Other" stackId="a" fill="#94a3b8" radius={[0, 4, 4, 0]} name="Other / अन्य" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GenderByProvinceChart;
