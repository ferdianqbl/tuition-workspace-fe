import { useEffect, useState } from "react";
import { useUpsertTutorProfile } from "@/services/tutor/upsert.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ProfileFormProps {
  initialData?: {
    displayName?: string;
    qualifications?: string[];
    experiences?: string[];
  };
  onSuccess?: () => void;
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const [displayName, setDisplayName] = useState("");
  const [qualificationsInput, setQualificationsInput] = useState("");
  const [experiencesInput, setExperiencesInput] = useState("");

  const upsertMutation = useUpsertTutorProfile({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Profile saved successfully!");
        if (onSuccess) onSuccess();
      } else {
        toast.error(data.message || "Failed to save profile");
      }
    },
  });

  useEffect(() => {
    if (initialData) {
      setDisplayName(initialData.displayName || "");
      setQualificationsInput(initialData.qualifications?.join(", ") || "");
      setExperiencesInput(initialData.experiences?.join("\n") || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName) {
      toast.warning("Display Name is required");
      return;
    }

    const qualifications = qualificationsInput
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);

    const experiences = experiencesInput
      .split("\n")
      .map((e) => e.trim())
      .filter(Boolean);

    upsertMutation.mutate({
      displayName,
      qualifications,
      experiences,
    });
  };

  const isSaving = upsertMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Display Name
        </label>
        <Input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="e.g. Teacher John, B.Sc"
          required
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Academic Qualifications (Separate with commas)
        </label>
        <Input
          type="text"
          value={qualificationsInput}
          onChange={(e) => setQualificationsInput(e.target.value)}
          placeholder="e.g. Bachelor of Science NUS, Certified IB Tutor"
        />
        <span className="text-[10px] text-muted-foreground block">
          Example: B.Sc Chemistry NUS, Cambridge A-Level Teaching Certificate
        </span>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
          Teaching Experience (One per line)
        </label>
        <Textarea
          value={experiencesInput}
          onChange={(e) => setExperiencesInput(e.target.value)}
          placeholder="e.g. 3 years teaching high school Mathematics&#10;Private tutoring for Cambridge IGCSE curriculum"
          rows={5}
        />
        <span className="text-[10px] text-muted-foreground block">
          Enter your teaching experience. Press Enter to separate rows of experiences.
        </span>
      </div>

      <div className="pt-2 border-t border-neutral-800 flex justify-end">
        <Button type="submit" disabled={isSaving} className="rounded-xl text-xs font-bold px-6">
          {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}
