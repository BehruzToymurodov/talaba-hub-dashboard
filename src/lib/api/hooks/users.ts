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
  first_name: string;
  last_name: string;
  email: string;
  role: ApiRole;
  student_status_verified: boolean;
  enabled: boolean;
  created_date: string;
  last_modified_date?: string | null;
  verified_date?: string | null;
};

function mapUser(user: UserResponse): User {
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    role: user.role,
    studentStatusVerified: user.student_status_verified,
    enabled: user.enabled,
    createdDate: user.created_date,
    lastModifiedDate: user.last_modified_date ?? null,
    verifiedDate: user.verified_date ?? null
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
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        role: user.role,
        // TODO: Provide brandId for moderator users if required by backend.
        brand_id: brandId ?? undefined,
        enabled
      });
      const { data } = await apiClient.put<User>(ENDPOINTS.users.update(user.id), payload);
      return data;
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
        first_name: payload.firstName,
        last_name: payload.lastName,
        email: payload.email,
        role: payload.role,
        brand_id: payload.brandId ?? undefined,
        enabled: payload.enabled
      });
      const { data } = await apiClient.put<User>(ENDPOINTS.users.update(id), body);
      return data;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["users"] });
    }
  });
}
