import apiClient from "@/lib/apiClient";
import type { AdminStats, OperatorStats, PassengerStats } from "@/lib/types";
import type { ApiResponse } from "@/types";

export function adminAnalytics() {
  return apiClient<ApiResponse<AdminStats>>("/analytics/admin");
}

export function operatorAnalytics() {
  return apiClient<ApiResponse<OperatorStats>>("/analytics/operator");
}

export function passengerAnalytics() {
  return apiClient<ApiResponse<PassengerStats>>("/analytics/passenger");
}
