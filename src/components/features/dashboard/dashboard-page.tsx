import { useGetMe } from "@/services/auth/get-me.service";
import { useGetMyTutorProfile } from "@/services/tutor/get-me.service";
import { EUserRole } from "@/types/user.type";
import { AlertCircle, User, Briefcase, Search, Sparkles, BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardCard } from "./components/dashboard-card";
import Link from "next/link";

export function DashboardPage() {
  const { data: meData } = useGetMe();
  const user = meData?.data;

  const isTutor = user?.role === EUserRole.TUTOR;

  const { data: profileData, isLoading: isProfileLoading } = useGetMyTutorProfile({
    enabled: isTutor,
    retry: false,
  });

  if (!user) return null;

  const profile = profileData?.data;
  const hasProfile = !!profile;

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <div className="relative p-8 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-neutral-900 to-neutral-900 border border-neutral-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            Workspace Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Welcome Back, {user.name}!
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            Your integrated tuition marketplace app. Manage tutor search, track tuition cases, and upload credentials securely.
          </p>
        </div>
      </div>

      {/* Profile Warning Banner for Tutors */}
      {isTutor && !isProfileLoading && !hasProfile && (
        <Card className="border-rose-500/20 bg-rose-500/10 text-rose-300 rounded-2xl">
          <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 shrink-0">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Tutor Profile Incomplete!</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Please complete your tutor profile details first so parents can invite you to their tuition cases.
                </p>
              </div>
            </div>
            <Button asChild variant="destructive" className="rounded-xl text-xs font-bold shrink-0">
              <Link href="/profile">
                Complete Profile Now
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Action Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          Quick Access
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Case card (Shared) */}
          <DashboardCard
            title="Tuition Cases"
            description={
              isTutor
                ? "List of tuition cases inviting you to teach."
                : "Manage tuition cases actively matching for your child."
            }
            icon={Briefcase}
            href="/cases"
            buttonText="Open Cases Workspace"
          />

          {/* Directory card (Parent only) */}
          {!isTutor && (
            <DashboardCard
              title="Search Tutors"
              description="Browse portfolios, qualifications, and credentials of our top private tutors."
              icon={Search}
              href="/tutors"
              buttonText="Search & Invite Tutors"
            />
          )}

          {/* Profile card (Tutor only) */}
          {isTutor && (
            <DashboardCard
              title="My Profile"
              description="Update your public profile, academic qualifications, teaching experience, and certificates."
              icon={User}
              href="/profile"
              buttonText="Manage Tutor Profile"
            />
          )}

          {/* Guidelines info card */}
          <DashboardCard
            title="User Guidelines"
            description="Learn tuition marketplace rules, document sharing privacy, and matching tips."
            icon={BookOpen}
            buttonText="Coming Soon"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
