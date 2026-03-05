import { useState, useMemo } from "react";
import type { Candidate } from "@/types/election";
import { useElectionData } from "@/hooks/useElectionData";
import {
    X, User, MapPin, Building2, GraduationCap, Briefcase,
    Users, Trophy, Clock, Hash, Stamp, TrendingUp,
} from "lucide-react";
import { getPartyColor } from "@/lib/electionUtils";
import { getCandidatePhotoUrl } from "@/lib/candidateUtils";

interface Props {
    candidate: Candidate | null;
    onClose: () => void;
}

const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number | null }) => {
    if (!value || value === "0" || value === "-") return null;
    return (
        <div className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
            <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wide font-medium">{label}</p>
                <p className="text-sm text-foreground mt-0.5 break-words">{String(value)}</p>
            </div>
        </div>
    );
};

const CandidateDetailModal = ({ candidate, onClose }: Props) => {
    const [imgError, setImgError] = useState(false);
    const { data } = useElectionData();

    const marginInfo = useMemo(() => {
        if (!candidate || !data) return null;

        // Find all candidates in this constituency
        const inConst = data
            .filter((c) => c.SCConstID === candidate.SCConstID)
            .sort((a, b) => (b.TotalVoteReceived || 0) - (a.TotalVoteReceived || 0));

        const rank = inConst.findIndex((c) => c.CandidateID === candidate.CandidateID) + 1;
        const votes = candidate.TotalVoteReceived || 0;

        let marginText = "";

        if (rank === 1 && inConst.length > 1) {
            const secondPlace = inConst[1];
            const margin = votes - (secondPlace.TotalVoteReceived || 0);
            if (votes > 0) {
                marginText = `Leading by ${margin.toLocaleString()} votes over ${secondPlace.CandidateName}`;
            }
        } else if (rank > 1 && inConst.length > 0) {
            const leader = inConst[0];
            const gap = (leader.TotalVoteReceived || 0) - votes;
            if (leader.TotalVoteReceived > 0) {
                marginText = `Trailing by ${gap.toLocaleString()} votes behind ${leader.CandidateName}`;
            }
        }

        return { rank, marginText, totalInConst: inConst.length };
    }, [candidate, data]);

    // Party Name Mapping (Common top parties)
    const partyNameMap: Record<string, string> = {
        "नेपाली काँग्रेस": "Nepali Congress",
        "नेकपा (एमाले)": "CPN (UML)",
        "नेकपा (माओवादी केन्द्र)": "CPN (Maoist Centre)",
        "राष्ट्रिय स्वतन्त्र पार्टी": "Rastriya Swatantra Party (RSP)",
        "जनता समाजवादी पार्टी, नेपाल": "People's Socialist Party (PSP)",
        "राष्ट्रिय प्रजातन्त्र पार्टी": "Rastriya Prajatantra Party (RPP)",
        "नेकपा (एकीकृत समाजवादी)": "CPN (Unified Socialist)",
        "लोकतान्त्रिक समाजवादी पार्टी, नेपाल": "Lokatantrik Samajwadi Party",
        "नागरिक उन्मुक्ति पार्टी": "Nagarik Unmukti Party",
        "नेपाल मजदुर किसान पार्टी": "Nepal Workers Peasants Party",
        "स्वतन्त्र": "Independent"
    };

    const getPartyName = (name: string) => {
        if (!name) return "";
        if (partyNameMap[name]) return partyNameMap[name];

        // Keyword-based matching for better reliability
        if (name.includes("काँग्रेस") || name.includes("Congress")) return "Nepali Congress";
        if (name.includes("एमाले") || name.includes("UML")) return "CPN (UML)";
        if (name.includes("माओवादी") || name.includes("Maoist")) return "CPN (Maoist Centre)";
        if (name.includes("स्वतन्त्र") || name.includes("Independent")) return "Independent";
        if (name.includes("राष्ट्रिय स्वतन्त्र") || name.includes("RSP")) return "Rastriya Swatantra Party";
        if (name.includes("समाजवादी") || name.includes("Socialist")) {
            if (name.includes("एकिकृत")) return "CPN (Unified Socialist)";
            if (name.includes("जनता")) return "People's Socialist Party";
            return "Socialist Party";
        }
        if (name.includes("प्रजातन्त्र") || name.includes("RPP")) return "Rastriya Prajatantra Party";

        return name;
    };

    const getGenderName = (gender: string) => {
        if (gender === "पुरुष") return "Male";
        if (gender === "महिला") return "Female";
        return gender;
    };

    if (!candidate) return null;

    const votes = candidate.TotalVoteReceived || 0;
    const color = getPartyColor(candidate.PoliticalPartyName, 0);
    const photoUrl = getCandidatePhotoUrl(candidate.CandidateID);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Drawer / Modal */}
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                {/* Header bar */}
                <div
                    className="px-5 py-4 flex items-center gap-3"
                    style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)`, borderBottom: `2px solid ${color}40` }}
                >
                    {/* Candidate photo or letter fallback */}
                    {!imgError ? (
                        <img
                            src={photoUrl}
                            alt={candidate.CandidateName}
                            onError={() => setImgError(true)}
                            className="w-14 h-14 rounded-full object-cover shadow-md border-2 flex-shrink-0"
                            style={{ borderColor: `${color}50` }}
                        />
                    ) : (
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md flex-shrink-0"
                            style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                        >
                            {candidate.CandidateName.charAt(0)}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h2 className="text-base font-heading font-bold text-foreground truncate leading-tight">
                            {candidate.CandidateName}
                        </h2>
                        {marginInfo && marginInfo.marginText && (
                            <p className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                <TrendingUp className="w-3 h-3" />
                                {marginInfo.marginText}
                            </p>
                        )}
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                            {getPartyName(candidate.PoliticalPartyName)}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors flex-shrink-0"
                    >
                        <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Vote result banner */}
                <div className={`px-5 py-3 flex items-center justify-between text-sm ${votes > 0
                    ? "bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200/50"
                    : "bg-amber-50 dark:bg-amber-950/30 border-b border-amber-200/50"
                    }`}>
                    <div className="flex items-center gap-2">
                        {votes > 0 ? (
                            <Trophy className="w-4 h-4 text-emerald-600" />
                        ) : (
                            <Clock className="w-4 h-4 text-amber-500" />
                        )}
                        <span className="font-medium text-foreground">
                            {votes > 0 ? `${votes.toLocaleString()} votes` : "Counting pending"}
                        </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                        Constituency {candidate.SCConstID}
                    </span>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-5 py-2">

                    {/* Quick chips */}
                    <div className="flex flex-wrap gap-2 py-3">
                        {candidate.AGE_YR > 0 && (
                            <span className="px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium">
                                Age: {candidate.AGE_YR} yrs
                            </span>
                        )}
                        <span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 text-xs font-medium">
                            {getGenderName(candidate.Gender)}
                        </span>
                        {candidate.SymbolName && (
                            <span className="px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-xs font-medium flex items-center gap-1">
                                <Stamp className="w-3 h-3" /> {candidate.SymbolName}
                            </span>
                        )}
                    </div>

                    {/* Details list */}
                    <div className="mt-1">
                        <InfoRow
                            icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Address"
                            value={candidate.ADDRESS}
                        />
                        <InfoRow
                            icon={<Building2 className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Political Party"
                            value={getPartyName(candidate.PoliticalPartyName)}
                        />
                        <InfoRow
                            icon={<Hash className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Constituency"
                            value={`${candidate.DistrictName} · Area ${candidate.SCConstID}`}
                        />
                        <InfoRow
                            icon={<GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Qualification"
                            value={candidate.QUALIFICATION}
                        />
                        <InfoRow
                            icon={<GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Institution"
                            value={candidate.NAMEOFINST}
                        />
                        <InfoRow
                            icon={<Briefcase className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Experience"
                            value={candidate.EXPERIENCE}
                        />
                        <InfoRow
                            icon={<Users className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Father's Name"
                            value={candidate.FATHER_NAME}
                        />
                        <InfoRow
                            icon={<Users className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Spouse Name"
                            value={candidate.SPOUCE_NAME}
                        />
                        <InfoRow
                            icon={<User className="w-3.5 h-3.5 text-muted-foreground" />}
                            label="Other Details"
                            value={candidate.OTHERDETAILS}
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-border/50 bg-muted/30 text-center">
                    <p className="text-[11px] text-muted-foreground">
                        Source: Election Commission Nepal
                    </p>
                </div>
            </div>
        </>
    );
};

export default CandidateDetailModal;
