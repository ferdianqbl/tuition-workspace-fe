"use client";

import { useGetMe } from "@/services/auth/get-me.service";
import { Navbar } from "@/components/ui/navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getToken } from "@/lib/axios";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  
  // Safe token extraction
  const token = typeof window !== "undefined" ? getToken() : "";

  const { data: meData, isLoading, isError } = useGetMe({
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && !token) {
      router.push("/");
    }
  }, [token, router]);

  useEffect(() => {
    if (!isLoading && (isError || !meData?.success)) {
      router.push("/");
    }
  }, [isLoading, isError, meData, router]);

  if (isLoading || !meData?.success) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center text-neutral-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
        <p className="text-sm font-medium">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
