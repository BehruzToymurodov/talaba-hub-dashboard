import { useMemo, useState } from "react";
import { Copy, Download, ImageIcon, RefreshCcw, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { RequireRole } from "@/components/layout/AuthGate";
import { PageHeader } from "@/components/layout/PageHeader";
import { useUploadAttachment } from "@/lib/api/hooks";
import { downloadAttachment } from "@/lib/api/hooks/attachments";
import { formatDateTime } from "@/lib/utils/formatters";
import { getStoredAttachments, removeStoredAttachment, storeAttachment } from "@/lib/attachments/storage";
import type { StoredAttachment } from "@/lib/attachments/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function extractToken(url: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url, window.location.origin);
    return parsed.searchParams.get("token") ?? "";
  } catch {
    return "";
  }
}

export default function AttachmentsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");
  const [attachments, setAttachments] = useState<StoredAttachment[]>(() => getStoredAttachments());
  const [downloadToken, setDownloadToken] = useState("");
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [downloadMime, setDownloadMime] = useState<string | null>(null);

  const uploadMutation = useUploadAttachment();
  const hasFile = !!file;

  const sortedAttachments = useMemo(
    () => [...attachments].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()),
    [attachments]
  );

  const handleUpload = async () => {
    if (!file) {
      toast.error("Choose a file to upload.");
      return;
    }
    try {
      const attachment = await uploadMutation.mutateAsync({ file, privacy });
      const mappedAttachment = {
        ...attachment,
        fileName: attachment.fileName ?? file.name,
        mimeType: attachment.mimeType ?? file.type
      };
      const next = storeAttachment(mappedAttachment);
      setAttachments(next);
      setFile(null);
      toast.success("Attachment uploaded.");
    } catch {
      toast.error("Upload failed.");
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied.`);
    } catch {
      toast.error("Failed to copy.");
    }
  };

  const handleRemove = (id: string) => {
    const next = removeStoredAttachment(id);
    setAttachments(next);
  };

  const handleRefresh = () => {
    setAttachments(getStoredAttachments());
  };

  const handleDownload = async () => {
    if (!downloadToken.trim()) {
      toast.error("Paste a token or URL first.");
      return;
    }
    const token = downloadToken.includes("token=") ? extractToken(downloadToken) : downloadToken.trim();
    if (!token) {
      toast.error("Token not found.");
      return;
    }
    try {
      const blob = await downloadAttachment(token);
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setDownloadMime(blob.type || null);
      toast.success("Downloaded.");
    } catch {
      toast.error("Download failed.");
    }
  };

  return (
    <RequireRole allowed={["admin", "moderator"]}>
      <div className="space-y-6">
        <PageHeader
          title="Attachments"
          subtitle="Upload logos and images, then use the attachment ID in categories, companies, or discounts."
        />

        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <Card>
            <CardContent className="flex flex-col gap-4 p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Upload new file</p>
                <Button type="button" variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh list
                </Button>
              </div>
              <Input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                aria-label="Upload attachment"
              />
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Privacy</p>
                  <Select value={privacy} onValueChange={(value) => setPrivacy(value as "PUBLIC" | "PRIVATE")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={handleUpload} disabled={!hasFile || uploadMutation.isPending}>
                    <Upload className="mr-2 h-4 w-4" />
                    {uploadMutation.isPending ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Backend returns an attachment ID and URL. We store uploaded items locally for quick reuse.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm font-medium">Download attachment</p>
              <Input
                placeholder="Paste token or full URL"
                value={downloadToken}
                onChange={(event) => setDownloadToken(event.target.value)}
              />
              <Button type="button" variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {downloadUrl ? (
                <div className="space-y-2">
                  {downloadMime?.startsWith("image/") ? (
                    <img src={downloadUrl} alt="Downloaded attachment" className="h-40 w-full rounded-lg object-contain" />
                  ) : (
                    <div className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
                      <ImageIcon className="h-4 w-4" />
                      File ready to download
                    </div>
                  )}
                  <a
                    className="text-xs font-medium text-primary"
                    href={downloadUrl}
                    download="attachment"
                    rel="noreferrer"
                  >
                    Click to save file
                  </a>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        {sortedAttachments.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sortedAttachments.map((attachment) => (
              <Card key={attachment.id} className="overflow-hidden">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{attachment.mimeType}</Badge>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleCopy(attachment.id, "Attachment ID")}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemove(attachment.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex h-32 items-center justify-center rounded-lg border bg-muted">
                    {attachment.mimeType?.startsWith("image/") && attachment.url ? (
                      <img src={attachment.url} alt={attachment.fileName} className="h-full w-full object-contain" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-xs">File preview</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="truncate text-sm font-medium">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">ID: {attachment.id}</p>
                    {attachment.url ? (
                      <button
                        type="button"
                        className="text-xs text-primary underline"
                        onClick={() => handleCopy(attachment.url, "URL")}
                      >
                        Copy URL
                      </button>
                    ) : null}
                    <p className="text-xs text-muted-foreground">Uploaded: {formatDateTime(attachment.uploadedAt)}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No attachments yet"
            description="Upload a file to generate an attachment ID for categories, companies, or discounts."
          />
        )}
      </div>
    </RequireRole>
  );
}
