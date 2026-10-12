import { z } from "zod";

const minutesSchema = z
  .number()
  .int("Minutes must be a whole number")
  .min(0, "Minutes cannot be negative");

export const routeStopFormSchema = z
  .object({
    stopId: z.string().uuid("Invalid stop ID").optional(),
    stopName: z.string().trim().min(1, "Stop name is required"),
    arrivalMinutes: minutesSchema,
    departureMinutes: minutesSchema,
  })
  .refine((data) => data.departureMinutes >= data.arrivalMinutes, {
    message: "Departure cannot be earlier than arrival",
    path: ["departureMinutes"],
  });

export const addRouteStopSchema = z
  .object({
    routeId: z.string().uuid("Invalid route ID"),
    stopName: z.string().trim().min(1, "Stop name is required"),
    stopOrder: z.number().int().min(1, "Stop order must be 1 or greater"),
    arrivalMinutes: minutesSchema,
    departureMinutes: minutesSchema,
  })
  .refine((data) => data.departureMinutes >= data.arrivalMinutes, {
    message: "Departure cannot be earlier than arrival",
    path: ["departureMinutes"],
  });

export const updateRouteStopSchema = z
  .object({
    stopName: z.string().trim().min(1).optional(),
    stopOrder: z.number().int().min(1).optional(),
    arrivalMinutes: minutesSchema.optional(),
    departureMinutes: minutesSchema.optional(),
  })
  .refine(
    (data) =>
      data.arrivalMinutes === undefined ||
      data.departureMinutes === undefined ||
      data.departureMinutes >= data.arrivalMinutes,
    {
      message: "Departure cannot be earlier than arrival",
      path: ["departureMinutes"],
    },
  );

export type AddRouteStopPayload = z.infer<typeof addRouteStopSchema>;
export type UpdateRouteStopPayload = z.infer<typeof updateRouteStopSchema>;
