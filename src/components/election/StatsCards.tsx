import { Users, Vote, MapPin, Building2, TrendingUp } from "lucide-react";
import type { Candidate } from "@/types/election";

interface StatsCardsProps {
  data: Candidate[];
}

const StatsCards = ({ data }: StatsCardsProps) => {
  const totalCandidates = data.length;
  const totalVotes = data.reduce((sum, c) => sum + (c.TotalVoteReceived || 0), 0);
  const totalParties = new Set(data.map((c) => c.PoliticalPartyName)).size;
  const totalDistricts = new Set(data.map((c) => c.DistrictName)).size;
  const totalConstituencies = new Set(data.map((c) => `${c.DistrictName}-${c.SCConstID}`)).size;

  const stats = [
    {
      label: "Total Candidates",
      value: totalCandidates.toLocaleString(),
      icon: Users,
      gradient: "from-red-500/20 to-rose-600/20",
      iconColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-50 dark:bg-red-950/50",
      border: "hover:border-red-200 dark:hover:border-red-800",
    },
    {
      label: "Total Votes",
      value: totalVotes > 0 ? totalVotes.toLocaleString() : "—",
      icon: Vote,
      gradient: "from-blue-500/20 to-indigo-600/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/50",
      border: "hover:border-blue-200 dark:hover:border-blue-800",
    },
    {
      label: "Political Parties",
      value: totalParties.toLocaleString(),
      icon: Building2,
      gradient: "from-amber-500/20 to-orange-600/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/50",
      border: "hover:border-amber-200 dark:hover:border-amber-800",
    },
    {
      label: "Districts",
      value: totalDistricts.toLocaleString(),
      icon: MapPin,
      gradient: "from-emerald-500/20 to-green-600/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/50",
      border: "hover:border-emerald-200 dark:hover:border-emerald-800",
    },
    {
      label: "Constituencies",
      value: totalConstituencies.toLocaleString(),
      icon: TrendingUp,
      gradient: "from-purple-500/20 to-violet-600/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/50",
      border: "hover:border-purple-200 dark:hover:border-purple-800",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 w-full">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`card-premium p-4 border border-border/70 transition-all duration-250 ${s.border} animate-slide-in-up`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-3`}>
            <s.icon className={`w-5 h-5 ${s.iconColor}`} />
          </div>
          <p className="text-2xl sm:text-3xl font-heading font-bold text-card-foreground leading-none">
            {s.value}
          </p>
          <p className="text-xs font-semibold text-card-foreground mt-1.5">{s.label}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
