import apiClient from "@/lib/apiClient";
import type { Payment, PaymentStatus } from "@/lib/types";
import type { ApiResponse } from "@/types/api.type";

export const createPayment = (
  bookingId: string,
): Promise<ApiResponse<{ paymentUrl: string; bookingId: string }>> => {
  return apiClient<ApiResponse<{ paymentUrl: string; bookingId: string }>>(
    "/payment/create",
    {
      method: "POST",
      body: { bookingId },
    },
  );
};

export const getMyPayments = (params?: {
  page?: number;
  limit?: number;
  status?: PaymentStatus;
}): Promise<ApiResponse<Payment[]>> => {
  return apiClient<ApiResponse<Payment[]>>("/payment/my", {
    method: "GET",
    params: { page: 1, limit: 10, ...params },
  });
};
