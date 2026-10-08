import apiClient from "@/lib/apiClient";

export function getMe() {
  return apiClient("/auth/me");
}

export function logout() {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}
