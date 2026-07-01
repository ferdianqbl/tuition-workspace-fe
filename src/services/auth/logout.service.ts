import { baseApi } from "@/lib/axios";
import type { TMutationConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GetMeKey } from "./get-me.service";

export async function LogoutService(): Promise<IResponse<null>> {
  try {
    const { data } = await baseApi.post<IResponse<null>>("/auth/logout");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<null>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export function useLogout(config?: TMutationConfig<typeof LogoutService>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: LogoutService,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.setQueryData([GetMeKey], null);
      queryClient.clear();
      if (onSuccess) {
        onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restConfig,
  });
}
