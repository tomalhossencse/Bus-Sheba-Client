import apiClient from "@/lib/apiClient";
import type { AdminStats } from "@/lib/types";
import type { ApiResponse } from "@/types";

export function adminAnalytics() {
  return apiClient<ApiResponse<AdminStats>>("/analytics/admin");
}
