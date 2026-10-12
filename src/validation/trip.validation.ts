import { z } from "zod";

const tripFieldsSchema = z.object({
  busId: z.string().uuid("Invalid bus ID"),
  routeId: z.string().uuid("Invalid route ID"),
  travelDate: z.coerce.date("Invalid date-time"),
  departureTime: z.coerce.date("Invalid date-time"),
  arrivalTime: z.coerce.date("Invalid date-time"),
  fare: z.number().positive("Fare must be greater than 0").max(50000),
});

export const createTripSchema = tripFieldsSchema
  .refine((data) => data.departureTime.getTime() > Date.now(), {
    message: "Departure time must be in the future",
    path: ["departureTime"],
  })
  .refine((data) => data.arrivalTime > data.departureTime, {
    message: "Arrival time must be after departure time",
    path: ["arrivalTime"],
  });

export const updateTripSchema = tripFieldsSchema
  .partial()
  .refine(
    (data) => !data.departureTime || data.departureTime.getTime() > Date.now(),
    {
      message: "Departure time must be in the future",
      path: ["departureTime"],
    },
  )
  .refine(
    (data) =>
      !data.arrivalTime ||
      !data.departureTime ||
      data.arrivalTime > data.departureTime,
    {
      message: "Arrival time must be after departure time",
      path: ["arrivalTime"],
    },
  );

export type CreateTripPayload = z.infer<typeof createTripSchema>;
export type UpdateTripPayload = z.infer<typeof updateTripSchema>;
