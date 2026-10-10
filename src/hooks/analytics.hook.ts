import { useQuery } from "@tanstack/react-query";
import { adminAnalytics } from "@/api";

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: adminAnalytics,
  });
}
