import apiClient from "@/lib/apiClient";
import type { ITicket } from "@/lib/types";
import type { ApiResponse } from "@/types";

export const previewTicketByOperator = async (
  ticketNumber: string,
): Promise<ApiResponse<ITicket>> => {
  return apiClient<ApiResponse<ITicket>>(
    `/tickets/operator/${encodeURIComponent(ticketNumber)}`,
  );
};

export const verifyTicket = async (
  ticketNumber: string,
): Promise<ApiResponse<ITicket>> => {
  return apiClient<ApiResponse<ITicket>>(
    `/tickets/verify/${encodeURIComponent(ticketNumber)}`,
  );
};
