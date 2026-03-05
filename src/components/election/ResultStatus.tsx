import type { Candidate } from "@/types/election";
import { Clock, Radio, CheckCircle2, RefreshCw } from "lucide-react";
import { isResultsAvailable, isPartialResults } from "@/hooks/useElectionData";

interface Props {
    data: Candidate[];
    isFetching: boolean;
    lastUpdated?: Date;
}

const ResultStatus = ({ data, isFetching, lastUpdated }: Props) => {
    const hasAny = isResultsAvailable(data);
    const isPartial = isPartialResults(data);

    const fmt = (d: Date) =>
        d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-4 sm:p-5 border flex flex-col sm:flex-row items-start sm:items-center gap-4 ${!hasAny
                ? "bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50"
                : isPartial
                    ? "bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50"
                    : "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50"
                }`}
        >
            {/* Accent stripe */}
            <div
                className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${!hasAny ? "bg-amber-400" : isPartial ? "bg-blue-500" : "bg-emerald-500"
                    }`}
            />

            <div className="flex items-center gap-3 flex-1 min-w-0 pl-2">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${!hasAny
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400"
                        : isPartial
                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                            : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400"
                        }`}
                >
                    {!hasAny ? (
                        <Clock className="w-5 h-5" />
                    ) : isPartial ? (
                        <Radio className="w-5 h-5 animate-pulse" />
                    ) : (
                        <CheckCircle2 className="w-5 h-5" />
                    )}
                </div>

                <div className="min-w-0">
                    <p className="font-heading font-bold text-sm sm:text-base text-foreground">
                        {!hasAny
                            ? "Results Expected Soon"
                            : isPartial
                                ? "Partial Results Live"
                                : "Full Results Available"}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {!hasAny
                            ? "Counting not yet started. Results expected in 24hrs."
                            : isPartial
                                ? "Counting in progress. Page auto-refreshes."
                                : "All results are in."}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground pl-14 sm:pl-0 flex-shrink-0">
                {isFetching && <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />}
                {lastUpdated && (
                    <span>Updated: {fmt(lastUpdated)}</span>
                )}
                <span className="text-muted-foreground/50">•</span>
                <span className="text-primary font-semibold">{data.length.toLocaleString()} Candidates</span>
            </div>
        </div>
    );
};

export default ResultStatus;
