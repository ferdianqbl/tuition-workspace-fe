import { baseApi } from "@/lib/axios";
import { IResponse } from "@/types/response.type";
import { ITutorProfilesPagedData } from "@/types/tutor.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TQueryConfig } from "@/lib/react-query";

export const GetAllTutorsKey = "GetAllTutors";

export interface IGetAllTutorsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export async function GetAllTutorsService(params: IGetAllTutorsParams = {}): Promise<IResponse<ITutorProfilesPagedData>> {
  try {
    const { data } = await baseApi.get<IResponse<ITutorProfilesPagedData>>("/tutors", { params });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ITutorProfilesPagedData>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: { data: [], total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
}

export function useGetAllTutors(params: IGetAllTutorsParams = {}, config?: TQueryConfig<typeof GetAllTutorsService>) {
  return useQuery<IResponse<ITutorProfilesPagedData>>({
    queryKey: [GetAllTutorsKey, params],
    queryFn: () => GetAllTutorsService(params),
    ...config,
  });
}
