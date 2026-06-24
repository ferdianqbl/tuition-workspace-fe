import Link from "next/link";
import { GraduationCap, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TutorCardProps {
  profile: {
    id: string;
    displayName: string;
    qualifications?: string[];
    experiences?: string[];
  };
}

export function TutorCard({ profile }: TutorCardProps) {
  return (
    <Card className="flex flex-col justify-between p-6 border-border/40 bg-card/65 hover:border-neutral-700 hover:translate-y-[-2px] transition-all rounded-2xl">
      <div className="space-y-4">
        {/* Title & Avatar */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm uppercase shrink-0">
            {profile.displayName.charAt(0)}
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-tight">
              {profile.displayName}
            </h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              Registered Tutor
            </p>
          </div>
        </div>

        {/* Qualifications */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            Qualifications
          </span>
          <p className="text-xs text-neutral-300 line-clamp-2">
            {profile.qualifications && profile.qualifications.length > 0
              ? profile.qualifications.join(", ")
              : "Not specified"}
          </p>
        </div>

        {/* Experience */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            Experience
          </span>
          <p className="text-xs text-neutral-300 line-clamp-2">
            {profile.experiences && profile.experiences.length > 0
              ? profile.experiences.join(", ")
              : "Not specified"}
          </p>
        </div>
      </div>

      <Button asChild variant="outline" className="mt-6 w-full rounded-xl text-xs font-bold bg-neutral-950 hover:bg-neutral-900 border-neutral-850">
        <Link href={`/tutors/${profile.id}`}>
          View Full Profile
        </Link>
      </Button>
    </Card>
  );
}
