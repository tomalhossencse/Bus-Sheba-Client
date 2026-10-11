import type { PaginatedResult, PaginationMeta } from "@/types";

export function toPaginatedResult<T>(
  data: T[],
  meta: PaginationMeta | undefined,
  limit: number,
): PaginatedResult<T> {
  return {
    data,
    meta: meta || {
      page: 1,
      limit,
      total: data.length,
      totalPages: data.length ? 1 : 0,
    },
  };
}
