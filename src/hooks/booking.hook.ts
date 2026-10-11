import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
} from "@/api/booking.api";
import { extractApiError } from "@/lib/api";
import { queryKeys } from "./auth.hook";

export const useAllBookings = () => {
  return useQuery({
    queryKey: queryKeys.allBookings,
    queryFn: async () => {
      const result = await getAllBookings();
      return result.data;
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

export const useMyBookings = (status?: string) => {
  return useQuery({
    queryKey: queryKeys.myBookings(status || "all"),
    queryFn: async () => {
      const result = await getMyBookings(status ? { status } : {});
      return result.data;
    },
  });
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
