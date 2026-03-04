import { useState, useEffect, useCallback, useMemo } from "react";
import type { Candidate } from "@/types/election";
import { Trophy, ChevronLeft, ChevronRight, Pause, Play, MapPin, Building2, Stamp, Users } from "lucide-react";
import { getPartyColor } from "@/lib/electionUtils";
import { getCandidatePhotoUrl } from "@/lib/candidateUtils";

interface Props {
    data: Candidate[];
    onSelectCandidate?: (candidate: Candidate) => void;
}

const SLIDE_INTERVAL = 5000; // ms

/**
 * Picks one "featured" candidate per constituency – the one with the highest votes
 * (or a random one if no votes are in yet). Returns a shuffled subset.
 */
function pickFeaturedCandidates(data: Candidate[]): Candidate[] {
    const byConst = new Map<number, Candidate[]>();
    data.forEach((c) => {
        const arr = byConst.get(c.SCConstID) || [];
        arr.push(c);
        byConst.set(c.SCConstID, arr);
    });

    const featured: Candidate[] = [];
    byConst.forEach((candidates) => {
        const sorted = [...candidates].sort(
            (a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0)
        );
        featured.push(sorted[0]);
    });

    // Shuffle
    for (let i = featured.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [featured[i], featured[j]] = [featured[j], featured[i]];
    }

    return featured.slice(0, 60); // cap at 60 slides for performance
}

