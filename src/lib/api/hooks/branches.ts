import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Branch, PageableResponse } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type BranchesQuery = {
  page?: number;
  pageSize?: number;
};

export function useBranches(brandId?: string, params?: BranchesQuery) {
  return useQuery({
    queryKey: ["branches", brandId, params],
    queryFn: async () => {
      if (!brandId) {
        return {
          data: [],
          total: 0,
          page: 1,
          pageSize: params?.pageSize ?? 20
        };
      }

      const { data } = await apiClient.get<PageableResponse<Branch>>(ENDPOINTS.branches.list(brandId), {
        params: {
          page: params?.page ? params.page - 1 : 0,
          size: params?.pageSize ?? 20
        }
      });

      return mapPageable(data);
    },
    enabled: !!brandId
  });
}

export function useBranch(brandId?: string, branchId?: string) {
  return useQuery({
    queryKey: ["branches", "detail", brandId, branchId],
    queryFn: async () => {
      if (!brandId || !branchId) return null;
      const { data } = await apiClient.get<Branch>(ENDPOINTS.branches.detail(brandId, branchId));
      return data;
    },
    enabled: !!brandId && !!branchId
  });
}

export function usePublicBranches(brandId?: string, params?: BranchesQuery) {
  return useQuery({
    queryKey: ["branches", "public", brandId, params],
    queryFn: async () => {
      if (!brandId) {
        return {
          data: [],
          total: 0,
          page: 1,
          pageSize: params?.pageSize ?? 20
        };
      }

      const { data } = await apiClient.get<PageableResponse<Branch>>(ENDPOINTS.branches.publicList(brandId), {
        params: {
          page: params?.page ? params.page - 1 : 0,
          size: params?.pageSize ?? 20
        }
      });

      return mapPageable(data);
    },
    enabled: !!brandId
  });
}

export function usePublicBranch(brandId?: string, branchId?: string) {
  return useQuery({
    queryKey: ["branches", "public", "detail", brandId, branchId],
    queryFn: async () => {
      if (!brandId || !branchId) return null;
      const { data } = await apiClient.get<Branch>(ENDPOINTS.branches.publicDetail(brandId, branchId));
      return data;
    },
    enabled: !!brandId && !!branchId
  });
}

export function useCreateBranch() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandId, payload }: { brandId: string; payload: Partial<Branch> }) => {
      const body = omitUndefined({
        name: payload.name,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        phone: payload.phone,
        workingHours: payload.workingHours,
        active: payload.active
      });
      const { data } = await apiClient.post<Branch>(ENDPOINTS.branches.create(brandId), body);
      return data;
    },
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["branches", variables.brandId] });
    }
  });
}

export function useUpdateBranch() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({
      brandId,
      branchId,
      payload
    }: {
      brandId: string;
      branchId: string;
      payload: Partial<Branch>;
    }) => {
      const body = omitUndefined({
        name: payload.name,
        address: payload.address,
        latitude: payload.latitude,
        longitude: payload.longitude,
        phone: payload.phone,
        workingHours: payload.workingHours,
        active: payload.active
      });
      const { data } = await apiClient.put<Branch>(ENDPOINTS.branches.update(brandId, branchId), body);
      return data;
    },
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["branches", variables.brandId] });
    }
  });
}

export function useDeleteBranch() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: async ({ brandId, branchId }: { brandId: string; branchId: string }) => {
      const { data } = await apiClient.delete(ENDPOINTS.branches.delete(brandId, branchId));
      return data;
    },
    onSuccess: (_data, variables) => {
      client.invalidateQueries({ queryKey: ["branches", variables.brandId] });
    }
  });
}
