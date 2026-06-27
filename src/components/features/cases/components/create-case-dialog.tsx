import { useState } from "react";
import { useCreateCase } from "@/services/case/create.service";
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

interface CreateCaseDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateCaseDialog({ isOpen, onOpenChange, onSuccess }: CreateCaseDialogProps) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [budgetPerHour, setBudgetPerHour] = useState<number>(0);

  const createCaseMutation = useCreateCase({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("New tuition case successfully posted!");
        onOpenChange(false);
        // Clear fields
        setTitle("");
        setSubject("");
        setLevel("");
        setLocation("");
        setBudgetPerHour(0);
        onSuccess();
      } else {
        toast.error(data.message || "Failed to create new case");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !subject || !level || !location || budgetPerHour <= 0) {
      toast.warning("All fields must be filled in correctly");
      return;
    }

    createCaseMutation.mutate({
      title,
      subject,
      level,
      location,
      budgetPerHour,
    });
  };

  const isPending = createCaseMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-900 border-neutral-800 text-white rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-white">Create New Tuition Case</DialogTitle>
          <DialogDescription className="text-xs text-neutral-400">
            Complete the form below to post your private tuition offer.
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
              Budget per Hour
            </label>
            <div className="relative">
              <Input
                type="number"
                value={budgetPerHour || ""}
                onChange={(e) => setBudgetPerHour(Number(e.target.value))}
                placeholder="e.g. 80"
                className="pl-8"
                required
              />
              <span className="absolute left-3 top-2.5 text-xs font-semibold text-neutral-500">
                $
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
              Post Case
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
