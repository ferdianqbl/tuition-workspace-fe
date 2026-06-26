import { baseApi } from "@/lib/axios";

export async function DownloadTutorDocumentService(docId: string): Promise<Blob> {
  const { data } = await baseApi.get<Blob>(`/tutors/documents/${docId}`, {
    responseType: "blob",
  });
  return data;
}

export function triggerTutorFileDownload(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
