"use client";

import { use, useEffect, useState } from "react";
import { useGetMe } from "@/services/auth/get-me.service";
import { useGetTutorById } from "@/services/tutor/get-by-id.service";
import { EUserRole } from "@/types/user.type";
import Link from "next/link";
import { ArrowLeft, Loader2, FileText, Sparkles, GraduationCap, BookOpen, AlertCircle } from "lucide-react";

interface TutorsDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function TutorsDetailPage({ params }: TutorsDetailPageProps) {
  const { id } = use(params);
  const { data: meData } = useGetMe();
  const user = meData?.data;

  // Authorization: Parents and Admins only (tutors cannot view other tutors)
  const isAuthorized = user?.role === EUserRole.PARENT || user?.role === EUserRole.ADMIN;

  const { data: profileData, isLoading, isError } = useGetTutorById(id, {
    enabled: !!isAuthorized && !!id,
  });

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/50 border border-neutral-800 rounded-3xl min-h-[300px]">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 mb-4">
          <AlertCircle className="w-6 h-6 text-rose-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Akses Ditolak (403 Forbidden)</h3>
        <p className="text-neutral-400 text-xs max-w-sm">
          Tutor tidak diizinkan untuk melihat profil tutor lain.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Memuat rincian profil tutor...</p>
      </div>
    );
  }

  const profile = profileData?.data;

  if (isError || !profile) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-neutral-900/40 border border-neutral-850 rounded-3xl">
        <AlertCircle className="w-10 h-10 text-rose-400 mb-3" />
        <h3 className="text-base font-bold text-white mb-1">Tutor Tidak Ditemukan</h3>
        <p className="text-xs text-neutral-500 max-w-xs mb-6">
          Profil pengajar yang Anda cari tidak ditemukan atau telah dinonaktifkan.
        </p>
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white hover:text-indigo-400 hover:border-indigo-500/20 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Direktori
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back Button */}
      <div>
        <Link
          href="/tutors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Direktori
        </Link>
      </div>

      {/* Main card */}
      <div className="bg-neutral-900 border border-neutral-800/80 rounded-3xl p-6 md:p-8 space-y-8">
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
              Kualifikasi Akademik
            </h2>
            {profile.qualifications && profile.qualifications.length > 0 ? (
              <ul className="space-y-2.5">
                {profile.qualifications.map((qual, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300"
                  >
                    {qual}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-500 italic">Tidak mencantumkan kualifikasi.</p>
            )}
          </div>

          {/* Experiences */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4 shrink-0" />
              Pengalaman Mengajar
            </h2>
            {profile.experiences && profile.experiences.length > 0 ? (
              <ul className="space-y-2.5">
                {profile.experiences.map((exp, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-850 text-xs text-neutral-300"
                  >
                    {exp}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-500 italic">Tidak mencantumkan pengalaman.</p>
            )}
          </div>
        </div>

        {/* Credentials and Verification Documents */}
        <div className="space-y-4 pt-4 border-t border-neutral-800">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider text-neutral-400">
              Dokumen Verifikasi Pendukung
            </h2>
            <p className="text-[10px] text-neutral-500 mt-0.5">
              Berkas kualifikasi yang diunggah secara resmi oleh tutor ini.
            </p>
          </div>

          {!profile.documents || profile.documents.length === 0 ? (
            <p className="text-xs text-neutral-500 italic bg-neutral-950 p-4 border border-neutral-850 rounded-2xl">
              Tutor belum mengunggah berkas pendukung.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-950 border border-neutral-850 text-xs"
                >
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
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
