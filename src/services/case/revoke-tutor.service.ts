import { baseApi } from "@/lib/axios";
import type { TMutationConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GetCaseByIdKey } from "./get-by-id.service";

export async function RevokeTutorService({
  caseId,
  tutorId,
}: {
  caseId: string;
  tutorId: string;
}): Promise<IResponse<unknown>> {
  try {
    const { data } = await baseApi.delete<IResponse<unknown>>(
      `/cases/${caseId}/access/${tutorId}`,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<unknown>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export function useRevokeTutor(
  config?: TMutationConfig<typeof RevokeTutorService>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: RevokeTutorService,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.success) {
        queryClient.invalidateQueries({
          queryKey: [GetCaseByIdKey, variables.caseId],
        });
      }
      if (onSuccess) {
        onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restConfig,
  });
}
