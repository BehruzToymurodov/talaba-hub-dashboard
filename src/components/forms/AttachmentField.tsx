import { useMemo, useState } from "react";
import { toast } from "sonner";

import { useUploadAttachment } from "@/lib/api/hooks";
import { getStoredAttachments, storeAttachment } from "@/lib/attachments/storage";
import type { StoredAttachment } from "@/lib/attachments/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

type AttachmentFieldProps = {
  label: string;
  value?: string | null;
  onChange: (next: string) => void;
  helperText?: string;
  privacyDefault?: "PUBLIC" | "PRIVATE";
};

export function AttachmentField({
  label,
  value,
  onChange,
  helperText,
  privacyDefault = "PUBLIC"
}: AttachmentFieldProps) {
  const [file, setFile] = useState<File | null>(null);
  const [privacy, setPrivacy] = useState<"PUBLIC" | "PRIVATE">(privacyDefault);
  const [attachments, setAttachments] = useState<StoredAttachment[]>(() => getStoredAttachments());

  const uploadMutation = useUploadAttachment();

  const selectedAttachment = useMemo(
    () => (value ? attachments.find((attachment) => attachment.id === value) ?? null : null),
    [attachments, value]
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
      onChange(attachment.id);
      toast.success("Attachment uploaded.");
    } catch {
      toast.error("Upload failed.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label>{label}</Label>
        {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
      </div>

      <div className="space-y-2 rounded-md border p-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <Input
            type="file"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            aria-label="Upload attachment"
          />
          <Select value={privacy} onValueChange={(value) => setPrivacy(value as "PUBLIC" | "PRIVATE")}>
            <SelectTrigger className="md:w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PUBLIC">Public</SelectItem>
              <SelectItem value="PRIVATE">Private</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploadMutation.isPending}
            className="md:ml-auto"
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Uploading fills the attachment ID automatically. You can also paste an existing ID above.
        </p>
      </div>

      {selectedAttachment ? (
        <div className="flex items-center gap-3 rounded-md border p-3">
          <Badge variant="secondary">{selectedAttachment.mimeType}</Badge>
          <div className="flex-1">
            <p className="text-sm font-medium">{selectedAttachment.fileName}</p>
            <p className="text-xs text-muted-foreground">ID: {selectedAttachment.id}</p>
          </div>
          {selectedAttachment.url && selectedAttachment.mimeType.startsWith("image/") ? (
            <img
              src={selectedAttachment.url}
              alt={selectedAttachment.fileName}
              className="h-12 w-12 rounded-md object-cover"
            />
          ) : null}
        </div>
      ) : value ? (
        <div className="rounded-md border p-3 text-xs text-muted-foreground">Selected ID: {value}</div>
      ) : null}

      
    </div>
  );
}
