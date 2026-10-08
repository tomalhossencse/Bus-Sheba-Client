import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, logout } from "@/api";

export function useGetme() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}
