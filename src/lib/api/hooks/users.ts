import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { ApiRole, PageableResponse, User } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type UsersQuery = {
  search?: string;
  role?: "STUDENT" | "MODERATOR" | "ADMIN";
  page?: number;
  pageSize?: number;
};

type UserResponse = {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: ApiRole;
  studentStatusVerified?: boolean;
  enabled: boolean;
  brandId?: string | null;
  createdDate?: string;
  lastModifiedDate?: string | null;
  verifiedDate?: string | null;
  first_name?: string;
  last_name?: string;
  student_status_verified?: boolean;
  brand_id?: string | null;
  created_date?: string;
  last_modified_date?: string | null;
  verified_date?: string | null;
};

function mapUser(user: UserResponse): User {
  return {
    id: user.id,
    firstName: user.firstName ?? user.first_name ?? "",
    lastName: user.lastName ?? user.last_name ?? "",
    email: user.email,
    role: user.role,
    brandId: user.brandId ?? user.brand_id ?? null,
    studentStatusVerified: user.studentStatusVerified ?? user.student_status_verified ?? false,
    enabled: user.enabled,
    createdDate: user.createdDate ?? user.created_date ?? "",
    lastModifiedDate: user.lastModifiedDate ?? user.last_modified_date ?? null,
    verifiedDate: user.verifiedDate ?? user.verified_date ?? null
  };
}

export function useUsers(params: UsersQuery) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<UserResponse>>(ENDPOINTS.users.list, {
        params: {
          search: params.search,
          role: params.role,
          page: params.page ? params.page - 1 : 0,
          size: params.pageSize ?? 20
        }
      });
      const mapped = mapPageable(data);
      return {
        ...mapped,
        data: mapped.data.map(mapUser)
      };
    }
  });
}

export function useUpdateUserEnabled() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, enabled, brandId }: { user: User; enabled: boolean; brandId?: string | null }) => {
      const payload = omitUndefined({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        brandId: brandId ?? user.brandId ?? undefined,
        enabled
      });
      const { data } = await apiClient.put<UserResponse>(ENDPOINTS.users.update(user.id), payload);
      return mapUser(data);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useCreateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      firstName: string;
      lastName: string;
      email: string;
      role: ApiRole;
      password?: string;
      enabled?: boolean;
      brandId?: string | null;
    }) => {
      const body = omitUndefined({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
        password: payload.password,
        brandId: payload.brandId ?? undefined,
        enabled: payload.enabled
      });
      const { data } = await apiClient.post<UserResponse>(ENDPOINTS.users.create, body);
      return mapUser(data);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["users"] });
    }
  });
}

export function useUpdateUser() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: {
      firstName: string;
      lastName: string;
      email: string;
      role: ApiRole;
      enabled: boolean;
      brandId?: string | null;
    } }) => {
      const body = omitUndefined({
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        role: payload.role,
        brandId: payload.brandId ?? undefined,
        enabled: payload.enabled
      });
      const { data } = await apiClient.put<UserResponse>(ENDPOINTS.users.update(id), body);
      return mapUser(data);
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
