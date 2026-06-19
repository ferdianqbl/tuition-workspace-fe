export interface IResponse<T = unknown> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}
