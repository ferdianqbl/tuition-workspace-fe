import { LoadingScreen } from "@/components/shared/loading-screen";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetCaseById } from "@/services/case/get-by-id.service";
import { EUserRole } from "@/types/user.type";
import { AlertCircle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { AccessControlPanel } from "./components/access-control-panel";
import { CaseDetailsCard } from "./components/case-details-card";
import { DocumentWorkspace } from "./components/document-workspace";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id: caseId } = use(params);
  const { data: meData } = useGetMe();
  const user = meData?.data;

  // Primary Case Query
  const {
    data: caseData,
    isLoading: isCaseLoading,
    isError,
    refetch,
  } = useGetCaseById(caseId, {
    enabled: !!user && !!caseId,
  });

  const tcase = caseData?.data;
  const isOwner = !!(user && tcase && tcase.userId === user.id);
  const isParent = user?.role === EUserRole.PARENT;

  if (isCaseLoading) {
    return <LoadingScreen message="Loading case workspace files..." />;
  }

  if (isError || !tcase) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 border border-neutral-855 rounded-3xl">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Case Not Found</h3>
        <p className="text-xs text-neutral-500 max-w-xs mb-6">
          The tuition case you are looking for was not found or you do not have
          permission to access it (403 Forbidden).
        </p>
        <Button
          asChild
          variant="outline"
          className="rounded-xl text-xs font-semibold"
        >
          <Link href="/cases">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Workspace
          </Link>
        </Button>
      </div>
    );
  }

  const activeInvitedTutors = tcase.caseAccesses || [];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button
          asChild
          variant="ghost"
          className="text-xs font-semibold text-neutral-400 hover:text-white px-0 hover:bg-transparent"
        >
          <Link href="/cases" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Cases List
          </Link>
        </Button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <CaseDetailsCard
            tcase={tcase}
            isOwner={isOwner}
            onRefresh={refetch}
          />

          {/* Document Workspace Library */}
          <DocumentWorkspace
            caseId={caseId}
            documents={tcase.caseDocuments}
            onRefresh={refetch}
          />
        </div>

        {/* Right Column: Invite Panel (Access Control, Parents only) */}
        <div className="space-y-6">
          {/* Access Panel */}
          {isParent && isOwner && (
            <AccessControlPanel
              caseId={caseId}
              invitedTutors={activeInvitedTutors}
              onRefresh={refetch}
            />
          )}

          {/* Invited Access Notice for Tutors */}
          {!isParent && (
            <Card className="border-border/40 bg-card/65 rounded-3xl p-6 text-center">
              <CardContent className="p-0 space-y-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mx-auto text-indigo-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Your Access Status
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    You have been officially invited by the parent / owner of
                    this case. You have access to upload learning materials and
                    download all available document briefs.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
