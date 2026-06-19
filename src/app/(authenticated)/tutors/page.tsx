"use client";

import { useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetAllTutors } from "@/services/tutor/get-all.service";
import { useDebounce } from "@/hooks/use-debounce";
import { EUserRole } from "@/types/user.type";
import Link from "next/link";
import { Search, Loader2, User, ChevronLeft, ChevronRight, Sparkles, BookOpen, GraduationCap, AlertCircle } from "lucide-react";

export default function TutorsPage() {
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
    }
  );

  if (!isParent) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/50 border border-neutral-800 rounded-3xl min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
          <AlertCircle className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Akses Ditolak (403 Forbidden)</h3>
        <p className="text-neutral-400 text-xs max-w-sm">
          Hanya pengguna dengan peran Parent yang diizinkan untuk menjelajah direktori tutor.
        </p>
      </div>
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
            Direktori Tutor
          </h1>
          <p className="text-xs text-neutral-400 mt-1.5">
            Cari dan temukan tutor berkualitas terbaik untuk membimbing proses belajar anak Anda.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Cari nama tutor..."
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm font-medium">Memuat daftar tutor...</p>
        </div>
      ) : tutors.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-neutral-900/40 border border-neutral-850 rounded-3xl">
          <User className="w-10 h-10 text-neutral-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Tutor Tidak Ditemukan</h3>
          <p className="text-xs text-neutral-500 max-w-xs">
            Coba kata kunci pencarian lain atau periksa koneksi Anda.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((profile) => (
              <div
                key={profile.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 hover:translate-y-[-2px] transition-all"
              >
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
                      <p className="text-[10px] text-neutral-500 mt-0.5">
                        Tutor Terdaftar
                      </p>
                    </div>
                  </div>

                  {/* Qualifications */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" />
                      Kualifikasi
                    </span>
                    <p className="text-xs text-neutral-300 line-clamp-2">
                      {profile.qualifications && profile.qualifications.length > 0
                        ? profile.qualifications.join(", ")
                        : "Tidak dicantumkan"}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Pengalaman
                    </span>
                    <p className="text-xs text-neutral-300 line-clamp-2">
                      {profile.experiences && profile.experiences.length > 0
                        ? profile.experiences.join(", ")
                        : "Tidak dicantumkan"}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/tutors/${profile.id}`}
                  className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-750 text-xs font-bold text-white transition-all"
                >
                  Lihat Profil Lengkap
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-neutral-900">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-neutral-400">
                Halaman {page} dari {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
