import { LayoutDashboard, Users, Trophy, Vote, Search, Map, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

export type TabType = "overview" | "party" | "parliament" | "candidates" | "winners" | "search" | "provinces" | "pr";

interface DashboardNavProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "party", label: "Party Results", icon: Vote },
    { id: "parliament", label: "Parliament", icon: Map },
    { id: "candidates", label: "Candidates", icon: Users },
    { id: "winners", label: "Winners", icon: Trophy },
    { id: "search", label: "Search", icon: Search },
];

const DashboardNav = ({ activeTab, onTabChange }: DashboardNavProps) => {
    return (
        <div className="w-full bg-card/50 backdrop-blur-md border border-border/50 rounded-xl p-1 mb-6 sticky top-4 z-50 shadow-sm overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1 min-w-max">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isActive ? "animate-pulse-slow" : "opacity-70")} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardNav;
