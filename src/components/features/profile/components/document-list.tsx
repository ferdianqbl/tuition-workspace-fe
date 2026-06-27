import { Button } from "@/components/ui/button";
import { useDeleteTutorDocument } from "@/services/tutor/delete-doc.service";
import {
  DownloadTutorDocumentService,
  triggerTutorFileDownload,
} from "@/services/tutor/download-doc.service";
import { useUploadTutorDocument } from "@/services/tutor/upload-doc.service";
import { Download, FileText, Loader2, Trash2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentListProps {
  profile: {
    id: string;
    documents?: Array<{
      id: string;
      filename: string;
      size: number;
    }>;
  } | null;
  onRefresh: () => void;
}

export function DocumentList({ profile, onRefresh }: DocumentListProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);

  const handleFileDownload = async (docId: string, filename: string) => {
    try {
      setDownloadingDocId(docId);
      const blob = await DownloadTutorDocumentService(docId);
      triggerTutorFileDownload(blob, filename);
      toast.success("Download started!");
    } catch {
      toast.error("Failed to download document");
    } finally {
      setDownloadingDocId(null);
    }
  };

  const uploadMutation = useUploadTutorDocument({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Document uploaded successfully!");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onRefresh();
      } else {
        toast.error(data.message || "Failed to upload document");
      }
    },
  });

  const deleteMutation = useDeleteTutorDocument({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Document deleted successfully!");
        onRefresh();
      } else {
        toast.error(data.message || "Failed to delete document");
      }
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const allowedExtensions = ["pdf", "docx", "png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error("Invalid file format. Use PDF, DOCX, PNG, or JPG.");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum 5MB.");
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDeleteDoc = (docId: string) => {
    if (confirm("Are you sure you want to delete this supporting document?")) {
      deleteMutation.mutate(docId);
    }
  };

  const isUploading = uploadMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  return (
    <div className="space-y-6">
      {/* Document List */}
      <div className="space-y-3">
        {!profile || !profile.documents || profile.documents.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-neutral-800 rounded-2xl text-neutral-500 bg-neutral-950/20">
            <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            <p className="text-xs">No documents uploaded yet</p>
          </div>
        ) : (
          profile.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950/50 border border-neutral-800/80 text-xs hover:border-neutral-700 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                <div className="min-w-0">
                  <p
                    className="text-white font-medium truncate"
                    title={doc.filename}
                  >
                    {doc.filename}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {(doc.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleFileDownload(doc.id, doc.filename)}
                  disabled={downloadingDocId === doc.id}
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                  title="Download"
                >
                  {downloadingDocId === doc.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteDoc(doc.id)}
                  disabled={isDeleting}
                  className="w-8 h-8 rounded-lg text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Area */}
      {profile ? (
        <div className="pt-2 border-t border-neutral-800">
          <input
            type="file"
            id="tutor-doc-upload"
            className="hidden"
            onChange={handleFileUpload}
            ref={fileInputRef}
            disabled={isUploading}
          />
          <label
            htmlFor="tutor-doc-upload"
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-dashed border-neutral-850 hover:border-neutral-750 bg-neutral-950/40 text-xs font-semibold text-neutral-400 hover:text-white cursor-pointer transition-all ${
              isUploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 text-indigo-400" />
            )}
            Upload New Document
          </label>
          <p className="text-[9px] text-center text-muted-foreground mt-2">
            Format: PDF, PNG, JPG (Max 5MB)
          </p>
        </div>
      ) : (
        <p className="text-[10px] text-center text-neutral-500 italic bg-neutral-950/40 p-4 border border-neutral-850 rounded-2xl">
          Please save Tutor Information first to enable document uploads.
        </p>
      )}
    </div>
  );
}
