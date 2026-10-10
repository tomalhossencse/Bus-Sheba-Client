import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMe,
  googleLogin,
  login,
  logout,
  registerUser,
  verifyEmailOTP,
} from "@/api";

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

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

export function useVerifyEmailOTP() {
  return useMutation({
    mutationFn: verifyEmailOTP,
  });
}

export const queryKeys = {
  me: ["me"] as const,
  routes: ["routes"] as const,
  route: (id: string) => ["route", id] as const,
  stops: (routeId: string) => ["route", routeId, "stops"] as const,
  buses: ["buses"] as const,
  myBuses: ["my-buses"] as const,
  trips: ["trips"] as const,
  trip: (id: string) => ["trip", id] as const,
  tripSeats: (id: string) => ["trip", id, "seats"] as const,
  myBookings: (status: string) => ["bookings", "my", status] as const,
  allBookings: ["bookings", "all"] as const,
  myPayments: ["payments", "my"] as const,
  operators: ["operators"] as const,
  analytics: {
    admin: ["analytics", "admin"] as const,
    operator: ["analytics", "operator"] as const,
    passenger: ["analytics", "passenger"] as const,
  },
};
