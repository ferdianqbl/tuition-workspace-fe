"use client";
import { ThemeProvider } from "next-themes";
import { queryClient } from "@/lib/react-query";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { memo } from "react";

export default memo(Providers);

export function Providers({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  const qClient = getQueryClient();
  return (
    <QueryClientProvider client={qClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  if (isServer) {
    return queryClient;
  }
  if (!browserQueryClient) browserQueryClient = queryClient;
  return browserQueryClient;
}
