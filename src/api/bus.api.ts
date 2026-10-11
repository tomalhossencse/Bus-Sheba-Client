import apiClient from "@/lib/apiClient";
import type { IBus } from "@/lib/types";
import type { ApiResponse } from "@/types";

export const getAllBuses = async () => {
  return apiClient<ApiResponse<IBus[]>>("/bus", {
    params: { page: 1, limit: 50 },
  });
};
