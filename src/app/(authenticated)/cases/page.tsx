"use client";

import { useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetAllCases } from "@/services/case/get-all.service";
import { useCreateCase } from "@/services/case/create.service";
import { ECaseStatus } from "@/types/case.type";
import { EUserRole } from "@/types/user.type";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { Loader2, Plus, Search, ChevronLeft, ChevronRight, Briefcase, Sparkles, MapPin, DollarSign, Calendar, BookOpen } from "lucide-react";

export default function CasesPage() {
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
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [budgetPerHour, setBudgetPerHour] = useState<number>(0);
  const [modalError, setModalError] = useState("");

  const createCaseMutation = useCreateCase({
    onSuccess: (data) => {
      if (data.success) {
        setIsModalOpen(false);
        // Clear fields
        setTitle("");
        setSubject("");
        setLevel("");
        setLocation("");
        setBudgetPerHour(0);
        setModalError("");
        refetch();
      } else {
        setModalError(data.message || "Gagal membuat kasus baru");
      }
    },
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError("");

    if (!title || !subject || !level || !location || budgetPerHour <= 0) {
      setModalError("Semua kolom harus diisi dengan benar");
      return;
    }

    createCaseMutation.mutate({
      title,
      subject,
      level,
      location,
      budgetPerHour,
    });
  };

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
              ? "Kelola, buat, dan undang tutor untuk menangani kebutuhan les privat Anda."
              : "Daftar penawaran kasus les privat di mana Anda diundang oleh orang tua."}
          </p>
        </div>

        {/* Action Button for Parent */}
        {isParent && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Buat Kasus Les Baru
          </button>
        )}
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-neutral-900/60 p-4 border border-neutral-800 rounded-2xl">
        <div className="relative w-full sm:flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Cari judul kasus..."
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-neutral-500" />
        </div>

        {/* Status Filter */}
        <div className="flex gap-1.5 bg-neutral-950 p-1 rounded-xl border border-neutral-800 w-full sm:w-auto shrink-0">
          {(["ALL", ECaseStatus.OPEN, ECaseStatus.MATCHED, ECaseStatus.CLOSED] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                statusFilter === status
                  ? "bg-neutral-800 text-white"
                  : "text-neutral-500 hover:text-neutral-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Listing Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm font-medium">Memuat daftar kasus...</p>
        </div>
      ) : cases.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 text-center bg-neutral-900/40 border border-neutral-850 rounded-3xl">
          <Briefcase className="w-10 h-10 text-neutral-600 mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Kasus Tidak Ditemukan</h3>
          <p className="text-xs text-neutral-500 max-w-xs">
            {isParent
              ? "Anda belum membuat kasus apa pun atau tidak ada kecocokan filter."
              : "Anda belum memiliki undangan kasus les privat yang aktif."}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((tcase) => (
              <div
                key={tcase.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-neutral-900 border border-neutral-800/80 hover:border-neutral-700 hover:translate-y-[-2px] transition-all"
              >
                <div className="space-y-4">
                  {/* Header Status & Title */}
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        tcase.status === ECaseStatus.OPEN
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : tcase.status === ECaseStatus.MATCHED
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : "bg-neutral-850 text-neutral-500 border border-neutral-800"
                      }`}
                    >
                      {tcase.status}
                    </span>
                    <span className="text-[10px] text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(tcase.createdAt).toLocaleDateString("id-ID")}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">
                      {tcase.title}
                    </h3>
                  </div>

                  {/* Level & Subject */}
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>
                      {tcase.level} • {tcase.subject}
                    </span>
                  </div>

                  {/* Location info */}
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span className="truncate">{tcase.location}</span>
                  </div>

                  {/* Budget info */}
                  <div className="flex items-center gap-3 text-xs text-neutral-300">
                    <DollarSign className="w-4 h-4 text-indigo-400" />
                    <span>Rp {tcase.budgetPerHour.toLocaleString("id-ID")} / jam</span>
                  </div>
                </div>

                <Link
                  href={`/cases/${tcase.id}`}
                  className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-850 hover:border-neutral-755 text-xs font-bold text-white transition-all"
                >
                  Buka Detail Kasus
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

      {/* Creation Modal for Parents */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 shadow-2xl relative">
            <h2 className="text-lg font-bold text-white mb-2">Buat Kasus Les Baru</h2>
            <p className="text-xs text-neutral-400 mb-6">
              Lengkapi formulir di bawah ini untuk memposting tawaran privat Anda.
            </p>

            {modalError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Judul Kasus (e.g. Matematika SMA Kelas 12)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Les Privat Mingguan P5 Math di Menteng"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Mata Pelajaran
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Matematika, Fisika"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                    Tingkat Sekolah
                  </label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="e.g. SD, SMP, SMA"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Lokasi Les
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Menteng, Jakarta Pusat (atau Online)"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Tarif per Jam (Budget per Hour)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={budgetPerHour || ""}
                    onChange={(e) => setBudgetPerHour(Number(e.target.value))}
                    placeholder="e.g. 150000"
                    className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                    required
                  />
                  <span className="absolute left-3.5 top-3.5 text-xs font-semibold text-neutral-500">
                    Rp
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setModalError("");
                  }}
                  className="py-2 px-4 rounded-xl border border-neutral-850 bg-neutral-950 text-xs font-bold text-neutral-400 hover:text-white transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createCaseMutation.isPending}
                  className="py-2 px-6 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {createCaseMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Posting Kasus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
