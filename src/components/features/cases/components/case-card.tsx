import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ECaseStatus } from "@/types/case.type";
import { BookOpen, Calendar, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

interface CaseCardProps {
  tcase: {
    id: string;
    title: string;
    subject: string;
    level: string;
    location: string;
    budgetPerHour: number;
    status: ECaseStatus;
    createdAt: string;
  };
}

export function CaseCard({ tcase }: CaseCardProps) {
  return (
    <Card className="flex flex-col justify-between p-6 border-border/40 bg-card/65 hover:border-neutral-700 hover:translate-y-[-2px] transition-all rounded-2xl">
      <div className="space-y-4">
        {/* Header Status & Title */}
        <div className="flex items-start justify-between gap-3">
          <span
            className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
              tcase.status === ECaseStatus.OPEN
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : tcase.status === ECaseStatus.MATCHED
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "bg-neutral-850 text-neutral-500 border border-neutral-800"
            }`}
          >
            {tcase.status}
          </span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(tcase.createdAt).toLocaleDateString("en-SG")}
          </span>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
            {tcase.title}
          </h3>
        </div>

        {/* Level & Subject */}
        <div className="flex items-center gap-3 text-xs text-neutral-300">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>
            {tcase.level} • {tcase.subject}
          </span>
        </div>

        {/* Location info */}
        <div className="flex items-center gap-3 text-xs text-neutral-300">
          <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="truncate">{tcase.location}</span>
        </div>

        {/* Budget info */}
        <div className="flex items-center gap-3 text-xs text-neutral-300">
          <DollarSign className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Rp {tcase.budgetPerHour.toLocaleString("id-ID")} / hour</span>
        </div>
      </div>

      <Button
        asChild
        variant="outline"
        className="mt-6 w-full rounded-xl text-xs font-bold bg-neutral-950 hover:bg-neutral-900 border-neutral-850"
      >
        <Link href={`/cases/${tcase.id}`}>Open Case Details</Link>
      </Button>
    </Card>
  );
}
