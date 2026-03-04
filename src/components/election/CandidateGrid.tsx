import { useState, useEffect } from "react";
import type { Candidate } from "@/types/election";
import { User, MapPin, Building2, Trophy, Clock, ChevronLeft, ChevronRight, Info, Stamp } from "lucide-react";
import { getPartyColor } from "@/lib/electionUtils";

interface Props {
  data: Candidate[];
  onSelectCandidate?: (candidate: Candidate) => void;
}

const PAGE_SIZE = 12;

const CandidateGrid = ({ data, onSelectCandidate }: Props) => {
  const [page, setPage] = useState(1);

  // Reset to page 1 whenever filtered data changes
  useEffect(() => {
    setPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = data.slice(start, start + PAGE_SIZE);

  const handlePage = (p: number) => setPage(Math.max(1, Math.min(p, totalPages)));

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safePage > 3) pages.push("...");
      for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
        pages.push(i);
      }
      if (safePage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="card-premium p-5 sm:p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4 gap-3">
        <div>
          <h3 className="text-lg font-heading font-bold text-card-foreground">
            उम्मेदवार सूची
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Candidate List · {data.length.toLocaleString()} · Showing {start + 1}–{Math.min(start + PAGE_SIZE, data.length)}
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full whitespace-nowrap">
          Page / पृष्ठ {safePage}/{totalPages}
        </span>
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <User className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p className="font-medium">कोही उम्मेदवार भेटिएन</p>
          <p className="text-xs mt-1">No candidates found for these filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visible.map((c, idx) => {
            const rank = start + idx + 1;
            const votes = c.TotalVoteReceived || 0;
            const isLeader = votes > 0 && idx === 0 && safePage === 1;
            const color = getPartyColor(c.PoliticalPartyName, idx);

            return (
              <div
                key={c.CandidateID}
                onClick={() => onSelectCandidate?.(c)}
                className={`relative rounded-xl border p-4 transition-all duration-200 group ${onSelectCandidate ? "cursor-pointer" : ""
                  } ${isLeader
                    ? "border-yellow-300/80 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 shadow-gold hover:-translate-y-1 hover:shadow-lg"
                    : "border-border/70 bg-background hover:-translate-y-1 hover:shadow-md hover:border-primary/20"
                  }`}
              >
                {/* Winner crown */}
                {isLeader && votes > 0 && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center shadow-sm">
                    <Trophy className="w-3.5 h-3.5 text-white" />
                  </div>
                )}

                {/* Click indicator */}
                {onSelectCandidate && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Info className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  {/* Avatar with symbol tooltip */}
                  <div className="relative flex-shrink-0 group/avatar">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                      style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                    >
                      {c.CandidateName.charAt(0)}
                    </div>
                    {/* Symbol tooltip */}
                    {c.SymbolName && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded-lg bg-popover border border-border text-[10px] text-popover-foreground whitespace-nowrap shadow-lg opacity-0 group-hover/avatar:opacity-100 pointer-events-none transition-opacity z-10">
                        <Stamp className="w-2.5 h-2.5 inline mr-1 text-muted-foreground" />
                        {c.SymbolName}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-card-foreground truncate leading-tight">
                      {c.CandidateName}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3 h-3 flex-shrink-0" />
                      {c.PoliticalPartyName.length > 28 ? c.PoliticalPartyName.slice(0, 28) + "…" : c.PoliticalPartyName}
                    </p>
                    <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {c.DistrictName} · Area / क्षेत्र {c.SCConstID}
                    </p>
                  </div>
                </div>

                {/* Votes */}
                <div className="mt-3 pt-3 border-t border-border/50 flex items-center justify-between">
                  {votes > 0 ? (
                    <span className="text-base font-heading font-bold text-primary">
                      {votes.toLocaleString()}
                      <span className="text-[11px] font-normal text-muted-foreground ml-1">votes · मत</span>
                    </span>
                  ) : (
                    <span className="badge-pending">
                      <Clock className="w-3 h-3" />
                      Pending · अपेक्षित
                    </span>
                  )}
                  <span className="text-[11px] text-muted-foreground">#{rank}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            {data.length.toLocaleString()} candidates · Showing page {safePage} of {totalPages}
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePage(safePage - 1)}
              disabled={safePage === 1}
              className="flex items-center gap-1 px-2.5 h-8 rounded-lg border border-border/70 text-xs text-muted-foreground disabled:opacity-30 hover:border-primary/40 hover:text-primary transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>

            {pageNumbers().map((p, i) =>
              p === "..." ? (
                <span key={`e${i}`} className="w-8 text-center text-muted-foreground text-sm">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => handlePage(p as number)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === safePage
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border/70 text-muted-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => handlePage(safePage + 1)}
              disabled={safePage === totalPages}
              className="flex items-center gap-1 px-2.5 h-8 rounded-lg border border-border/70 text-xs text-muted-foreground disabled:opacity-30 hover:border-primary/40 hover:text-primary transition-colors"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateGrid;
