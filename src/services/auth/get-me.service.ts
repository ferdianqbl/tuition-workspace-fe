import { baseApi } from "@/lib/axios";
import type { TQueryConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { IUser } from "@/types/user.type";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const GetMeKey = "GetMe";

export async function GetMeService(): Promise<IResponse<IUser | null>> {
  try {
    const { data } = await baseApi.get<IResponse<IUser>>("/auth/me");
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<IUser | null>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: null,
    };
  }
}

export function useGetMe(config?: TQueryConfig<typeof GetMeService>) {
  return useQuery<IResponse<IUser | null>>({
    queryKey: [GetMeKey],
    queryFn: GetMeService,
    ...config,
  });
}
