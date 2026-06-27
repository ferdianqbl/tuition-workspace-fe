import { baseApi } from "@/lib/axios";
import type { TMutationConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { ITutorDocument } from "@/types/tutor.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GetMyTutorProfileKey } from "./get-me.service";

export async function UploadTutorDocumentService(
  file: File,
): Promise<IResponse<ITutorDocument>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await baseApi.post<IResponse<ITutorDocument>>(
      "/tutors/documents",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ITutorDocument>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: {} as ITutorDocument,
    };
  }
}

export function useUploadTutorDocument(
  config?: TMutationConfig<typeof UploadTutorDocumentService>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: UploadTutorDocumentService,
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
