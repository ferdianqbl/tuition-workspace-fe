import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DownloadCaseDocumentService,
  triggerFileDownload,
} from "@/services/case/download-doc.service";
import { useUploadCaseDocument } from "@/services/case/upload-doc.service";
import { Download, FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface DocumentWorkspaceProps {
  caseId: string;
  documents?: Array<{
    id: string;
    filename: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
    uploadedBy?: {
      id: string;
      name: string;
      username: string;
      role: string;
    };
  }>;
  onRefresh: () => void;
}

export function DocumentWorkspace({
  caseId,
  documents = [],
  onRefresh,
}: DocumentWorkspaceProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<{
    name: string;
    size: number;
    type: string;
  } | null>(null);

  const uploadDocMutation = useUploadCaseDocument({
    onSuccess: (data) => {
      if (data.success) {
        toast.success("File uploaded successfully to this case!");
        if (fileInputRef.current) fileInputRef.current.value = "";
        onRefresh();
      } else {
        toast.error(data.message || "Failed to upload file");
      }
    },
    onSettled: () => {
      setUploadingFile(null);
    },
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Type validation
    const allowedExtensions = ["pdf", "docx", "png", "jpg", "jpeg"];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      toast.error("Invalid file format. Use PDF, DOCX, PNG, or JPG.");
      return;
    }

    // Size validation (Max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File is too large. Maximum 5MB.");
      return;
    }

    setUploadingFile({
      name: file.name,
      size: file.size,
      type: file.type || file.name.split(".").pop()?.toUpperCase() || "Unknown",
    });

    uploadDocMutation.mutate({ caseId, file });
  };

  const handleFileDownload = async (docId: string, filename: string) => {
    try {
      setDownloadingDocId(docId);
      const blob = await DownloadCaseDocumentService(caseId, docId);
      triggerFileDownload(blob, filename);
    } catch {
      toast.error("Failed to download document. Try again later.");
    } finally {
      setDownloadingDocId(null);
    }
  };

  return (
    <Card className="border-border/40 bg-card/65 rounded-3xl p-6 md:p-8 space-y-6">
      <CardHeader className="pb-4 p-0 border-b border-neutral-800 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-bold text-white">
            Learning Materials & Attachments
          </CardTitle>
          <CardDescription className="text-[10px]">
            Upload assignments, worksheets, or sample papers.
          </CardDescription>
        </div>

        {/* Upload Input */}
        <div>
          <input
            type="file"
            id="case-doc-upload"
            className="hidden"
            onChange={handleFileUpload}
            ref={fileInputRef}
            disabled={uploadDocMutation.isPending}
          />
          <label
            htmlFor="case-doc-upload"
            className={`inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-neutral-950/60 border border-neutral-850 hover:border-neutral-750 text-xs font-semibold text-neutral-300 hover:text-white cursor-pointer transition-all ${
              uploadDocMutation.isPending
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            {uploadDocMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 text-indigo-400" />
            )}
            Upload File
          </label>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Document List */}
        <div className="space-y-3">
          {uploadDocMutation.isPending && uploadingFile && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 border border-indigo-500/30 text-xs animate-pulse">
              <div className="flex items-center gap-3 min-w-0">
                <Loader2 className="w-4 h-4 text-indigo-400 shrink-0 animate-spin" />
                <div className="min-w-0">
                  <p
                    className="text-white font-medium truncate"
                    title={uploadingFile.name}
                  >
                    Uploading: {uploadingFile.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    Type: {uploadingFile.type} | Size:{" "}
                    {(uploadingFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                Uploading...
              </span>
            </div>
          )}

          {documents.length === 0 && !uploadDocMutation.isPending ? (
            <div className="p-12 text-center border border-dashed border-neutral-850 rounded-2xl text-neutral-500">
              <FileText className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
              <p className="text-xs">No attachments uploaded yet</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 rounded-xl bg-neutral-950/40 border border-neutral-855 text-xs hover:border-neutral-700 transition-all"
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
                      {(doc.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                      {doc.mimeType}
                      {doc.uploadedBy ? ` · by ${doc.uploadedBy.name}` : ""}
                    </p>
                  </div>
                </div>

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
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
