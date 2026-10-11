import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPayment, getMyPayments } from "@/api";
import { extractApiError } from "@/lib/api";
import { queryKeys } from "./auth.hook";

export const useMyPayments = () => {
  return useQuery({
    queryKey: queryKeys.myPayments,
    queryFn: async () => {
      const result = await getMyPayments();
      return result.data;
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
