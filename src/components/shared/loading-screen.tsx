import { Loader2 } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
  fullHeight?: boolean;
}

export function LoadingScreen({
  message = "Loading data...",
  fullHeight = false,
}: LoadingScreenProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-neutral-400 ${fullHeight ? "min-h-screen bg-neutral-950" : "py-12"}`}
    >
      <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mb-4" />
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
