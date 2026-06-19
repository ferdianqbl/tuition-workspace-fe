"use client";

import { use, useEffect, useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetCaseById } from "@/services/case/get-by-id.service";
import { useUpdateCase } from "@/services/case/update.service";
import { useInviteTutor } from "@/services/case/invite-tutor.service";
import { useRevokeTutor } from "@/services/case/revoke-tutor.service";
import { useUploadCaseDocument } from "@/services/case/upload-doc.service";
import { useGetAllTutors } from "@/services/tutor/get-all.service";
import { DownloadCaseDocumentService, triggerFileDownload } from "@/services/case/download-doc.service";
import { ECaseStatus } from "@/types/case.type";
import { EUserRole } from "@/types/user.type";
import { useDebounce } from "@/hooks/use-debounce";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Trash2, Download, Upload, Plus, Sparkles, MapPin, DollarSign, Calendar, BookOpen, AlertCircle, Shield, CheckCircle2, UserCheck, X } from "lucide-react";

interface CaseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id: caseId } = use(params);
  const { data: meData } = useGetMe();
  const user = meData?.data;

  // Primary Case Query
  const { data: caseData, isLoading: isCaseLoading, isError, refetch } = useGetCaseById(caseId, {
    enabled: !!user && !!caseId,
  });

  const tcase = caseData?.data;
  const isOwner = user && tcase && tcase.userId === user.id;
  const isParent = user?.role === EUserRole.PARENT;

  // Invalidate & Update Mutations
  const updateCaseMutation = useUpdateCase({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Status kasus berhasil diperbarui!");
        setErrorMessage("");
        refetch();
      } else {
        setErrorMessage(data.message || "Gagal memperbarui status");
      }
    },
  });

  const inviteTutorMutation = useInviteTutor({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Tutor berhasil diundang!");
        setErrorMessage("");
        setTutorSearch("");
        refetch();
      } else {
        setErrorMessage(data.message || "Gagal mengundang tutor");
      }
    },
  });

  const revokeTutorMutation = useRevokeTutor({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Akses tutor berhasil dicabut!");
        setErrorMessage("");
        refetch();
      } else {
        setErrorMessage(data.message || "Gagal mencabut akses");
      }
    },
  });

  const uploadDocMutation = useUploadCaseDocument({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Berkas berhasil diunggah ke kasus ini!");
        setErrorMessage("");
        if (fileInputRef) fileInputRef.value = "";
        refetch();
      } else {
        setErrorMessage(data.message || "Gagal mengunggah berkas");
      }
    },
  });

  // Directory Search for Tutors (Parent only)
  const [tutorSearch, setTutorSearch] = useState("");
  const debouncedTutorSearch = useDebounce(tutorSearch, 500);
  const { data: searchTutorsData } = useGetAllTutors(
    {
      search: debouncedTutorSearch || undefined,
      limit: 5,
    },
    {
      enabled: !!(isParent && isOwner && debouncedTutorSearch.length > 0),
    }
  );

  // States
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  if (isCaseLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Memuat berkas workspace kasus...</p>
      </div>
    );
  }

  if (isError || !tcase) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 border border-neutral-850 rounded-3xl">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Kasus Tidak Ditemukan</h3>
        <p className="text-xs text-neutral-500 max-w-xs mb-6">
          Kasus les privat yang Anda cari tidak ditemukan atau Anda tidak memiliki izin akses (403 Forbidden).
        </p>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white hover:text-indigo-400 hover:border-indigo-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Workspace
        </Link>
      </div>
    );
  }

  const handleStatusChange = (status: ECaseStatus) => {
    setSuccessMessage("");
    setErrorMessage("");
    updateCaseMutation.mutate({ id: caseId, payload: { status } });
  };

  const handleInviteTutor = (tutorId: string) => {
    setSuccessMessage("");
    setErrorMessage("");
    inviteTutorMutation.mutate({ caseId, payload: { tutorId } });
  };

  const handleRevokeTutor = (tutorId: string) => {
    if (confirm("Apakah Anda yakin ingin mencabut akses tutor ini dari kasus les privat?")) {
      setSuccessMessage("");
      setErrorMessage("");
      revokeTutorMutation.mutate({ caseId, tutorId });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage("");
    setErrorMessage("");

    const file = e.target.files?.[0];
    if (!file) return;

    // Type validation
    const allowedExtensions = ["pdf", "docx", "png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setErrorMessage("Format file tidak valid. Gunakan PDF, DOCX, PNG, atau JPG.");
      return;
    }

    // Size validation (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrorMessage("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    uploadDocMutation.mutate({ caseId, file });
  };

  const handleFileDownload = async (docId: string, filename: string) => {
    try {
      setDownloadingDocId(docId);
      const blob = await DownloadCaseDocumentService(caseId, docId);
      triggerFileDownload(blob, filename);
    } catch {
      setErrorMessage("Gagal mengunduh berkas. Coba lagi nanti.");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const activeInvitedTutors = tcase.caseAccesses || [];
  const searchTutors = searchTutorsData?.data?.data || [];

  // Filter out tutors already invited
  const inviteableTutors = searchTutors.filter(
    (stutor) => !activeInvitedTutors.some((invited) => invited.tutorId === stutor.userId)
  );

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Link
          href="/cases"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Kasus
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-neutral-800 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/15">
                  Les Privat Detail
                </span>
                <h1 className="text-xl font-bold text-white mt-2">{tcase.title}</h1>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-1.5">
                {isOwner ? (
                  <select
                    value={tcase.status}
                    onChange={(e) => handleStatusChange(e.target.value as ECaseStatus)}
                    className="bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-all cursor-pointer font-semibold uppercase tracking-wider"
                  >
                    <option value={ECaseStatus.OPEN}>OPEN</option>
                    <option value={ECaseStatus.MATCHED}>MATCHED</option>
                    <option value={ECaseStatus.CLOSED}>CLOSED</option>
                  </select>
                ) : (
                  <span
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                      tcase.status === ECaseStatus.OPEN
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : tcase.status === ECaseStatus.MATCHED
                        ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                        : "bg-neutral-850 text-neutral-500 border border-neutral-800"
                    }`}
                  >
                    {tcase.status}
                  </span>
                )}
              </div>
            </div>

            {/* Success / Error Alerts */}
            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {errorMessage}
              </div>
            )}

            {/* Parameter Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Mata Pelajaran</span>
                <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  {tcase.subject}
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Tingkat Sekolah</span>
                <p className="text-xs text-white font-semibold mt-1">
                  {tcase.level}
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Lokasi Les</span>
                <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  {tcase.location}
                </p>
              </div>

              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-850">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Tarif per Jam</span>
                <p className="text-xs text-white font-semibold mt-1 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-indigo-400" />
                  {tcase.budgetPerHour.toLocaleString("id-ID")}
                </p>
              </div>
            </div>
          </div>

          {/* Document Workspace Library */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white">Materi Ajar & Berkas Lampiran</h2>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Upload tugas, soal latihan, atau sample worksheet.
                </p>
              </div>

              {/* Upload Input */}
              <div>
                <input
                  type="file"
                  id="case-doc-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  ref={(ref) => setFileInputRef(ref)}
                  disabled={uploadDocMutation.isPending}
                />
                <label
                  htmlFor="case-doc-upload"
                  className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer transition-all ${
                    uploadDocMutation.isPending ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {uploadDocMutation.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  Upload Berkas
                </label>
              </div>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              {!tcase.caseDocuments || tcase.caseDocuments.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-neutral-850 rounded-2xl text-neutral-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                  <p className="text-xs">Belum ada berkas lampiran</p>
                </div>
              ) : (
                tcase.caseDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-neutral-950 border border-neutral-850 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate" title={doc.filename}>
                          {doc.filename}
                        </p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">
                          {(doc.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleFileDownload(doc.id, doc.filename)}
                      disabled={downloadingDocId === doc.id}
                      className="p-1.5 rounded-lg border border-neutral-850 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all disabled:opacity-50"
                      title="Download"
                    >
                      {downloadingDocId === doc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Invite Panel (Access Control, Parents only) */}
        <div className="space-y-6">
          {/* Access Panel */}
          {isParent && isOwner && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  Access Control List
                </h2>
                <p className="text-[10px] text-neutral-500 mt-0.5">
                  Undang tutor privat dari direktori untuk memberikan akses ke kasus ini.
                </p>
              </div>

              {/* Invite Tutor input */}
              <div className="space-y-3 relative">
                <input
                  type="text"
                  value={tutorSearch}
                  onChange={(e) => setTutorSearch(e.target.value)}
                  placeholder="Ketik nama tutor untuk diundang..."
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                />

                {/* Autocomplete List */}
                {tutorSearch.length > 0 && (
                  <div className="absolute top-11 left-0 z-20 w-full bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
                    {inviteableTutors.length === 0 ? (
                      <p className="p-3 text-[10px] text-neutral-500 italic text-center">Tutor tidak ditemukan</p>
                    ) : (
                      inviteableTutors.map((tutor) => (
                        <div
                          key={tutor.id}
                          className="flex items-center justify-between p-3 border-b border-neutral-900 last:border-0 hover:bg-neutral-900 transition-all text-xs"
                        >
                          <span className="text-white font-medium truncate pr-2">{tutor.displayName}</span>
                          <button
                            onClick={() => handleInviteTutor(tutor.userId)}
                            className="p-1 rounded bg-indigo-500/10 hover:bg-indigo-500 text-indigo-400 hover:text-white transition-all border border-indigo-500/20"
                            title="Undang"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Invited Tutors list */}
              <div className="space-y-3 pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-400">Tutor yang Terdaftar (Diundang)</h3>

                {activeInvitedTutors.length === 0 ? (
                  <p className="text-xs text-neutral-500 italic bg-neutral-950 p-4 border border-neutral-850 rounded-2xl">
                    Belum ada tutor yang memiliki akses.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {activeInvitedTutors.map((access) => (
                      <div
                        key={access.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs"
                      >
                        <span className="text-white font-semibold flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-indigo-400" />
                          {access.tutor?.name || "Tutor"}
                        </span>

                        <button
                          onClick={() => handleRevokeTutor(access.tutorId)}
                          disabled={revokeTutorMutation.isPending}
                          className="p-1.5 rounded-lg border border-neutral-800 text-neutral-500 hover:text-rose-400 hover:border-rose-500/20 transition-all disabled:opacity-50"
                          title="Cabut Akses"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Invited Access Notice for Tutors */}
          {!isParent && (
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-4 text-center">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 mx-auto text-indigo-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Status Akses Anda</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Anda diundang secara resmi oleh orang tua/pemilik kasus privat ini. Anda memiliki akses untuk mengunggah bahan ajar serta mengunduh semua berkas lampiran yang tersedia.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
