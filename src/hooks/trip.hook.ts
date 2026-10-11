import { useQuery } from "@tanstack/react-query";
import { getAllTrips, search } from "@/api";

export const useTripsSearch = (params: {
  source?: string;
  destination?: string;
  date?: string;
}) => {
  return useQuery({
    queryKey: ["trip-search", params],
    queryFn: () => search(params),
    enabled: Boolean(params.source && params.destination),
    staleTime: 30 * 1000,
  });
};

export const useAllTrips = () => {
  return useQuery({
    queryKey: ["all-trips"],
    queryFn: async () => {
      const result = await getAllTrips();
      return result.data;
    },
  });
};
