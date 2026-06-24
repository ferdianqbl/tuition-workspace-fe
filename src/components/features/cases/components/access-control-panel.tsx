import { useState } from "react";
import { useInviteTutor } from "@/services/case/invite-tutor.service";
import { useRevokeTutor } from "@/services/case/revoke-tutor.service";
import { useGetAllTutors } from "@/services/tutor/get-all.service";
import { useDebounce } from "@/hooks/use-debounce";
import { Shield, Plus, UserCheck, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

interface AccessControlPanelProps {
  caseId: string;
  invitedTutors: Array<{
    id: string;
    tutorId: string;
    tutor?: {
      name: string;
    };
  }>;
  onRefresh: () => void;
}

export function AccessControlPanel({ caseId, invitedTutors, onRefresh }: AccessControlPanelProps) {
  const [tutorSearch, setTutorSearch] = useState("");
  const debouncedTutorSearch = useDebounce(tutorSearch, 500);

  const { data: searchTutorsData } = useGetAllTutors(
    {
      search: debouncedTutorSearch || undefined,
      limit: 5,
    },
    {
      enabled: debouncedTutorSearch.length > 0,
    }
  );

  const inviteTutorMutation = useInviteTutor({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Tutor successfully invited!");
        setTutorSearch("");
        onRefresh();
      } else {
        toast.error(data.message || "Failed to invite tutor");
      }
    },
  });

  const revokeTutorMutation = useRevokeTutor({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Tutor access successfully revoked!");
        onRefresh();
      } else {
        toast.error(data.message || "Failed to revoke access");
      }
    },
  });

  const handleInviteTutor = (tutorId: string) => {
    inviteTutorMutation.mutate({ caseId, payload: { tutorId } });
  };

  const handleRevokeTutor = (tutorId: string) => {
    if (confirm("Are you sure you want to revoke this tutor's access from the tuition case?")) {
      revokeTutorMutation.mutate({ caseId, tutorId });
    }
  };

  const searchTutors = searchTutorsData?.data?.data || [];
  const inviteableTutors = searchTutors.filter(
    (stutor) => !invitedTutors.some((invited) => invited.tutorId === stutor.userId)
  );

  return (
    <Card className="border-border/40 bg-card/65 rounded-3xl p-6 space-y-6">
      <CardHeader className="pb-4 p-0">
        <CardTitle className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-400" />
          Access Control List
        </CardTitle>
        <CardDescription className="text-[10px]">
          Invite private tutors from the directory to grant access to this case.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0 space-y-6">
        {/* Invite Tutor input */}
        <div className="space-y-3 relative">
          <Input
            type="text"
            value={tutorSearch}
            onChange={(e) => setTutorSearch(e.target.value)}
            placeholder="Type tutor name to invite..."
            className="h-10 rounded-xl"
          />

          {/* Autocomplete List */}
          {tutorSearch.length > 0 && (
            <div className="absolute top-11 left-0 z-20 w-full bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
              {inviteableTutors.length === 0 ? (
                <p className="p-3 text-[10px] text-neutral-500 italic text-center">Tutor not found</p>
              ) : (
                inviteableTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className="flex items-center justify-between p-3 border-b border-neutral-900 last:border-0 hover:bg-neutral-900/60 transition-all text-xs"
                  >
                    <span className="text-white font-medium truncate pr-2">{tutor.displayName}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleInviteTutor(tutor.userId)}
                      className="w-7 h-7 rounded bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-all border border-indigo-500/20"
                      title="Invite"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Invited Tutors list */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <h3 className="text-xs font-bold text-neutral-400">Invited / Assigned Tutors</h3>

          {invitedTutors.length === 0 ? (
            <p className="text-xs text-neutral-500 italic bg-neutral-950/40 p-4 border border-neutral-850 rounded-2xl">
              No tutors have access yet.
            </p>
          ) : (
            <div className="space-y-2">
              {invitedTutors.map((access) => (
                <div
                  key={access.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/40 border border-neutral-850 text-xs hover:border-neutral-700 transition-all"
                >
                  <span className="text-white font-semibold flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-400" />
                    {access.tutor?.name || "Tutor"}
                  </span>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRevokeTutor(access.tutorId)}
                    disabled={revokeTutorMutation.isPending}
                    className="w-7 h-7 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    title="Revoke Access"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
