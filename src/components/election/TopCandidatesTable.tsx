import type { Candidate } from "@/types/election";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";

interface Props {
  data: Candidate[];
}

const TopCandidatesTable = ({ data }: Props) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-1">
        <Trophy className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-heading font-bold text-card-foreground">शीर्ष उम्मेदवारहरू</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Top Candidates by Votes Received</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>उम्मेदवार</TableHead>
              <TableHead>दल</TableHead>
              <TableHead>जिल्ला</TableHead>
              <TableHead>प्रदेश</TableHead>
              <TableHead className="text-right">मत</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((c, i) => (
              <TableRow key={c.CandidateID} className="card-hover">
                <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-semibold text-card-foreground">{c.CandidateName}</TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">{c.PoliticalPartyName}</TableCell>
                <TableCell className="text-sm">{c.DistrictName}</TableCell>
                <TableCell className="text-sm">{c.StateName}</TableCell>
                <TableCell className="text-right font-heading font-bold text-primary">
                  {(c.TotalVoteReceived || 0).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TopCandidatesTable;
