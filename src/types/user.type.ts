export enum EUserRole {
  PARENT = "PARENT",
  TUTOR = "TUTOR",
  ADMIN = "ADMIN",
}

export interface IUser {
  id: string;
  username: string;
  name: string;
  role: EUserRole;
  createdAt: string;
  updatedAt: string;
}
