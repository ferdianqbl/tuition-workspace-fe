export enum EUserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export interface IUser {
  id?: string;
  displayName: string;
  email?: string;
  role: EUserRole;
}
