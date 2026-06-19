"use client";

import { useGetMe } from "@/services/auth/get-me.service";
import { useGetMyTutorProfile } from "@/services/tutor/get-me.service";
import { EUserRole } from "@/types/user.type";
import Link from "next/link";
import { AlertCircle, User, Briefcase, Search, Sparkles, BookOpen, Clock, Settings } from "lucide-react";

export default function DashboardPage() {
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
            Selamat Datang Kembali, {user.name}!
          </h1>
          <p className="text-neutral-400 text-sm max-w-xl">
            Aplikasi bursa les privat terpadu Anda. Kelola pencarian tutor, kelola kasus les, dan upload dokumen pendukung secara aman.
          </p>
        </div>
      </div>

      {/* Profile Warning Banner for Tutors */}
      {isTutor && !isProfileLoading && !hasProfile && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/20 shrink-0">
              <AlertCircle className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Profil Tutor Belum Lengkap!</h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Silakan isi data profil Anda terlebih dahulu agar orang tua/wali murid dapat mengundang Anda.
              </p>
            </div>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl transition-all shadow-md shrink-0"
          >
            Lengkapi Profil Sekarang
          </Link>
        </div>
      )}

      {/* Quick Action Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-indigo-400" />
          Akses Cepat
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Case card (Shared) */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex flex-col justify-between hover:border-neutral-700 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Briefcase className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">Tuition Cases</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {isTutor
                  ? "Daftar tawaran les privat yang mengundang Anda untuk bergabung."
                  : "Kelola daftar kasus les anak Anda yang sedang aktif mencari pengajar."}
              </p>
            </div>
            <Link
              href="/cases"
              className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-white transition-all"
            >
              Buka Workspace Kasus
            </Link>
          </div>

          {/* Directory card (Parent only) */}
          {!isTutor && (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <Search className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white">Cari Tutor</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Jelajahi portofolio kualifikasi dan pengalaman tutor-tutor privat terbaik kami.
                </p>
              </div>
              <Link
                href="/tutors"
                className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-white transition-all"
              >
                Cari & Undang Tutor
              </Link>
            </div>
          )}

          {/* Profile card (Tutor only) */}
          {isTutor && (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex flex-col justify-between hover:border-neutral-700 transition-all">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-base font-bold text-white">Profil Saya</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Perbarui profil publik Anda, kelola kualifikasi, pengalaman mengajar, dan sertifikat prestasi.
                </p>
              </div>
              <Link
                href="/profile"
                className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-white transition-all"
              >
                Kelola Profil Tutor
              </Link>
            </div>
          )}

          {/* Guidelines info card */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800/80 flex flex-col justify-between hover:border-neutral-700 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-bold text-white">Panduan Pengguna</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Pelajari aturan bursa les privat, tata cara menjaga privasi materi ajar, dan tips pencocokan tutor.
              </p>
            </div>
            <a
              href="#docs"
              className="mt-6 inline-flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs font-bold text-neutral-500 pointer-events-none cursor-not-allowed transition-all"
            >
              Segera Hadir
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
