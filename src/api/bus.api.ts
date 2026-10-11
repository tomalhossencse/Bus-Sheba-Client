import apiClient from "@/lib/apiClient";
import type { IBus } from "@/lib/types";
import type { ApiResponse } from "@/types";

export const getAllBuses = async (params?: {
  page?: number;
  limit?: number;
}) => {
  return apiClient<ApiResponse<IBus[]>>("/bus", {
    params: { page: 1, limit: 10, ...params },
  });
};

export const getMyBuses = async (): Promise<ApiResponse<IBus[]>> => {
  return apiClient<ApiResponse<IBus[]>>("/bus/my-buses");
};

export const createBus = async (payload: {
  name: string;
  registrationNo: string;
  busType: IBus["busType"];
  seatLayout?: IBus["seatLayout"];
  totalSeats: number;
}): Promise<ApiResponse<IBus>> => {
  return apiClient<ApiResponse<IBus>>("/bus/add", {
    method: "POST",
    body: payload,
  });
};

export const updateBus = async (
  id: string,
  payload: Partial<IBus>,
): Promise<ApiResponse<IBus>> => {
  return apiClient<ApiResponse<IBus>>(`/bus/update/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const setBusStatus = async (
  id: string,
  status: IBus["status"],
): Promise<ApiResponse<IBus>> => {
  const map: Record<IBus["status"], string> = {
    ACTIVE: "activate",
    INACTIVE: "deactivate",
    MAINTENANCE: "maintenance",
  };
  return apiClient<ApiResponse<IBus>>(`/bus/${map[status]}/${id}`, {
    method: "PATCH",
  });
};
