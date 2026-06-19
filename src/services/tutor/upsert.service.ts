import { baseApi } from "@/lib/axios";
import { IResponse } from "@/types/response.type";
import { ITutorProfile } from "@/types/tutor.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { TMutationConfig } from "@/lib/react-query";
import { GetMyTutorProfileKey } from "./get-me.service";

export interface IUpsertTutorRequest {
  displayName: string;
  qualifications?: string[];
  experiences?: string[];
}

export async function UpsertTutorProfileService(payload: IUpsertTutorRequest): Promise<IResponse<ITutorProfile>> {
  try {
    const { data } = await baseApi.post<IResponse<ITutorProfile>>("/tutors", payload);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ITutorProfile>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: {} as ITutorProfile,
    };
  }
}

export function useUpsertTutorProfile(config?: TMutationConfig<typeof UpsertTutorProfileService>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: UpsertTutorProfileService,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [GetMyTutorProfileKey] });
      }
      if (onSuccess) {
        onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restConfig,
  });
}
