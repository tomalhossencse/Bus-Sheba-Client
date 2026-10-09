export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "PASSENGER";
