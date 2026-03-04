import { Download } from "lucide-react";
import type { Candidate } from "@/types/election";

interface Props {
    data: Candidate[];
    filename?: string;
}

const CSVExportButton = ({ data, filename = "nepal-election-results-2082.csv" }: Props) => {
    const exportToCSV = () => {
        if (data.length === 0) return;

        // Headers
        const headers = [
            "CandidateID",
            "CandidateName",
            "Age",
            "Gender",
            "Party",
            "Symbol",
            "District",
            "State",
            "ConstituencyID",
            "Votes",
            "Qualification",
            "Experience",
            "Address",
        ];

        // Rows
        const rows = data.map((c) => [
            c.CandidateID,
            `"${c.CandidateName.replace(/"/g, '""')}"`,
            c.AGE_YR,
            c.Gender,
            `"${c.PoliticalPartyName.replace(/"/g, '""')}"`,
            `"${c.SymbolName?.replace(/"/g, '""') || ""}"`,
            `"${c.DistrictName.replace(/"/g, '""')}"`,
            `"${c.StateName.replace(/"/g, '""')}"`,
            c.SCConstID,
            c.TotalVoteReceived || 0,
            `"${c.QUALIFICATION?.replace(/"/g, '""') || ""}"`,
            `"${c.EXPERIENCE?.replace(/"/g, '""') || ""}"`,
            `"${c.ADDRESS?.replace(/"/g, '""') || ""}"`,
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((r) => r.join(",")),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex items-center gap-3 bg-card rounded-xl px-4 py-3 shadow-sm border border-border">
            <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                disabled={data.length === 0}
            >
                <Download className="w-4 h-4" />
                Export CSV / डाटा डाउनलोड
            </button>
        </div>
    );
};

export default CSVExportButton;
