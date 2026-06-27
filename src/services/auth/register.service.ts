import { baseApi } from "@/lib/axios";
import type { TMutationConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { IUser } from "@/types/user.type";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export interface IRegisterRequest {
  username: string;
  password: string;
  name: string;
  role: string;
}

export async function RegisterService(
  payload: IRegisterRequest,
): Promise<IResponse<IUser>> {
  try {
    const { data } = await baseApi.post<IResponse<IUser>>(
      "/auth/register",
      payload,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<IUser>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: {} as IUser,
    };
  }
}

export function useRegister(config?: TMutationConfig<typeof RegisterService>) {
  return useMutation({
    mutationFn: RegisterService,
    ...config,
  });
}
