export interface ITutorDocument {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

export interface ITutorProfile {
  id: string;
  userId: string;
  displayName: string;
  qualifications: string[];
  experiences: string[];
  createdAt: string;
  updatedAt: string;
  documents: ITutorDocument[];
}

export interface ITutorProfilesPagedData {
  data: ITutorProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
