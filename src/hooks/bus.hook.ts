import { useQuery } from "@tanstack/react-query";
import { getAllBuses } from "@/api";
import { queryKeys } from "./auth.hook";

export const useBuses = () => {
  return useQuery({
    queryKey: queryKeys.buses,
    queryFn: async () => {
      const result = await getAllBuses();
      return result.data.data;
    },
  });
};
