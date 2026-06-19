import { baseApi } from "@/lib/axios";
import { IResponse } from "@/types/response.type";
import { ITuitionCase, ECaseStatus } from "@/types/case.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { TMutationConfig } from "@/lib/react-query";
import { GetCaseByIdKey } from "./get-by-id.service";
import { GetAllCasesKey } from "./get-all.service";

export interface IUpdateCaseRequest {
  title?: string;
  subject?: string;
  level?: string;
  location?: string;
  budgetPerHour?: number;
  status?: ECaseStatus;
}

export async function UpdateCaseService({ id, payload }: { id: string; payload: IUpdateCaseRequest }): Promise<IResponse<ITuitionCase>> {
  try {
    const { data } = await baseApi.patch<IResponse<ITuitionCase>>(`/cases/${id}`, payload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ITuitionCase>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: {} as ITuitionCase,
    };
  }
}

export function useUpdateCase(config?: TMutationConfig<typeof UpdateCaseService>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: UpdateCaseService,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [GetCaseByIdKey, variables.id] });
        queryClient.invalidateQueries({ queryKey: [GetAllCasesKey] });
      }
      if (onSuccess) {
        onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restConfig,
  });
}
