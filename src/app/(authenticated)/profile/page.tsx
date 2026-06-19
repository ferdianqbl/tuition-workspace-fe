"use client";

import { useEffect, useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetMyTutorProfile } from "@/services/tutor/get-me.service";
import { useUpsertTutorProfile } from "@/services/tutor/upsert.service";
import { useUploadTutorDocument } from "@/services/tutor/upload-doc.service";
import { useDeleteTutorDocument } from "@/services/tutor/delete-doc.service";
import { EUserRole } from "@/types/user.type";
import { Loader2, FileText, Trash2, Upload, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { data: meData } = useGetMe();
  const user = meData?.data;

  // Authorization: Only allow TUTOR role
  const isTutor = user?.role === EUserRole.TUTOR;

  const { data: profileData, isLoading: isProfileLoading } = useGetMyTutorProfile({
    enabled: isTutor,
  });

  const upsertMutation = useUpsertTutorProfile({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Profil berhasil disimpan!");
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Gagal menyimpan profil");
      }
    },
  });

  const uploadMutation = useUploadTutorDocument({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Dokumen berhasil diunggah!");
        setErrorMessage("");
        if (fileInputRef) fileInputRef.value = "";
      } else {
        setErrorMessage(data.message || "Gagal mengunggah dokumen");
      }
    },
  });

  const deleteMutation = useDeleteTutorDocument({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Dokumen berhasil dihapus!");
        setErrorMessage("");
      } else {
        setErrorMessage(data.message || "Gagal menghapus dokumen");
      }
    },
  });

  const [displayName, setDisplayName] = useState("");
  const [qualificationsInput, setQualificationsInput] = useState("");
  const [experiencesInput, setExperiencesInput] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileInputRef, setFileInputRef] = useState<HTMLInputElement | null>(null);

  // Sync profile data to local inputs
  useEffect(() => {
    if (profileData?.data) {
      const profile = profileData.data;
      setDisplayName(profile.displayName || "");
      setQualificationsInput(profile.qualifications?.join(", ") || "");
      setExperiencesInput(profile.experiences?.join("\n") || "");
    }
  }, [profileData]);

  if (!isTutor) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/50 border border-neutral-800 rounded-3xl min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
          <AlertCircle className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Akses Ditolak (403 Forbidden)</h3>
        <p className="text-neutral-400 text-xs max-w-sm">
          Hanya pengguna dengan peran Tutor yang diizinkan untuk mengelola profil tutor.
        </p>
      </div>
    );
  }

  if (isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Memuat profil...</p>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!displayName) {
      setErrorMessage("Nama Tampilan harus diisi");
      return;
    }

    const qualifications = qualificationsInput
      .split(",")
      .map((q) => q.trim())
      .filter(Boolean);

    const experiences = experiencesInput
      .split("\n")
      .map((e) => e.trim())
      .filter(Boolean);

    upsertMutation.mutate({
      displayName,
      qualifications,
      experiences,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSuccessMessage("");
    setErrorMessage("");

    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validations
    const allowedExtensions = ["pdf", "docx", "png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      setErrorMessage("Format file tidak valid. Gunakan PDF, DOCX, PNG, atau JPG.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage("Ukuran file terlalu besar. Maksimal 5MB.");
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDeleteDoc = (docId: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus dokumen pendukung ini?")) {
      setSuccessMessage("");
      setErrorMessage("");
      deleteMutation.mutate(docId);
    }
  };

  const isSaving = upsertMutation.isPending;
  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const profile = profileData?.data;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-indigo-400" />
          Kelola Profil Tutor
        </h1>
        <p className="text-xs text-neutral-400 mt-1.5">
          Atur kualifikasi akademik, rekam jejak mengajar, dan unggah berkas pendukung Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form (Left Column) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6 md:p-8 space-y-6">
            <h2 className="text-base font-bold text-white border-b border-neutral-800 pb-3">
              Informasi Pengajar
            </h2>

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

            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Nama Tampilan (Display Name)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Kak John, B.Sc"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Kualifikasi Akademik (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={qualificationsInput}
                  onChange={(e) => setQualificationsInput(e.target.value)}
                  placeholder="e.g. S1 Pendidikan Matematika UI, Certified IB Tutor"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Contoh: S1 Kimia ITB, Sertifikat Mengajar Cambridge A-Level
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Pengalaman Mengajar (Satu per baris)
                </label>
                <textarea
                  value={experiencesInput}
                  onChange={(e) => setExperiencesInput(e.target.value)}
                  placeholder="e.g. 3 tahun mengajar matematika kelas 12 IPA&#10;Mengajar les privat kurikulum Cambridge IGCSE"
                  rows={5}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all resize-y"
                />
                <span className="text-[10px] text-neutral-500 mt-1 block">
                  Masukkan pengalaman mengajar Anda. Tekan Enter untuk membedakan baris pengalaman.
                </span>
              </div>

              <div className="pt-2 border-t border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Supporting Documents (Right Column) */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                Dokumen Pendukung
              </h2>
              <p className="text-[10px] text-neutral-400">
                Unggah ijazah, sertifikat pendidik, atau MOE letter Anda.
              </p>
            </div>

            {/* Document List */}
            <div className="space-y-3">
              {!profile || !profile.documents || profile.documents.length === 0 ? (
                <div className="p-8 text-center border border-dashed border-neutral-850 rounded-2xl text-neutral-500">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
                  <p className="text-xs">Belum ada dokumen</p>
                </div>
              ) : (
                profile.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs"
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
                      onClick={() => handleDeleteDoc(doc.id)}
                      disabled={isDeleting}
                      className="p-1.5 rounded-lg border border-neutral-800 text-neutral-500 hover:text-rose-400 hover:border-rose-500/20 transition-all disabled:opacity-50"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Upload Area */}
            {profile ? (
              <div className="pt-2 border-t border-neutral-800">
                <input
                  type="file"
                  id="tutor-doc-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                  ref={(ref) => setFileInputRef(ref)}
                  disabled={isUploading}
                />
                <label
                  htmlFor="tutor-doc-upload"
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-neutral-800 hover:border-neutral-700 bg-neutral-950 text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer transition-all ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4 text-indigo-400" />
                  )}
                  Unggah Dokumen Baru
                </label>
                <p className="text-[9px] text-center text-neutral-500 mt-2">
                  Format: PDF, PNG, JPG (Maks. 5MB)
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-center text-neutral-500 italic bg-neutral-950 p-4 border border-neutral-850 rounded-2xl">
                Silakan simpan Informasi Pengajar terlebih dahulu untuk mengaktifkan unggah dokumen.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
