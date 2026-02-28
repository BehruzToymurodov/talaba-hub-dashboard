import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Domain, PageableResponse } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type DomainsQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
};

export function useDomains(params?: DomainsQuery) {
  return useQuery({
    queryKey: ["domains", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<Domain>>(ENDPOINTS.domains.list, {
        params: {
          search: params?.search,
          page: params?.page ? params.page - 1 : 0,
          size: params?.pageSize ?? 20
        }
      });
      return mapPageable(data);
    }
  });
}

export function useCreateDomain() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Domain>) => {
      const body = omitUndefined({
        domain: payload.domain,
        university_name: payload.universityName,
        active: payload.active
      });
      const { data } = await apiClient.post<Domain>(ENDPOINTS.domains.create, body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["domains"] })
  });
}

export function useUpdateDomain() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Domain> }) => {
      const body = omitUndefined({
        domain: payload.domain,
        university_name: payload.universityName,
        active: payload.active
      });
      const { data } = await apiClient.put<Domain>(ENDPOINTS.domains.update(id), body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["domains"] })
  });
}

export function useDeleteDomain() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(ENDPOINTS.domains.delete(id));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["domains"] })
  });
}
