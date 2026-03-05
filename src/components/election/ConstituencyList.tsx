import { useMemo, useState } from "react";
import type { Candidate } from "@/types/election";
import { ChevronRight, ChevronLeft, ChevronRight as ChevRight, Trophy, Users, MapPin, Clock } from "lucide-react";

interface ConstituencyInfo {
  id: number;
  district: string;
  province: string;
  candidates: number;
  totalVotes: number;
  leader: string;
  leaderParty: string;
  leaderVotes: number;
}

interface Props {
  data: Candidate[];
  onSelect: (constituency: { id: number; district: string }) => void;
}

const PAGE_SIZE = 18;

const ConstituencyList = ({ data, onSelect }: Props) => {
  const [page, setPage] = useState(1);

  const constituencies = useMemo(() => {
    const map = new Map<string, ConstituencyInfo>();
    data.forEach((c) => {
      const key = `${c.DistrictName}-${c.SCConstID}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          id: c.SCConstID,
          district: c.DistrictName,
          province: c.StateName,
          candidates: 1,
          totalVotes: c.TotalVoteReceived || 0,
          leader: c.CandidateName,
          leaderParty: c.PoliticalPartyName,
          leaderVotes: c.TotalVoteReceived || 0,
        });
      } else {
        existing.candidates += 1;
        existing.totalVotes += c.TotalVoteReceived || 0;
        if ((c.TotalVoteReceived || 0) > existing.leaderVotes) {
          existing.leader = c.CandidateName;
          existing.leaderParty = c.PoliticalPartyName;
          existing.leaderVotes = c.TotalVoteReceived || 0;
        }
        map.set(key, existing);
      }
    });
    return Array.from(map.values()).sort((a, b) => {
      const distCmp = a.district.localeCompare(b.district);
      if (distCmp !== 0) return distCmp;
      return a.id - b.id;
    });
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(constituencies.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = constituencies.slice(start, start + PAGE_SIZE);

  const handlePage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  return (
    <div className="card-premium p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-heading font-bold text-card-foreground">निर्वाचन क्षेत्र</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {constituencies.length} क्षेत्र • क्लिक गरी विस्तृत हेर्नुहोस् • Click to view details
          </p>
        </div>
        {totalPages > 1 && (
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full flex-shrink-0">
            {safePage}/{totalPages}
          </span>
        )}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="font-medium">कोही क्षेत्र भेटिएन</p>
          <p className="text-xs mt-1">No constituencies found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {visible.map((c) => (
            <button
              key={`${c.district}-${c.id}`}
              onClick={() => onSelect({ id: c.id, district: c.district })}
              className="flex items-start gap-3 p-3.5 rounded-xl border border-border/70 bg-background text-left group hover:border-primary/30 hover:bg-primary/3 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Icon */}
              <div className="w-9 h-9 rounded-lg bg-gradient-nepal flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">{c.id}</span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="text-sm font-heading font-bold text-card-foreground truncate">
                      {c.district} - {c.id}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-0.5">
                      <MapPin className="w-2.5 h-2.5" /> {c.province}
                    </p>
                  </div>
                  <ChevRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
                </div>

                {/* Leader */}
                <div className="mt-1.5 flex items-center gap-1">
                  {c.leaderVotes > 0 ? (
                    <>
                      <Trophy className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                      <p className="text-[11px] text-primary font-semibold truncate">
                        {c.leader.length > 18 ? c.leader.slice(0, 18) + "…" : c.leader}
                      </p>
                    </>
                  ) : (
                    <>
                      <Clock className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                      <p className="text-[11px] text-amber-600 dark:text-amber-400">परिणाम अपेक्षित</p>
                    </>
                  )}
                </div>

                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5">
                    <Users className="w-2.5 h-2.5" /> {c.candidates}
                  </span>
                  {c.totalVotes > 0 && (
                    <>
                      <span>•</span>
                      <span>{c.totalVotes.toLocaleString()} मत</span>
                    </>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/50">
          <button
            onClick={() => handlePage(safePage - 1)}
            disabled={safePage === 1}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border/70 text-xs text-muted-foreground disabled:opacity-30 hover:border-primary/40 hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            अघिल्लो
          </button>

          <span className="text-xs text-muted-foreground">
            {start + 1}–{Math.min(start + PAGE_SIZE, constituencies.length)} / {constituencies.length}
          </span>

          <button
            onClick={() => handlePage(safePage + 1)}
            disabled={safePage === totalPages}
            className="flex items-center gap-1.5 px-3 h-8 rounded-lg border border-border/70 text-xs text-muted-foreground disabled:opacity-30 hover:border-primary/40 hover:text-primary transition-colors"
          >
            अर्को
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ConstituencyList;
