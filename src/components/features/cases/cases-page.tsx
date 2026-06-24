import { useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetAllCases } from "@/services/case/get-all.service";
import { ECaseStatus } from "@/types/case.type";
import { EUserRole } from "@/types/user.type";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, ChevronLeft, ChevronRight, Briefcase, Sparkles, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { NotFoundCard } from "@/components/shared/not-found-card";
import { CaseCard } from "./components/case-card";
import { CreateCaseDialog } from "./components/create-case-dialog";

export function CasesPage() {
  const { data: meData } = useGetMe();
  const user = meData?.data;

  const isParent = user?.role === EUserRole.PARENT;

  // Search/Filters states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ECaseStatus | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const limit = 6;

  const debouncedSearch = useDebounce(search, 500);

  const filterParams = {
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  };

  const { data: casesData, isLoading, refetch } = useGetAllCases(filterParams, {
    enabled: !!user,
  });

  // Modal State for parent
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!user) return null;

  const pagedData = casesData?.data;
  const cases = pagedData?.data || [];
  const totalPages = pagedData?.totalPages || 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Tuition Cases Workspace
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            {isParent
              ? "Manage, create, and invite tutors to handle your private tuition needs."
              : "List of private tuition case offers where you have been invited by parents."}
          </p>
        </div>

        {/* Action Button for Parent */}
        {isParent && (
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Case
          </Button>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-900/60 p-4 border border-neutral-855 rounded-2xl">
        <div className="relative w-full sm:flex-1">
          <Input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search case titles..."
            className="pl-10 h-10 rounded-xl"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1 bg-neutral-950 p-1.5 rounded-xl border border-neutral-800 w-full sm:w-auto shrink-0">
          {(["ALL", ECaseStatus.OPEN, ECaseStatus.MATCHED, ECaseStatus.CLOSED] as const).map((status) => (
            <Button
              key={status}
              variant="ghost"
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`flex-1 sm:flex-none h-8 px-3 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-neutral-850 hover:text-white ${
                statusFilter === status
                  ? "bg-neutral-800 text-white"
                  : "text-muted-foreground"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Listing Area */}
      {isLoading ? (
        <LoadingScreen message="Loading cases..." />
      ) : cases.length === 0 ? (
        <NotFoundCard
          title="No Cases Found"
          description={
            isParent
              ? "You have not created any cases yet or no cases match your filters."
              : "You do not have any active private tuition case invitations yet."
          }
          icon={Briefcase}
        />
      ) : (
        <div className="space-y-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((tcase) => (
              <CaseCard key={tcase.id} tcase={tcase} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-900">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-850 border-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs font-semibold text-neutral-400">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-855 border-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Creation Modal for Parents */}
      <CreateCaseDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={refetch}
      />
    </div>
  );
}
