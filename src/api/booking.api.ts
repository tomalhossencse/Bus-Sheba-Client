import apiClient from "@/lib/apiClient";
import type { BookingStatus, IBooking } from "@/lib/types";
import type { ApiResponse } from "@/types/api.type";

export interface CreateBookingPayload {
  tripId: string;
  fromStopId: string;
  toStopId: string;
  tripSeatIds: string[];
  passengers: Array<{ name: string; phone: string; email: string }>;
}

export const getAllBookings = async (params?: {
  page?: number;
  limit?: number;
}) => {
  return apiClient<ApiResponse<IBooking[]>>("/booking", {
    params: { page: 1, limit: 10, ...params },
  });
};

export const createBooking = async (
  payload: CreateBookingPayload,
): Promise<ApiResponse<IBooking>> => {
  return apiClient<ApiResponse<IBooking>>("/booking/create", {
    method: "POST",
    body: payload,
  });
};

export const getMyBookings = async (params?: {
  status?: BookingStatus;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<IBooking[]>> => {
  return apiClient<ApiResponse<IBooking[]>>("/booking/my", {
    params: { page: 1, limit: 20, ...params },
  });
};

export const getBookingById = async (
  id: string,
): Promise<ApiResponse<IBooking>> => {
  return apiClient<ApiResponse<IBooking>>(`/booking/${id}`);
};
