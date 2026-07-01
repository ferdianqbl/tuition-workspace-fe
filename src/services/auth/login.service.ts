import { baseApi } from "@/lib/axios";
import type { TMutationConfig } from "@/lib/react-query";
import { IResponse } from "@/types/response.type";
import { IUser } from "@/types/user.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GetMeKey } from "./get-me.service";

export interface ILoginResponseData {
  token: string;
  user: IUser;
}

export interface ILoginRequest {
  username: string;
  password: string;
}

export async function LoginService(
  payload: ILoginRequest,
): Promise<IResponse<ILoginResponseData>> {
  try {
    const { data } = await baseApi.post<IResponse<ILoginResponseData>>(
      "/auth/login",
      payload,
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data as IResponse<ILoginResponseData>;
    }
    return {
      success: false,
      code: 500,
      message: "Internal Server Error",
      data: { token: "", user: {} as IUser },
    };
  }
}

export function useLogin(config?: TMutationConfig<typeof LoginService>) {
  const queryClient = useQueryClient();
  const { onSuccess, ...restConfig } = config || {};
  return useMutation({
    mutationFn: LoginService,
    onSuccess: (data, variables, onMutateResult, context) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: [GetMeKey] });
      }
      if (onSuccess) {
        onSuccess(data, variables, onMutateResult, context);
      }
    },
    ...restConfig,
  });
}
