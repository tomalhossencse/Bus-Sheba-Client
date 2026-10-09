import z from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[a-z]/, "Must contain a lowercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[^A-Za-z0-9]/, "Must contain a special character");

export const loginZodSchema = z.object({
  email: z.email(),
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be under 50 characters"),
  email: z.email("Please enter a valid email"),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: z.email("Please enter a valid email"),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
});
