import { useState, useEffect } from "react";
import { useUpdateCase } from "@/services/case/update.service";
import { ECaseStatus } from "@/types/case.type";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditCaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  tcase: {
    id: string;
    title: string;
    subject: string;
    level: string;
    location: string;
    budgetPerHour: number;
    status: ECaseStatus;
  };
}

export function EditCaseDialog({ isOpen, onOpenChange, onSuccess, tcase }: EditCaseDialogProps) {
  const [title, setTitle] = useState(tcase.title);
  const [subject, setSubject] = useState(tcase.subject);
  const [level, setLevel] = useState(tcase.level);
  const [location, setLocation] = useState(tcase.location);
  const [budgetPerHour, setBudgetPerHour] = useState<number>(tcase.budgetPerHour);
  const [status, setStatus] = useState<ECaseStatus>(tcase.status);

  // Sync state if tcase changes
  useEffect(() => {
    setTitle(tcase.title);
    setSubject(tcase.subject);
    setLevel(tcase.level);
    setLocation(tcase.location);
    setBudgetPerHour(tcase.budgetPerHour);
    setStatus(tcase.status);
  }, [tcase]);

  const updateCaseMutation = useUpdateCase({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Tuition case successfully updated!");
        onOpenChange(false);
        onSuccess();
      } else {
        toast.error(data.message || "Failed to update case");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subject || !level || !location || budgetPerHour <= 0) {
      toast.warning("All fields must be filled in correctly");
      return;
    }

    updateCaseMutation.mutate({
      id: tcase.id,
      payload: {
        title,
        subject,
        level,
        location,
        budgetPerHour,
        status,
      },
    });
  };

  const isPending = updateCaseMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-900 border-neutral-800 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Edit Tuition Case Details</DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Modify the fields below to update your private tuition offer.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Case Title (e.g. Mathematics Grade 12 IB)
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly P5 Mathematics tuition in Orchard"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Subject
              </label>
              <Input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Mathematics, Physics"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Education Level
              </label>
              <Input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Primary, Secondary, JC"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Tuition Location
              </label>
              <Input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Orchard Road (or Online)"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
                Status
              </label>
              <Select value={status} onValueChange={(val) => setStatus(val as ECaseStatus)}>
                <SelectTrigger className="w-full bg-neutral-950/60 border border-neutral-800 rounded-xl px-3 text-xs text-white font-semibold uppercase tracking-wider h-10">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border border-neutral-800 text-white rounded-xl">
                  <SelectItem value={ECaseStatus.OPEN}>OPEN</SelectItem>
                  <SelectItem value={ECaseStatus.MATCHED}>MATCHED</SelectItem>
                  <SelectItem value={ECaseStatus.CLOSED}>CLOSED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider block">
              Budget per Hour
            </label>
            <div className="relative">
              <Input
                type="number"
                value={budgetPerHour || ""}
                onChange={(e) => setBudgetPerHour(Number(e.target.value))}
                placeholder="e.g. 80"
                className="pl-10"
                required
              />
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-neutral-500">
                $ / Rp
              </span>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-neutral-800 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl text-xs font-bold bg-neutral-950 hover:bg-neutral-900 border-neutral-850"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-xl text-xs font-bold px-6 shadow-lg shadow-indigo-500/20"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
