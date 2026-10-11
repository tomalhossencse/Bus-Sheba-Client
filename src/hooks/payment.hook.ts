import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPayment, getMyPayments } from "@/api";
import { extractApiError } from "@/lib/api";
import { toPaginatedResult } from "@/lib/pagination";
import { queryKeys } from "./auth.hook";

export const useMyPayments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.myPayments, page, limit],
    queryFn: async () => {
      const result = await getMyPayments({ page, limit });
      return toPaginatedResult(result.data, result.meta, limit);
    },
    staleTime: 30 * 1000,
  });
};

export const useCreatePayment = () => {
  return useMutation({
    mutationFn: (bookingId: string) => createPayment(bookingId),
    onError: (error: unknown) => toast.error(extractApiError(error)),
  });
};
