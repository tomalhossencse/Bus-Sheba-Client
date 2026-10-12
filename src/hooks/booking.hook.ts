import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
} from "@/api/booking.api";
import { extractApiError } from "@/lib/api";
import { toPaginatedResult } from "@/lib/pagination";
import type { BookingStatus } from "@/lib/types";
import { queryKeys } from "./auth.hook";

export const useAllBookings = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.allBookings, page, limit],
    queryFn: async () => {
      const result = await getAllBookings({ page, limit });
      return toPaginatedResult(result.data, result.meta, limit);
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: (result) => {
      toast.success(result.message || "Booking created");
      queryClient.invalidateQueries({ queryKey: queryKeys.myBookings("all") });
      queryClient.invalidateQueries({ queryKey: queryKeys.allBookings });
    },
    onError: (error: unknown) => toast.error(extractApiError(error)),
  });
};

export const useMyBookings = (status?: BookingStatus, page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.myBookings(status || "all"), page, limit],
    queryFn: async () => {
      const result = await getMyBookings({ status, page, limit });
      return toPaginatedResult(result.data, result.meta, limit);
    },
  });
};

const BOOKING_FILTERS: Array<BookingStatus | "all"> = [
  "all",
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
];

export const useBookingCounts = () => {
  const results = useQueries({
    queries: BOOKING_FILTERS.map((status) => ({
      queryKey: [...queryKeys.myBookings("count"), status],
      queryFn: async () => {
        const result = await getMyBookings({
          page: 1,
          limit: 1,
          status: status === "all" ? undefined : status,
        });
        return result.meta?.total ?? result.data.length;
      },
      staleTime: 30 * 1000,
    })),
  });

  return BOOKING_FILTERS.reduce<Record<string, number | undefined>>(
    (counts, status, index) => {
      counts[status] = results[index].data;
      return counts;
    },
    {},
  );
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => {
      const result = await getBookingById(bookingId);
      return result.data;
    },
    enabled: Boolean(bookingId),
  });
};
