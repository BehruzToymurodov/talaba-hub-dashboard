import { useMutation } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { BasicAttachment } from "@/types";

export function useUploadAttachment() {
  return useMutation({
    mutationFn: async ({ file, privacy }: { file: File; privacy?: "PUBLIC" | "PRIVATE" }) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClient.post<BasicAttachment>(ENDPOINTS.attachments.upload, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: { privacy }
      });
      return data;
    }
  });
}

export async function downloadAttachment(token: string) {
  const { data } = await apiClient.get<Blob>(ENDPOINTS.attachments.download, {
    params: { token },
    responseType: "blob"
  });
  return data;
}
