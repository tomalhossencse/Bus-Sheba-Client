export interface LoginPayload {
  email: string;
  password: string;
}
export type UserRole = "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "PASSENGER";
