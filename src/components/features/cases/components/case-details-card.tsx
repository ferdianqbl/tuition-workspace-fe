import { useState } from "react";
import { useUpdateCase } from "@/services/case/update.service";
import { ECaseStatus } from "@/types/case.type";
import { BookOpen, MapPin, DollarSign, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditCaseDialog } from "./edit-case-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface CaseDetailsCardProps {
  tcase: {
    id: string;
    title: string;
    subject: string;
    level: string;
    location: string;
    budgetPerHour: number;
    status: ECaseStatus;
  };
  isOwner: boolean;
  onRefresh: () => void;
}

export function CaseDetailsCard({ tcase, isOwner, onRefresh }: CaseDetailsCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const updateCaseMutation = useUpdateCase({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Case status updated successfully!");
        onRefresh();
      } else {
        toast.error(data.message || "Failed to update case status");
      }
    },
  });

  const handleStatusChange = (status: string) => {
    updateCaseMutation.mutate({ id: tcase.id, payload: { status: status as ECaseStatus } });
  };

  return (
    <>
      <Card className="border-border/40 bg-card/65 rounded-3xl p-6 md:p-8 space-y-6">
        <CardContent className="p-0 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-800 pb-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/15">
                Tuition Case Details
              </span>
              <h1 className="text-xl font-bold text-white mt-2">{tcase.title}</h1>
            </div>

            {/* Status Indicator & Edit details */}
            <div className="flex items-center gap-3 shrink-0">
              {isOwner && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditOpen(true)}
                  className="h-9 px-3 rounded-xl border-neutral-800 bg-neutral-950/60 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-900"
                >
                  <Pencil className="w-3 h-3 mr-1.5 text-indigo-450" />
                  Edit Details
                </Button>
              )}

              {isOwner ? (
                <Select value={tcase.status} onValueChange={handleStatusChange}>
                  <SelectTrigger className="w-[120px] bg-neutral-950/60 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-white font-semibold uppercase tracking-wider h-9">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-neutral-950 border border-neutral-800 text-white rounded-xl">
                    <SelectItem value={ECaseStatus.OPEN}>OPEN</SelectItem>
                    <SelectItem value={ECaseStatus.MATCHED}>MATCHED</SelectItem>
                    <SelectItem value={ECaseStatus.CLOSED}>CLOSED</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <span
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                    tcase.status === ECaseStatus.OPEN
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : tcase.status === ECaseStatus.MATCHED
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "bg-neutral-850 text-neutral-500 border border-neutral-800"
                  }`}
                >
                  {tcase.status}
                </span>
              )}
            </div>
          </div>

          {/* Parameter Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-neutral-950/40 rounded-2xl border border-neutral-850">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Subject</span>
              <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                {tcase.subject}
              </p>
            </div>

            <div className="p-4 bg-neutral-950/40 rounded-2xl border border-neutral-850">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Education Level</span>
              <p className="text-xs text-white font-semibold mt-1">
                {tcase.level}
              </p>
            </div>

            <div className="p-4 bg-neutral-950/40 rounded-2xl border border-neutral-850">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Location</span>
              <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                {tcase.location}
              </p>
            </div>

            <div className="p-4 bg-neutral-950/40 rounded-2xl border border-neutral-850">
              <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Rate per Hour</span>
              <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                Rp {tcase.budgetPerHour.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditCaseDialog
        isOpen={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={onRefresh}
        tcase={tcase}
      />
    </>
  );
}
