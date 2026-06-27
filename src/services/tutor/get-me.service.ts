import { baseApi } from "@/lib/axios";
import type { TQueryConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { ITutorProfile } from "@/types/tutor.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GetMyTutorProfileKey = "GetMyTutorProfile";

export async function GetMyTutorProfileService(): Promise<
  IResponse<ITutorProfile | null>
> {
  try {
    const { data } = await baseApi.get<IResponse<ITutorProfile>>("/tutors/me");
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

export function useGetMyTutorProfile(
  config?: TQueryConfig<typeof GetMyTutorProfileService>,
) {
  return useQuery<IResponse<ITutorProfile | null>>({
    queryKey: [GetMyTutorProfileKey],
    queryFn: GetMyTutorProfileService,
    ...config,
  });
}
