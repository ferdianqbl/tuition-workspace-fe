/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryClient, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          error instanceof AxiosError &&
          error.status &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      onError: () => {
        alert("Terjadi kesalahan saat memproses data");
      },
    },
  },
});

export type TApiFnReturnType<FnType extends (...args: any) => Promise<any>> =
  Awaited<ReturnType<FnType>>;

export type TQueryConfig<T extends (...args: any[]) => any> = Omit<
  ReturnType<T>,
  "queryKey" | "queryFn"
>;

export type TMutationConfig<
  MutationFnType extends (...args: any) => Promise<any>,
> = UseMutationOptions<
  TApiFnReturnType<MutationFnType>,
  Error,
  Parameters<MutationFnType>[0]
>;
