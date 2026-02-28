import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { PageableResponse, User } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type UsersQuery = {
  search?: string;
  role?: "STUDENT" | "MODERATOR" | "ADMIN";
  page?: number;
  pageSize?: number;
};

export function useUsers(params: UsersQuery) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const { data } = await apiClient.get<PageableResponse<User>>(ENDPOINTS.users.list, {
        params: {
          search: params.search,
          role: params.role,
          page: params.page ? params.page - 1 : 0,
          size: params.pageSize ?? 20
        }
      });
      return mapPageable(data);
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
