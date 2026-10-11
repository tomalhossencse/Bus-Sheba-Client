import { useQuery } from "@tanstack/react-query";
import { getAllBookings } from "@/api/booking.api";
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
