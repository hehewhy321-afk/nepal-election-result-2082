import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  province: string;
  onProvinceChange: (v: string) => void;
  provinces: string[];
  party: string;
  onPartyChange: (v: string) => void;
  parties: string[];
  district: string;
  onDistrictChange: (v: string) => void;
  districts: string[];
  constituency: string;
  onConstituencyChange: (v: string) => void;
  constituencies: string[];
}

const SearchFilter = ({
  search, onSearchChange,
  province, onProvinceChange, provinces,
  party, onPartyChange, parties,
  district, onDistrictChange, districts,
  constituency, onConstituencyChange, constituencies,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const activeFilters = [province !== "all", party !== "all", district !== "all", constituency !== "all"].filter(Boolean).length;

  const clearAll = () => {
    onSearchChange("");
    onProvinceChange("all");
    onPartyChange("all");
    onDistrictChange("all");
    onConstituencyChange("all");
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      {/* Header row */}
      <div className="p-4 flex items-center gap-3 border-b border-border/60">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="उम्मेदवार / जिल्ला खोज्नुहोस्... (Search candidate or district)"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 h-10 rounded-xl border-border/70 bg-background/60 focus-visible:ring-primary/30"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className={`flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-medium transition-colors ${expanded || activeFilters > 0
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "border-border/70 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">फिल्टर</span>
          {activeFilters > 0 && (
            <span className="bg-primary-foreground/20 text-primary-foreground text-xs px-1.5 py-0.5 rounded-full font-bold">
              {activeFilters}
            </span>
          )}
        </button>

        {activeFilters > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 h-10 rounded-xl border border-border/70 text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">सबै हटाउनुस्</span>
          </button>
        )}
      </div>

      {/* Expanded filter row */}
      {expanded && (
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-muted/20 animate-slide-in-up">
          {/* Province */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">प्रदेश / Province</label>
            <Select value={province} onValueChange={(v) => { onProvinceChange(v); onDistrictChange("all"); onConstituencyChange("all"); }}>
              <SelectTrigger className="h-9 text-sm rounded-xl bg-background">
                <SelectValue placeholder="सबै प्रदेश" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै प्रदेश</SelectItem>
                {provinces.map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* District */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">जिल्ला / District</label>
            <Select value={district} onValueChange={(v) => { onDistrictChange(v); onConstituencyChange("all"); }}>
              <SelectTrigger className="h-9 text-sm rounded-xl bg-background">
                <SelectValue placeholder="सबै जिल्ला" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै जिल्ला</SelectItem>
                {districts.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Constituency */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">निर्वाचन क्षेत्र / Area</label>
            <Select value={constituency} onValueChange={onConstituencyChange}>
              <SelectTrigger className="h-9 text-sm rounded-xl bg-background">
                <SelectValue placeholder="सबै क्षेत्र" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै क्षेत्र</SelectItem>
                {constituencies.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Party */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">राजनीतिक दल / Party</label>
            <Select value={party} onValueChange={onPartyChange}>
              <SelectTrigger className="h-9 text-sm rounded-xl bg-background">
                <SelectValue placeholder="सबै दल" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">सबै दल</SelectItem>
                {parties.slice(0, 30).map((p) => (
                  <SelectItem key={p} value={p}>{p.length > 35 ? p.slice(0, 35) + "…" : p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
