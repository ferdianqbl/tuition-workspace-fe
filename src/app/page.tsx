"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/services/auth/login.service";
import { useRegister } from "@/services/auth/register.service";
import { useGetMe } from "@/services/auth/get-me.service";
import { EUserRole } from "@/types/user.type";
import { Sparkles, Loader2, LogIn, UserPlus } from "lucide-react";
import { getToken } from "@/lib/axios";

export default function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<EUserRole>(EUserRole.PARENT);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: meData, isLoading: isMeLoading } = useGetMe({
    enabled: typeof window !== "undefined" && !!getToken(),
  });

  const loginMutation = useLogin({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Login berhasil! Mengalihkan...");
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 1000);
      } else {
        setErrorMessage(data.message || "Gagal masuk");
      }
    },
  });

  const registerMutation = useRegister({
    onSuccess: (data) => {
      if (data.success) {
        setSuccessMessage("Registrasi berhasil! Silakan login.");
        setActiveTab("login");
        setErrorMessage("");
        setPassword("");
      } else {
        setErrorMessage(data.message || "Registrasi gagal");
      }
    },
  });

  useEffect(() => {
    if (meData?.success && meData?.data) {
      router.push("/dashboard");
    }
  }, [meData, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!username || !password) {
      setErrorMessage("Username dan password harus diisi");
      return;
    }

    if (activeTab === "login") {
      loginMutation.mutate({ username, password });
    } else {
      if (!name) {
        setErrorMessage("Nama lengkap harus diisi");
        return;
      }
      registerMutation.mutate({
        username,
        password,
        name,
        role,
      });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  if (isMeLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Memuat sesi Anda...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[500px] pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 via-purple-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3 mb-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
              Tuition Marketplace
            </h1>
            <p className="text-xs text-indigo-400 font-medium tracking-wider uppercase">
              Case Workspace Portal
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-neutral-900/60 border border-neutral-800 backdrop-blur-xl rounded-3xl p-8 shadow-2xl">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-neutral-950/80 p-1.5 rounded-xl mb-6 border border-neutral-800/50">
            <button
              onClick={() => {
                setActiveTab("login");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-neutral-800 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Masuk
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-neutral-800 text-white shadow"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Daftar
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                {successMessage}
              </div>
            )}

            {activeTab === "register" && (
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username123"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-indigo-500/50 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-600 outline-none transition-all"
                required
              />
            </div>

            {activeTab === "register" && (
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1.5 uppercase tracking-wider">
                  Peran (Role)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole(EUserRole.PARENT)}
                    className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      role === EUserRole.PARENT
                        ? "border-indigo-500/50 bg-indigo-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                    }`}
                  >
                    Parent
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole(EUserRole.TUTOR)}
                    className={`py-2 px-4 rounded-xl border text-xs font-semibold transition-all ${
                      role === EUserRole.TUTOR
                        ? "border-indigo-500/50 bg-indigo-500/10 text-white"
                        : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white"
                    }`}
                  >
                    Tutor
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {activeTab === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
