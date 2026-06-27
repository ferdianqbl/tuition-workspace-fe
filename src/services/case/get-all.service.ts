import { baseApi } from "@/lib/axios";
import type { TQueryConfig } from "@/lib/react-query";
import { ECaseStatus, ICasesPagedData } from "@/types/case.type";
import { IResponse } from "@/types/response.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GetAllCasesKey = "GetAllCases";

export interface IGetAllCasesParams {
  page?: number;
  limit?: number;
  search?: string;
  subject?: string;
  level?: string;
  status?: ECaseStatus;
}

export async function GetAllCasesService(
  params: IGetAllCasesParams = {},
): Promise<IResponse<ICasesPagedData>> {
  try {
    const { data } = await baseApi.get<IResponse<ICasesPagedData>>("/cases", {
      params,
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ICasesPagedData>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
}

export function useGetAllCases(
  params: IGetAllCasesParams = {},
  config?: TQueryConfig<typeof GetAllCasesService>,
) {
  return useQuery<IResponse<ICasesPagedData>>({
    queryKey: [GetAllCasesKey, params],
    queryFn: () => GetAllCasesService(params),
    ...config,
  });
}
