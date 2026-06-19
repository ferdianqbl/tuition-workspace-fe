import { baseApi } from "@/lib/axios";
import { IResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { TMutationConfig } from "@/lib/react-query";
import { GetMyTutorProfileKey } from "./get-me.service";

export async function DeleteTutorDocumentService(docId: string): Promise<IResponse<null>> {
  try {
    const { data } = await baseApi.delete<IResponse<null>>(`/tutors/documents/${docId}`);
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

export function useDeleteTutorDocument(config?: TMutationConfig<typeof DeleteTutorDocumentService>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: DeleteTutorDocumentService,
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
