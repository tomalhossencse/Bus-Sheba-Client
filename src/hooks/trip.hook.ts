import { useQuery } from "@tanstack/react-query";
import { search } from "@/api";

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
