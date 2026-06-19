export enum ECaseStatus {
  OPEN = "OPEN",
  MATCHED = "MATCHED",
  CLOSED = "CLOSED",
}

export interface ICaseDocument {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ICaseAccess {
  id: string;
  tutorId: string;
  invitedAt: string;
  tutor: {
    id: string;
    name: string;
    username: string;
  };
}

export interface ITuitionCase {
  id: string;
  userId: string;
  title: string;
  subject: string;
  level: string;
  location: string;
  budgetPerHour: number;
  status: ECaseStatus;
  createdAt: string;
  updatedAt: string;
  caseDocuments: ICaseDocument[];
  caseAccesses?: ICaseAccess[];
  user?: {
    id: string;
    name: string;
    username: string;
  };
}

export interface ICasesPagedData {
  data: ITuitionCase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
