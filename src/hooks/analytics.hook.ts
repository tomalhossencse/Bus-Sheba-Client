import { useQuery } from "@tanstack/react-query";
import { adminAnalytics, operatorAnalytics, passengerAnalytics } from "@/api";
import { queryKeys } from "./auth.hook";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: queryKeys.analytics.admin,
    queryFn: adminAnalytics,
  });
}

export const useOperatorAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.analytics.operator,
    queryFn: async () => {
      const result = await operatorAnalytics();
      return result.data;
    },
  });
};

export const usePassengerAnalytics = () => {
  return useQuery({
    queryKey: queryKeys.analytics.passenger,
    queryFn: async () => {
      const result = await passengerAnalytics();
      return result.data;
    },
  });
};
