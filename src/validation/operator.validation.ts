import { z } from "zod";

export const createBusFormSchema = z.object({
  name: z.string().trim().min(2, "Bus name is required"),
  registrationNo: z.string().trim().min(5, "Enter a valid registration number"),
  busType: z.enum(["AC", "NON_AC", "SLEEPER", "SEMI_SLEEPER"]),
  seatLayout: z.enum(["TWO_BY_TWO", "ONE_BY_TWO", "TWO_BY_ONE"]),
  totalSeats: z.coerce.number().int().min(1, "Must have at least 1 seat"),
});

export type CreateBusFormValues = z.input<typeof createBusFormSchema>;

export const createTripFormSchema = z.object({
  busId: z.string().min(1, "Bus is required"),
  routeId: z.string().min(1, "Route is required"),
  travelDate: z.string().min(1, "Travel date is required"),
  departureTime: z.string().min(1, "Departure time is required"),
  fare: z.coerce.number().min(1, "Fare must be greater than 0"),
});

export type CreateTripFormValues = z.input<typeof createTripFormSchema>;

export const combineDateTime = (date: string, time: string): string =>
  `${date}T${time}`;

export const formatISOLocal = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
