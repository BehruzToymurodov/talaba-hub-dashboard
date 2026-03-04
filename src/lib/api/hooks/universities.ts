import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { PageableResponse, University } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

type UniversityResponse = {
  id: string;
  name: string;
  active: boolean;
  createdDate?: string | null;
  lastModifiedDate?: string | null;
  created_date?: string | null;
  last_modified_date?: string | null;
};

const mapUniversity = (item: UniversityResponse): University => ({
  id: item.id,
  name: item.name,
  active: item.active,
  createdDate: item.createdDate ?? item.created_date ?? null,
  lastModifiedDate: item.lastModifiedDate ?? item.last_modified_date ?? null
});

export type UniversitiesQuery = {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

export function useUniversities(params: UniversitiesQuery) {
  return useQuery({
    queryKey: ["universities", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<UniversityResponse>>(ENDPOINTS.universities.list, {
        params: {
          search: params.search,
          isActive: params.isActive,
          page: params.page ? params.page - 1 : 0,
          size: params.pageSize ?? 20
        }
      });
      const mapped = mapPageable(data);
      return {
        ...mapped,
        data: mapped.data.map(mapUniversity)
      };
    }
  });
}

export function useCreateUniversity() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<University>) => {
      const body = omitUndefined({
        name: payload.name,
        active: payload.active
      });
      const { data } = await apiClient.post<University>(ENDPOINTS.universities.create, body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["universities"] })
  });
}

export function useUpdateUniversity() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<University> }) => {
      const body = omitUndefined({
        name: payload.name,
        active: payload.active
      });
      const { data } = await apiClient.put<University>(ENDPOINTS.universities.update(id), body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["universities"] })
  });
}

export function useDeleteUniversity() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(ENDPOINTS.universities.delete(id));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["universities"] })
  });
}