const WinnerSlider = ({ data, onSelectCandidate }: Props) => {
    const slides = useMemo(() => pickFeaturedCandidates(data), [data]);
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(true);
    const [imgError, setImgError] = useState(false);

    const prev = useCallback(() => {
        setIdx((i) => (i - 1 + slides.length) % slides.length);
        setImgError(false);
    }, [slides.length]);

    const next = useCallback(() => {
        setIdx((i) => (i + 1) % slides.length);
        setImgError(false);
    }, [slides.length]);

    useEffect(() => {
        if (!playing || slides.length === 0) return;
        const timer = setInterval(next, SLIDE_INTERVAL);
        return () => clearInterval(timer);
    }, [playing, next, slides.length]);

    // Reset imgError whenever slide changes
    useEffect(() => {
        setImgError(false);
    }, [idx]);

    if (slides.length === 0) return null;

    const c = slides[idx];
    const votes = c.TotalVoteReceived || 0;

    // Calculate margin
    const constId = c.SCConstID;
    const inConst = useMemo(() => {
        return data
            .filter((cand) => cand.SCConstID === constId)
            .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));
    }, [data, constId]);

    const secondPlace = inConst[1];
    const margin = (c.TotalVoteReceived || 0) - (secondPlace?.TotalVoteReceived || 0);

    const color = getPartyColor(c.PoliticalPartyName, idx);
    const photoUrl = getCandidatePhotoUrl(c.CandidateID);

    return (
        <div
            className="relative overflow-hidden rounded-2xl border border-border/50 shadow-xl"
            style={{
                background: `linear-gradient(135deg, ${color}18, ${color}06, hsl(var(--background)))`,
                borderColor: `${color}25`,
            }}
        >
            {/* Decorative background orbs */}
            <div
                className="absolute -top-16 -right-16 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: color }}
            />
            <div
                className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10 blur-3xl pointer-events-none"
                style={{ background: color }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}20` }}>
                        <Trophy className="w-3.5 h-3.5" style={{ color }} />
                    </div>
                    <div>
                        <h3 className="text-sm font-heading font-bold text-foreground leading-tight">
                            निर्वाचन क्षेत्र प्रदर्शन
                        </h3>
                        <p className="text-[11px] text-muted-foreground">Constituency Spotlight · Auto-rotating results</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground">
                        {idx + 1}/{slides.length}
                    </span>
                    <button
                        onClick={() => setPlaying((p) => !p)}
                        className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors text-muted-foreground"
                    >
                        {playing ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                    <button
                        onClick={prev}
                        className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors text-muted-foreground"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={next}
                        className="w-7 h-7 rounded-full border border-border/60 flex items-center justify-center hover:border-primary/40 hover:text-primary transition-colors text-muted-foreground"
                    >
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Slide content */}
            <div
                className="px-5 pb-5 relative z-10 cursor-pointer"
                onClick={() => onSelectCandidate?.(c)}
            >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    {/* Photo / Avatar */}
                    <div className="flex-shrink-0 relative">
                        {!imgError ? (
                            <img
                                src={photoUrl}
                                alt={c.CandidateName}
                                onError={() => setImgError(true)}
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg border-2"
                                style={{ borderColor: `${color}40` }}
                            />
                        ) : (
                            <div
                                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-3xl font-heading font-bold text-white shadow-lg border-2"
                                style={{
                                    background: `linear-gradient(135deg, ${color}, ${color}99)`,
                                    borderColor: `${color}40`,
                                }}
                            >
                                {c.CandidateName.charAt(0)}
                            </div>
                        )}
                        {/* Constituency badge */}
                        <div
                            className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-sm"
                            style={{ background: color }}
                        >
                            #{c.SCConstID}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1 space-y-2">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-heading font-bold text-foreground leading-tight">
                                {c.CandidateName}
                            </h2>
                            {c.AGE_YR > 0 && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Age / उमेर: {c.AGE_YR} · {c.Gender}
                                </p>
                            )}
                        </div>

                        {/* Chips row */}
                        <div className="flex flex-wrap gap-1.5">
                            <span
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                                style={{ background: color }}
                            >
                                <Building2 className="w-3 h-3" />
                                {c.PoliticalPartyName.length > 30 ? c.PoliticalPartyName.slice(0, 30) + "…" : c.PoliticalPartyName}
                            </span>
                            {c.SymbolName && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300">
                                    <Stamp className="w-3 h-3" />
                                    {c.SymbolName}
                                </span>
                            )}
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                <MapPin className="w-3 h-3" />
                                {c.DistrictName}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                <Users className="w-3 h-3" />
                                {c.StateName}
                            </span>
                        </div>

                        {/* Vote count or pending */}
                        <div className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                {votes > 0 ? (
                                    <>
                                        <span
                                            className="text-3xl sm:text-4xl font-heading font-black"
                                            style={{ color }}
                                        >
                                            {votes.toLocaleString()}
                                        </span>
                                        <span className="text-sm text-muted-foreground font-medium">votes · मत प्राप्त</span>
                                    </>
                                ) : (
                                    <span className="badge-pending text-sm px-3 py-1.5">
                                        Counting pending · मतगणना अपेक्षित
                                    </span>
                                )}
                            </div>

                            {votes > 0 && secondPlace && margin > 0 && (
                                <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                    Lead / अग्रता: {margin.toLocaleString()} votes over {secondPlace.CandidateName}
                                </p>
                            )}
                        </div>

                        {/* Extra detail line */}
                        <p className="text-[11px] text-muted-foreground">
                            Area / क्षेत्र {c.SCConstID} • {c.DistrictName}, {c.StateName}
                            {c.QUALIFICATION && ` • ${c.QUALIFICATION}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-1 pb-3 relative z-10">
                {Array.from({ length: Math.min(slides.length, 12) }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => { setIdx(i); setImgError(false); }}
                        className={`rounded-full transition-all duration-300 ${i === idx % Math.min(slides.length, 12)
                            ? "w-5 h-1.5"
                            : "w-1.5 h-1.5 opacity-40"
                            }`}
                        style={{ background: color }}
                    />
                ))}
                {slides.length > 12 && (
                    <span className="text-[10px] text-muted-foreground self-center ml-1">+{slides.length - 12}</span>
                )}
            </div>
        </div>
    );
};

export default WinnerSlider;
