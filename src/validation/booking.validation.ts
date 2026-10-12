import { z } from "zod";

export const MAX_SEATS_PER_BOOKING = 5;

export const THRASHHOLD = MAX_SEATS_PER_BOOKING;

export const bookingPassengerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Passenger name must be at least 3 characters"),
  phone: z
    .string()
    .regex(
      /^(?:\+88|88)?(01[3-9]\d{8})$/,
      "Please enter a valid BD phone number",
    ),
  email: z.email("Please enter a valid email"),
});

export const createBookingSchema = z
  .object({
    tripId: z.string().uuid("Invalid trip ID"),
    fromStopId: z.string().uuid("Invalid boarding stop ID"),
    toStopId: z.string().uuid("Invalid dropping stop ID"),
    tripSeatIds: z
      .array(z.string().uuid("Invalid seat ID"))
      .min(1, "Select at least one seat"),
    passengers: z
      .array(bookingPassengerSchema)
      .min(1, "At least one passenger is required"),
  })
  .refine((data) => data.fromStopId !== data.toStopId, {
    message: "Source stop and destination stop cannot be the same",
    path: ["toStopId"],
  })
  .refine((data) => data.tripSeatIds.length === data.passengers.length, {
    message: "Passenger count must match selected seat count",
    path: ["passengers"],
  });
