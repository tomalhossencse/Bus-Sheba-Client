import { z } from "zod";

const operatorPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Contain at least one uppercase letter")
  .regex(/[a-z]/, "Contain at least one lowercase letter")
  .regex(/[0-9]/, "Contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Contain at least one special character");

export const applyOperatorFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.email("Invalid email address"),
  password: operatorPasswordSchema,
  companyName: z.string().min(1, "Company name is required"),
  phone: z
    .string()
    .regex(
      /^(?:\+88|88)?(01[3-9]\d{8})$/,
      "Invalid BD phone number. Must be a valid 11-digit number.",
    ),
  nidNumber: z
    .string()
    .regex(
      /^(?:\d{10}|\d{13}|\d{17})$/,
      "Invalid NID number. Must be 10, 13, or 17 digits.",
    ),
  tradeLicenseNo: z
    .string()
    .regex(/^\d{5,15}$/, "Invalid Trade License. Must contain 5 to 15 digits."),
  businessRegistrationNo: z
    .string()
    .min(5, "Business Registration Number must be at least 5 characters long")
    .max(20, "Business Registration Number must be at most 20 characters long")
    .regex(
      /^[A-Za-z0-9\s-]{5,20}$/,
      "Invalid Business Registration number. Length should be 5-20 characters.",
    ),
  taxIdentificationNo: z
    .string()
    .regex(/^\d{12}$/, "Invalid TIN. Must be a valid 12-digit number."),
});

export const createBusFormSchema = z.object({
  name: z.string().trim().min(1, "Bus name is required"),
  registrationNo: z
    .string()
    .trim()
    .min(1, "Registration number is required")
    .regex(
      /^[A-Z\s-]+-[A-Z]{1,2}-\d{2}-\d{4}$/i,
      "Use a valid registration format, for example DHAKA-METRO-HA-11-2233",
    ),
  busType: z.enum(["AC", "NON_AC", "SLEEPER", "SEMI_SLEEPER"]),
  seatLayout: z.enum(["TWO_BY_TWO", "ONE_BY_TWO", "TWO_BY_ONE"]).optional(),
  totalSeats: z.coerce
    .number()
    .int("Seat count must be a whole number")
    .min(10, "Bus capacity must be at least 10 seats")
    .max(100, "Bus capacity cannot exceed 100 seats"),
});

export type CreateBusFormValues = z.input<typeof createBusFormSchema>;

export const createTripFormSchema = z
  .object({
    busId: z.string().uuid("Invalid bus ID"),
    routeId: z.string().uuid("Invalid route ID"),
    travelDate: z.string().min(1, "Travel date is required"),
    departureTime: z.string().min(1, "Departure time is required"),
    fare: z.coerce
      .number()
      .positive("Fare must be greater than 0")
      .max(50000, "Fare amount exceeds maximum limit"),
  })
  .refine(
    (data) => {
      if (!data.travelDate || !data.departureTime) return true;
      return (
        new Date(`${data.travelDate}T${data.departureTime}`).getTime() >
        Date.now()
      );
    },
    {
      message: "Departure time must be in the future",
      path: ["departureTime"],
    },
  );

export type CreateTripFormValues = z.input<typeof createTripFormSchema>;

export const combineDateTime = (date: string, time: string): string =>
  `${date}T${time}`;

export const formatISOLocal = (d: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
