import { use, useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetTutorById } from "@/services/tutor/get-by-id.service";
import { EUserRole } from "@/types/user.type";
import Link from "next/link";
import { ArrowLeft, FileText, Sparkles, GraduationCap, BookOpen, AlertCircle, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ForbiddenCard } from "@/components/shared/forbidden-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { DownloadTutorDocumentService, triggerTutorFileDownload } from "@/services/tutor/download-doc.service";
import { toast } from "sonner";

interface TutorDetailPageProps {
  params: Promise<{ id: string }>;
}

export function TutorDetailPage({ params }: TutorDetailPageProps) {
  const { id } = use(params);
  const { data: meData } = useGetMe();
  const user = meData?.data;
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  const handleFileDownload = async (docId: string, filename: string) => {
    try {
      setDownloadingDocId(docId);
      const blob = await DownloadTutorDocumentService(docId);
      triggerTutorFileDownload(blob, filename);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download document");
    } finally {
      setDownloadingDocId(null);
    }
  };

  // Authorization: Parents and Admins only (tutors cannot view other tutors)
  const isAuthorized = user?.role === EUserRole.PARENT || user?.role === EUserRole.ADMIN;

  const { data: profileData, isLoading, isError } = useGetTutorById(id, {
    enabled: !!isAuthorized && !!id,
  });

  if (!isAuthorized) {
    return (
      <ForbiddenCard message="Tutors are not allowed to view other tutors' profiles." />
    );
  }

  if (isLoading) {
    return <LoadingScreen message="Loading tutor profile details..." />;
  }

  const profile = profileData?.data;

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 border border-neutral-855 rounded-3xl">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Tutor Not Found</h3>
        <p className="text-xs text-neutral-500 max-w-xs mb-6">
          The tutor profile you are looking for was not found or has been deactivated.
        </p>
        <Button asChild variant="outline" className="rounded-xl text-xs font-semibold">
          <Link href="/tutors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div>
        <Button asChild variant="ghost" className="text-xs font-semibold text-neutral-400 hover:text-white px-0 hover:bg-transparent">
          <Link href="/tutors" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Directory
          </Link>
        </Button>
      </div>

      {/* Main card */}
      <Card className="border-border/40 bg-card/65 rounded-3xl p-6 md:p-8 space-y-8">
        <CardContent className="p-0 space-y-8">
          {/* Header Avatar and Basic Details */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-neutral-800 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-extrabold text-2xl uppercase shrink-0">
              {profile.displayName.charAt(0)}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase mb-1.5">
                <Sparkles className="w-3 h-3" />
                Verified Tutor
              </div>
              <h1 className="text-2xl font-bold text-white leading-tight">
                {profile.displayName}
              </h1>
            </div>
          </div>

          {/* Qualifications and Experience Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Qualifications */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 shrink-0" />
                Academic Qualifications
              </h2>
              {profile.qualifications && profile.qualifications.length > 0 ? (
                <ul className="space-y-2.5">
                  {profile.qualifications.map((qual, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-850 text-xs text-neutral-300"
                    >
                      {qual}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500 italic">No qualifications specified.</p>
              )}
            </div>

            {/* Experiences */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <BookOpen className="w-4 h-4 shrink-0" />
                Teaching Experience
              </h2>
              {profile.experiences && profile.experiences.length > 0 ? (
                <ul className="space-y-2.5">
                  {profile.experiences.map((exp, idx) => (
                    <li
                      key={idx}
                      className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-850 text-xs text-neutral-300"
                    >
                      {exp}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-neutral-500 italic">No experience specified.</p>
              )}
            </div>
          </div>

          {/* Credentials and Verification Documents */}
          <div className="space-y-4 pt-4 border-t border-neutral-800">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
                Supporting Verification Documents
              </h2>
              <p className="text-[10px] text-neutral-500 mt-0.5">
                Academic and identity verification files officially uploaded by this tutor.
              </p>
            </div>

            {!profile.documents || profile.documents.length === 0 ? (
              <p className="text-xs text-neutral-500 italic bg-neutral-950/40 p-4 border border-neutral-850 rounded-2xl">
                This tutor has not uploaded any supporting documents yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.documents.map((doc) => (
                   <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/60 border border-neutral-850 text-xs hover:border-neutral-700 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate" title={doc.filename}>
                          {doc.filename}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {(doc.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleFileDownload(doc.id, doc.filename)}
                      disabled={downloadingDocId === doc.id}
                      className="w-8 h-8 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all shrink-0"
                      title="Download"
                    >
                      {downloadingDocId === doc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
