import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from "lucide-react";

interface DistrictStat {
  district: string;
  totalVotes: number;
  candidates: number;
}

interface Props {
  data: DistrictStat[];
}

const DistrictTable = ({ data }: Props) => {
  const top20 = data.slice(0, 20);
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="w-5 h-5 text-secondary" />
        <h3 className="text-lg font-heading font-bold text-card-foreground">जिल्ला अनुसार विवरण</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Top 20 Districts by Votes</p>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">#</TableHead>
              <TableHead>जिल्ला</TableHead>
              <TableHead className="text-right">उम्मेदवार</TableHead>
              <TableHead className="text-right">कुल मत</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {top20.map((d, i) => (
              <TableRow key={d.district} className="card-hover">
                <TableCell className="font-bold text-muted-foreground">{i + 1}</TableCell>
                <TableCell className="font-semibold">{d.district}</TableCell>
                <TableCell className="text-right">{d.candidates}</TableCell>
                <TableCell className="text-right font-heading font-bold text-secondary">
                  {d.totalVotes.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DistrictTable;
