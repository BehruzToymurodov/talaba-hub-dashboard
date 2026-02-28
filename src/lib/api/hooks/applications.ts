import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Application, PageableResponse } from "@/types";
import { mapPageable } from "@/lib/api/adapters";

export type SubmitApplicationPayload = {
  firstName: string;
  lastName: string;
  middleName?: string | null;
  universityEmail: string;
  studyStartDate: string;
  studyEndDate: string;
  attachments?: FileList | null;
};

export type ApplicationsQuery = {
  status?: "PENDING" | "ACCEPTED" | "REJECTED";
  page?: number;
  pageSize?: number;
  search?: string;
};

export function useMyApplications(params?: ApplicationsQuery) {
  return useQuery({
    queryKey: ["applications", "my", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<Application>>(ENDPOINTS.applications.myList, {
        params: {
          page: params?.page ? params.page - 1 : 0,
          size: params?.pageSize ?? 20
        }
      });
      return mapPageable(data);
    }
  });
}

export function useAllApplications(params?: ApplicationsQuery) {
  return useQuery({
    queryKey: ["applications", "all", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<Application>>(ENDPOINTS.applications.listAll, {
        params: {
          status: params?.status,
          search: params?.search,
          page: params?.page ? params.page - 1 : 0,
          size: params?.pageSize ?? 20
        }
      });
      return mapPageable(data);
    }
  });
}

export function useSubmitApplication() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SubmitApplicationPayload) => {
      const formData = new FormData();
      if (payload.attachments && payload.attachments.length > 0) {
        Array.from(payload.attachments).forEach((file) => formData.append("attachments", file));
      }
      const { data } = await apiClient.post<Application>(ENDPOINTS.applications.create, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        params: {
          first_name: payload.firstName,
          last_name: payload.lastName,
          middle_name: payload.middleName,
          university_email: payload.universityEmail,
          study_start_date: payload.studyStartDate,
          study_end_date: payload.studyEndDate
        }
      });
      return data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["applications", "my"] });
      client.invalidateQueries({ queryKey: ["applications", "all"] });
    }
  });
}

export function useReviewApplication() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: { status: "ACCEPTED" | "REJECTED" | "PENDING"; rejectionReason?: string } }) => {
      const body = {
        status: payload.status,
        rejection_reason: payload.rejectionReason
      };
      const { data } = await apiClient.put<Application>(ENDPOINTS.applications.review(id), body);
      return data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["applications", "all"] });
      client.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useApplicationDetail(id: string) {
  return useQuery({
    queryKey: ["applications", "detail", id],
    queryFn: async () => {
      const { data } = await apiClient.get<Application>(ENDPOINTS.applications.detail(id));
      return data;
    },
    enabled: !!id
  });
}
