import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import apiClient from "@/lib/api/axios";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { Discount, PageableResponse } from "@/types";
import { mapPageable } from "@/lib/api/adapters";
import { omitUndefined } from "@/lib/api/serializers";

export type DiscountsQuery = {
  search?: string;
  page?: number;
  pageSize?: number;
  brandId?: string;
  categoryId?: string;
  isActive?: boolean;
  publicOnly?: boolean;
};

export function useDiscounts(params: DiscountsQuery) {
  return useQuery({
    queryKey: ["discounts", params],
    queryFn: async () => {
      if (params.publicOnly) {
        const { data } = await apiClient.get<PageableResponse<Discount>>(ENDPOINTS.discounts.publicList, {
          params: {
            search: params.search,
            category_id: params.categoryId,
            brand_id: params.brandId,
            page: params.page ? params.page - 1 : 0,
            size: params.pageSize ?? 10
          }
        });
        return mapPageable(data);
      }

      const { data } = await apiClient.get<PageableResponse<Discount>>(ENDPOINTS.discounts.list, {
        params: {
          search: params.search,
          category_id: params.categoryId,
          brand_id: params.brandId,
          is_active: params.isActive,
          page: params.page ? params.page - 1 : 0,
          size: params.pageSize ?? 20
        }
      });
      return mapPageable(data);
    }
  });
}

export function useCreateDiscount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Discount>) => {
      const { data } = await apiClient.post<Discount>(ENDPOINTS.discounts.create, normalizeDealPayload(payload));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["discounts"] })
  });
}

export function useUpdateDiscount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Discount> }) => {
      const { data } = await apiClient.put<Discount>(ENDPOINTS.discounts.update(id), normalizeDealPayload(payload));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["discounts"] })
  });
}

export function useDeleteDiscount() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(ENDPOINTS.discounts.delete(id));
      return data;
    },
    onSuccess: () => client.invalidateQueries({ queryKey: ["discounts"] })
  });
}

function normalizeDealPayload(payload: Partial<Discount>) {
  const expiryDate = payload.expiryDate
    ? payload.expiryDate.includes("T")
      ? payload.expiryDate
      : new Date(payload.expiryDate).toISOString()
    : undefined;

  return omitUndefined({
    title: payload.title,
    description: payload.description,
    promo_code: payload.promoCode,
    expiry_date: expiryDate,
    terms: payload.terms,
    usage_steps: payload.usageSteps,
    verified_only: payload.verifiedOnly ?? false,
    brand_id: payload.brand?.id ?? (payload as { brandId?: string }).brandId,
    category_id: payload.category?.id ?? (payload as { categoryId?: string }).categoryId,
    attachment_id: (payload as { attachmentId?: string }).attachmentId
  });
}
