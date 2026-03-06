import type { Candidate } from "@/types/election";

interface Props {
    data: Candidate[];
}

const TOTAL_CONSTITUENCIES = 165;

const CountingProgress = ({ data }: Props) => {
    // Unique constituencies where counting has started nationwide
    const countingStarted = new Set(
        data
            .filter((c) => (c.TotalVoteReceived || 0) > 0)
            .map((c) => `${c.DistrictCd}-${c.SCConstID}`)
    );

    const totalConst = TOTAL_CONSTITUENCIES;
    const countingCount = countingStarted.size;
    const pct = Math.round((countingCount / totalConst) * 100);

    const totalVotes = data.reduce((s, c) => s + (c.TotalVoteReceived || 0), 0);

    return (
        <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                    <h3 className="text-sm font-heading font-bold text-foreground">
                        Counting Progress
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                        Constituencies where counting has begun
                    </p>
                </div>
                <div className="text-right">
                    <span className="text-2xl font-heading font-black text-primary">
                        {countingCount}
                    </span>
                    <span className="text-sm text-muted-foreground font-medium">
                        {" "}/ {totalConst}
                    </span>
                    <p className="text-[11px] text-muted-foreground">
                        {totalVotes > 0
                            ? `${totalVotes.toLocaleString()} votes counted`
                            : "Counting not yet started"}
                    </p>
                </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                    className="h-3 rounded-full transition-all duration-700 gradient-nepal"
                    style={{ width: `${Math.max(pct, countingCount > 0 ? 2 : 0)}%` }}
                />
            </div>

            {/* Segment breakdown */}
            <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                <span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-primary mr-1.5 align-middle" />
                    Counting started: <strong className="text-foreground">{countingCount}</strong>
                </span>
                <span>
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-muted-foreground/30 mr-1.5 align-middle" />
                    Pending: <strong className="text-foreground">{totalConst - countingCount}</strong>
                </span>
                <span className="ml-auto font-semibold text-primary">{pct}% reported</span>
            </div>
        </div>
    );
};

export default CountingProgress;
