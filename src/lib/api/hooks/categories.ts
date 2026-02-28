import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Category, PageableResponse } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type CategoriesQuery = {
  search?: string;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
};

export function useCategories(params: CategoriesQuery) {
  return useQuery({
    queryKey: ["categories", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<Category>>(ENDPOINTS.categories.list, {
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

export function useCreateCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Category>) => {
      const body = omitUndefined({
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
        active: payload.active,
        attachment_id: payload.attachmentId
      });
      const { data } = await apiClient.post<Category>(ENDPOINTS.categories.create, body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["categories"] })
  });
}

export function useUpdateCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Category> }) => {
      const body = omitUndefined({
        name: payload.name,
        description: payload.description,
        icon: payload.icon,
        active: payload.active,
        attachment_id: payload.attachmentId
      });
      const { data } = await apiClient.put<Category>(ENDPOINTS.categories.update(id), body);
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["categories"] })
  });
}

export function useDeleteCategory() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(ENDPOINTS.categories.delete(id));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["categories"] })
  });
}

export function usePublicCategories(params: CategoriesQuery) {
  return useQuery({
    queryKey: ["categories", "public", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<Category>>(ENDPOINTS.categories.publicList, {
        params: {
          search: params.search,
          page: params.page ? params.page - 1 : 0,
          size: params.pageSize ?? 20
        }
      });
      return mapPageable(data);
    }
  });
}

export function useCategorySelect(params: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ["categories", "select", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<{ id: string; name: string }>>(
        ENDPOINTS.categories.selectList,
        {
          params: {
            page: params.page ? params.page - 1 : 0,
            size: params.pageSize ?? 20
          }
        }
      );
      return mapPageable(data);
    }
  });
}
