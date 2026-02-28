import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Company, PageableResponse } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type CompaniesQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
  scope?: "mine" | "all";
  isActive?: boolean;
};

export function useCompanies(params: CompaniesQuery) {
  return useQuery({
    queryKey: ["companies", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<Company>>(ENDPOINTS.brands.list, {
        params: {
          search: params.search,
          isActive: params.isActive,
          page: params.page ? params.page - 1 : 0,
          size: params.pageSize ?? 20
        }
      });
      return mapPageable(data);
    }
  });
}

export function useCreateCompany() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Company>) => {
      const body = omitUndefined({
        name: payload.name,
        description: payload.description,
        logo_attachment_id: payload.logoAttachmentId,
        active: payload.active
      });
      const { data } = await apiClient.post<Company>(ENDPOINTS.brands.create, body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["companies"] })
  });
}

export function useUpdateCompany() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Company> }) => {
      const body = omitUndefined({
        name: payload.name,
        description: payload.description,
        logo_attachment_id: payload.logoAttachmentId,
        active: payload.active
      });
      const { data } = await apiClient.put<Company>(ENDPOINTS.brands.update(id), body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["companies"] })
  });
}

export function useDeleteCompany() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(ENDPOINTS.brands.delete(id));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["companies"] })
  });
}
