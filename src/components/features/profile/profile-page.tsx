import { useGetMe } from "@/services/auth/get-me.service";
import { useGetMyTutorProfile } from "@/services/tutor/get-me.service";
import { EUserRole } from "@/types/user.type";
import { Sparkles } from "lucide-react";
import { ForbiddenCard } from "@/components/shared/forbidden-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { ProfileForm } from "./components/profile-form";
import { DocumentList } from "./components/document-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ProfilePage() {
  const { data: meData } = useGetMe();
  const user = meData?.data;

  // Authorization: Only allow TUTOR role
  const isTutor = user?.role === EUserRole.TUTOR;

  const { data: profileData, isLoading: isProfileLoading, refetch } = useGetMyTutorProfile({
    enabled: !!isTutor,
  });

  if (!isTutor) {
    return (
      <ForbiddenCard message="Only users with the Tutor role are authorized to manage tutor profiles." />
    );
  }

  if (isProfileLoading) {
    return <LoadingScreen message="Loading profile..." />;
  }

  const profile = profileData?.data || null;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          Manage Tutor Profile
        </h1>
        <p className="text-xs text-neutral-400 mt-1.5">
          Set up your academic qualifications, teaching experience history, and upload supporting credential documents.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form (Left Column) */}
        <div className="lg:col-span-2">
          <Card className="border-border/40 bg-card/65 rounded-3xl p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-white border-b border-neutral-800 pb-3">
                Tutor Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ProfileForm
                initialData={
                  profile
                    ? {
                        displayName: profile.displayName,
                        qualifications: profile.qualifications,
                        experiences: profile.experiences,
                      }
                    : undefined
                }
                onSuccess={refetch}
              />
            </CardContent>
          </Card>
        </div>

        {/* Supporting Documents (Right Column) */}
        <div>
          <Card className="border-border/40 bg-card/65 rounded-3xl p-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-bold text-white mb-1">
                Supporting Documents
              </CardTitle>
              <CardDescription className="text-[10px]">
                Upload your degrees, educator credentials, or MOE teaching letters.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentList profile={profile} onRefresh={refetch} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
