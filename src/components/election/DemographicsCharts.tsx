import { useMemo } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import type { Candidate } from "@/types/election";
import { GraduationCap, Briefcase } from "lucide-react";

interface Props {
    data: Candidate[];
}

const COLORS = [
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
    "#84cc16", // Lime
];

const DemographicsCharts = ({ data }: Props) => {
    const educationData = useMemo(() => {
        const map = new Map<string, number>();
        data.forEach((c) => {
            const edu = c.QUALIFICATION?.trim() || "Not Specified / उल्लेख नगरिएको";
            map.set(edu, (map.get(edu) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [data]);

    const experienceData = useMemo(() => {
        const map = new Map<string, number>();
        data.forEach((c) => {
            const exp = c.EXPERIENCE?.trim() || "No previous experience / कुनै पूर्व अनुभव छैन";
            const simpleExp = exp.length > 35 ? exp.slice(0, 35) + "..." : exp;
            map.set(simpleExp, (map.get(simpleExp) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }, [data]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Education Chart Card */}
            <div className="card-premium p-5 sm:p-6 h-[460px] flex flex-col group transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-3">
                        <div className="w-1.5 h-10 rounded-full bg-blue-500 shadow-sm shadow-blue-500/20" />
                        <div>
                            <h3 className="text-lg font-heading font-bold text-foreground leading-tight">
                                शैक्षिक योग्यता विवरण
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Education Breakdown</p>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400">
                        <GraduationCap className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={educationData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={95}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {educationData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '12px',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                layout="horizontal"
                                align="center"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{
                                    fontSize: '10.5px',
                                    fontWeight: 500,
                                    paddingTop: '20px',
                                    maxHeight: '100px',
                                    overflowY: 'auto'
                                }}
                                formatter={(value) => <span className="text-foreground/80">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Central Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-14 sm:pb-20">
                        <p className="text-2xl font-black text-foreground">
                            {data.length}
                        </p>
                        <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold font-heading">
                            Total Candidates
                        </p>
                    </div>
                </div>
            </div>

            {/* Experience Chart Card */}
            <div className="card-premium p-5 sm:p-6 h-[460px] flex flex-col group transition-all duration-300">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-3">
                        <div className="w-1.5 h-10 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                        <div>
                            <h3 className="text-lg font-heading font-bold text-foreground leading-tight">
                                अनुभव विवरण
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">Experience Breakdown</p>
                        </div>
                    </div>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400">
                        <Briefcase className="w-5 h-5" />
                    </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={experienceData}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={95}
                                paddingAngle={4}
                                dataKey="value"
                                stroke="none"
                            >
                                {experienceData.map((_, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[(index + 2) % COLORS.length]}
                                        className="hover:opacity-80 transition-opacity"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'hsl(var(--background))',
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '12px',
                                    padding: '8px 12px',
                                    fontSize: '12px',
                                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                layout="horizontal"
                                align="center"
                                iconType="circle"
                                iconSize={8}
                                wrapperStyle={{
                                    fontSize: '10.5px',
                                    fontWeight: 500,
                                    paddingTop: '20px',
                                    maxHeight: '100px',
                                    overflowY: 'auto'
                                }}
                                formatter={(value) => <span className="text-foreground/80">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Central Text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-14 sm:pb-20">
                        <p className="text-2xl font-black text-foreground">
                            {data.length}
                        </p>
                        <p className="text-[10px] uppercase tracking-tighter text-muted-foreground font-bold font-heading">
                            Candidates
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DemographicsCharts;
