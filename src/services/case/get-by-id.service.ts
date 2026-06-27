import { baseApi } from "@/lib/axios";
import type { TQueryConfig } from "@/lib/react-query";
import { ITuitionCase } from "@/types/case.type";
import { IResponse } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GetCaseByIdKey = "GetCaseById";

export async function GetCaseByIdService(
  id: string,
): Promise<IResponse<ITuitionCase | null>> {
  try {
    const { data } = await baseApi.get<IResponse<ITuitionCase>>(`/cases/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ITuitionCase | null>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export function useGetCaseById(
  id: string,
  config?: TQueryConfig<typeof GetCaseByIdService>,
) {
  return useQuery<IResponse<ITuitionCase | null>>({
    queryKey: [GetCaseByIdKey, id],
    queryFn: () => GetCaseByIdService(id),
    enabled: !!id,
    ...config,
  });
}
