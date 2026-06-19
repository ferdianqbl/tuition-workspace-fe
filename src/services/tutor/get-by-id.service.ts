import { baseApi } from "@/lib/axios";
import { IResponse } from "@/types/response.type";
import { ITutorProfile } from "@/types/tutor.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { TQueryConfig } from "@/lib/react-query";

export const GetTutorByIdKey = "GetTutorById";

export async function GetTutorByIdService(id: string): Promise<IResponse<ITutorProfile | null>> {
  try {
    const { data } = await baseApi.get<IResponse<ITutorProfile>>(`/tutors/${id}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ITutorProfile | null>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export function useGetTutorById(id: string, config?: TQueryConfig<typeof GetTutorByIdService>) {
  return useQuery<IResponse<ITutorProfile | null>>({
    queryKey: [GetTutorByIdKey, id],
    queryFn: () => GetTutorByIdService(id),
    enabled: !!id,
    ...config,
  });
}
