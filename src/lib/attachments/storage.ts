import type { BasicAttachment } from "@/types";

export type StoredAttachment = BasicAttachment & {
  uploadedAt: string;
};

const STORAGE_KEY = "talabahub_attachments";

function normalizeAttachment(item: Partial<StoredAttachment>): StoredAttachment | null {
  if (!item.id) return null;
  return {
    id: item.id,
    fileName: item.fileName ?? `Attachment ${item.id.slice(0, 8)}`,
    mimeType: item.mimeType ?? "application/octet-stream",
    url: item.url ?? "",
    uploadedAt: item.uploadedAt ?? new Date().toISOString()
  };
}

export function getStoredAttachments(): StoredAttachment[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as Partial<StoredAttachment>[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeAttachment).filter(Boolean) as StoredAttachment[];
  } catch {
    return [];
  }
}

export function storeAttachment(attachment: BasicAttachment) {
  if (typeof window === "undefined") return [];
  const existing = getStoredAttachments();
  const withTimestamp: StoredAttachment = {
    ...attachment,
    fileName: attachment.fileName ?? `Attachment ${attachment.id.slice(0, 8)}`,
    mimeType: attachment.mimeType ?? "application/octet-stream",
    url: attachment.url ?? "",
    uploadedAt: new Date().toISOString()
  };
  const next = [withTimestamp, ...existing.filter((item) => item.id !== attachment.id)];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeStoredAttachment(id: string) {
  if (typeof window === "undefined") return [];
  const next = getStoredAttachments().filter((item) => item.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
