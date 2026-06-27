import { ForbiddenCard } from "@/components/shared/forbidden-card";
import { LoadingScreen } from "@/components/shared/loading-screen";
import { NotFoundCard } from "@/components/shared/not-found-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetAllTutors } from "@/services/tutor/get-all.service";
import { EUserRole } from "@/types/user.type";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { TutorCard } from "./components/tutor-card";

export function TutorsPage() {
  const { data: meData } = useGetMe();
  const user = meData?.data;

  // Authorization: Only Parents (and Admins) can search tutor directory
  const isParent = user?.role === EUserRole.PARENT;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const debouncedSearch = useDebounce(search, 500);

  const { data: tutorsData, isLoading } = useGetAllTutors(
    {
      page,
      limit,
      search: debouncedSearch,
    },
    {
      enabled: !!isParent,
    },
  );

  if (!isParent) {
    return (
      <ForbiddenCard message="Only users with the Parent role are authorized to browse the tutor directory." />
    );
  }

  const pagedData = tutorsData?.data;
  const tutors = pagedData?.data || [];
  const totalPages = pagedData?.totalPages || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1); // Reset page to 1 on search change
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-400" />
            Tutor Directory
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Find and discover the best qualified tutors to guide your
            child&apos;s learning process.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, qualification, or experience..."
            className="pl-10 h-10 rounded-xl text-xs"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <LoadingScreen message="Loading tutor directory..." />
      ) : tutors.length === 0 ? (
        <NotFoundCard
          title="No Tutors Found"
          description="Try a different search keyword or check your network connection."
          icon={User}
        />
      ) : (
        <div className="space-y-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((profile) => (
              <TutorCard key={profile.id} profile={profile} />
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
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border-neutral-800"
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
                className="w-9 h-9 rounded-xl bg-neutral-900 hover:bg-neutral-800 border-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
