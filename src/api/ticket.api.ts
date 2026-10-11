import apiClient from "@/lib/apiClient";
import type { ITicket, TicketCheckResponse } from "@/lib/types";
import type { ApiResponse } from "@/types";

export const checkTicket = async (
  ticketNumber: string,
): Promise<ApiResponse<TicketCheckResponse>> => {
  return apiClient<ApiResponse<TicketCheckResponse>>(
    `/tickets/verify/${encodeURIComponent(ticketNumber)}`,
  );
};

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
