import { z } from "zod";

export const createPaymentSchema = z.object({
  bookingId: z.string().uuid("Invalid booking ID"),
});

export type CreatePaymentPayload = z.infer<typeof createPaymentSchema>;
