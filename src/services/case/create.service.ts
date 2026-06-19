import { baseApi } from "@/lib/axios";
import { IResponse } from "@/types/response.type";
import { ITuitionCase } from "@/types/case.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { TMutationConfig } from "@/lib/react-query";
import { GetAllCasesKey } from "./get-all.service";

export interface ICreateCaseRequest {
  title: string;
  subject: string;
  level: string;
  location: string;
  budgetPerHour: number;
}

export async function CreateCaseService(payload: ICreateCaseRequest): Promise<IResponse<ITuitionCase>> {
  try {
    const { data } = await baseApi.post<IResponse<ITuitionCase>>("/cases", payload);
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

export function useCreateCase(config?: TMutationConfig<typeof CreateCaseService>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: CreateCaseService,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [GetAllCasesKey] });
      }
      if (onSuccess) {
        onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restConfig,
  });
}
