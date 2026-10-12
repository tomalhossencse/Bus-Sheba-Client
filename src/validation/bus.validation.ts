import { z } from "zod";

export const busTypeSchema = z.enum([
  "AC",
  "NON_AC",
  "SLEEPER",
  "SEMI_SLEEPER",
]);

export const seatLayoutSchema = z.enum([
  "TWO_BY_TWO",
  "ONE_BY_TWO",
  "TWO_BY_ONE",
]);

export const createBusSchema = z.object({
  name: z.string().trim().min(1, "Bus name cannot be empty"),
  registrationNo: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(
      /^[A-Z\s-]+-[A-Z]{1,2}-\d{2}-\d{4}$/i,
      "Invalid bus registration number format",
    ),
  busType: busTypeSchema,
  seatLayout: seatLayoutSchema.optional(),
  totalSeats: z
    .number()
    .int("Total seats must be a whole number")
    .min(10, "Bus capacity must be at least 10 seats")
    .max(100, "Bus capacity cannot exceed 100 seats"),
});

export const updateBusSchema = createBusSchema.partial().omit({
  registrationNo: true,
});

export type CreateBusPayload = z.infer<typeof createBusSchema>;
export type UpdateBusPayload = z.infer<typeof updateBusSchema>;
