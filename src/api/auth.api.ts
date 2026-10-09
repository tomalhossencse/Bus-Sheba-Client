import apiClient from "@/lib/apiClient";
import type { LoginPayload } from "@/types";

export function login(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function getMe() {
  return apiClient("/auth/me");
}

export function logout() {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}

export function googleLogin(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}
