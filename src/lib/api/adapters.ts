import type { PageableResponse, PaginatedResponse } from "@/types";

export function mapPageable<T>(payload: PageableResponse<T>): PaginatedResponse<T> {
  return {
    data: payload.content ?? [],
    total: payload.totalElements ?? 0,
    page: (payload.page ?? 0) + 1,
    pageSize: payload.size ?? 0
  };
}
