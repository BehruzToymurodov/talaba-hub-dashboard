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

type DomainResponse = {
  id: string;
  domain: string;
  universityName?: string | null;
  active: boolean;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  university_name?: string | null;
  created_date?: string | null;
  last_modified_date?: string | null;
};

function mapDomain(domain: DomainResponse): Domain {
  return {
    id: domain.id,
    domain: domain.domain,
    universityName: domain.universityName ?? domain.university_name ?? null,
    active: domain.active,
    createdDate: domain.createdDate ?? domain.created_date ?? null,
    lastModifiedDate: domain.lastModifiedDate ?? domain.last_modified_date ?? null
  };
}

export function useDomains(params?: DomainsQuery) {
  return useQuery({
    queryKey: ["domains", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<DomainResponse>>(ENDPOINTS.domains.list, {
        params: {
          search: params?.search,
          page: params?.page ? params.page - 1 : 0,
          size: params?.pageSize ?? 20
        }
      });
      const mapped = mapPageable(data);
      return {
        ...mapped,
        data: mapped.data.map(mapDomain)
      };
    }
  });
}

export function useDomain(id?: string) {
  return useQuery({
    queryKey: ["domains", "detail", id],
    queryFn: async () => {
      if (!id) return null;
      const { data } = await apiClient.get<DomainResponse>(ENDPOINTS.domains.getById(id));
      return mapDomain(data);
    },
    enabled: !!id
  });
}

export function useCreateDomain() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Domain>) => {
      const body = omitUndefined({
        domain: payload.domain,
        universityName: payload.universityName,
        active: payload.active
      });
      const { data } = await apiClient.post<DomainResponse>(ENDPOINTS.domains.create, body);
      return mapDomain(data);
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
        universityName: payload.universityName,
        active: payload.active
      });
      const { data } = await apiClient.put<DomainResponse>(ENDPOINTS.domains.update(id), body);
      return mapDomain(data);
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
