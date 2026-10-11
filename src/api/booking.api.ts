import apiClient from "@/lib/apiClient";
import type { IBooking } from "@/lib/types";
import type { ApiResponse } from "@/types/api.type";

export const getAllBookings = async () => {
  return apiClient<ApiResponse<IBooking[]>>("/booking", {
    params: { page: 1, limit: 50 },
  });
};
