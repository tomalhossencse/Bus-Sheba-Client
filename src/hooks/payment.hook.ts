import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPayment, getMyPayments } from "@/api";
import { extractApiError } from "@/lib/api";
import { toPaginatedResult } from "@/lib/pagination";
import type { PaymentStatus } from "@/lib/types";
import { queryKeys } from "./auth.hook";

export const useMyPayments = (page = 1, limit = 10, status?: PaymentStatus) => {
  return useQuery({
    queryKey: [...queryKeys.myPayments, page, limit, status],
    queryFn: async () => {
      const result = await getMyPayments({ page, limit, status });
      return toPaginatedResult(result.data, result.meta, limit);
    },
    staleTime: 30 * 1000,
  });
};

const PAYMENT_FILTERS: Array<PaymentStatus | "all"> = [
  "all",
  "PAID",
  "PENDING",
  "FAILED",
  "CANCELLED",
  "REFUND_PENDING",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
];

export const usePaymentCounts = () => {
  const results = useQueries({
    queries: PAYMENT_FILTERS.map((status) => ({
      queryKey: [...queryKeys.myPayments, "count", status],
      queryFn: async () => {
        const result = await getMyPayments({
          page: 1,
          limit: 1,
          status: status === "all" ? undefined : status,
        });
        return result.meta?.total ?? result.data.length;
      },
      staleTime: 30 * 1000,
    })),
  });

  return PAYMENT_FILTERS.reduce<Record<string, number | undefined>>(
    (counts, status, index) => {
      counts[status] = results[index].data;
      return counts;
    },
    {},
  );
};

export const usePaymentTotal = (status?: PaymentStatus) => {
  return useQuery({
    queryKey: [...queryKeys.myPayments, "total", status],
    queryFn: async () => {
      const limit = 100;
      const firstPage = await getMyPayments({ page: 1, limit, status });
      const totalPages = firstPage.meta?.totalPages || 1;
      const remainingPages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, index) =>
          getMyPayments({ page: index + 2, limit, status }),
        ),
      );

      return [firstPage, ...remainingPages]
        .flatMap((result) => result.data)
        .reduce((total, payment) => total + Number(payment.amount), 0);
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
