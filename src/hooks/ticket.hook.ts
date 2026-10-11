import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { previewTicketByOperator, verifyTicket } from "@/api";
import { extractApiError } from "@/lib/api";

export const useVerifyTicket = () => {
  return useMutation({
    mutationFn: (ticketNumber: string) => verifyTicket(ticketNumber),
    onSuccess: (result) => toast.success(result.message || "Ticket verified"),
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to verify ticket"),
  });
};

export const usePreviewOperatorTicket = () => {
  return useMutation({
    mutationFn: (ticketNumber: string) => previewTicketByOperator(ticketNumber),
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to preview ticket"),
  });
};
