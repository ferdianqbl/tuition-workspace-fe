import { baseApi } from "@/lib/axios";
import type { TMutationConfig } from "@/lib/react-query";
import { ICaseDocument } from "@/types/case.type";
import { IResponse } from "@/types/response.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GetCaseByIdKey } from "./get-by-id.service";

export async function UploadCaseDocumentService({
  caseId,
  file,
}: {
  caseId: string;
  file: File;
}): Promise<IResponse<ICaseDocument>> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await baseApi.post<IResponse<ICaseDocument>>(
      `/cases/${caseId}/documents`,
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
      return error.response.data as IResponse<ICaseDocument>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: {} as ICaseDocument,
    };
  }
}

export function useUploadCaseDocument(
  config?: TMutationConfig<typeof UploadCaseDocumentService>,
) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: UploadCaseDocumentService,
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
