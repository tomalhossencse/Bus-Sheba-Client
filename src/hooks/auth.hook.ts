import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, googleLogin, login, logout } from "@/api";

export function useLogin() {
  return useMutation({
    mutationFn: login,
  });
}

export function useGetme() {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: logout,
  });
}

export function useGoogleLogin() {
  return useMutation({
    mutationFn: googleLogin,
  });
}
