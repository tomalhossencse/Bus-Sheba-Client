import apiClient from "@/lib/apiClient";
import type { ApiResponse, UserProfile } from "@/lib/types";
import type {
  LoginPayload,
  RegisterPayload,
  VerifyEmailPayload,
} from "@/types";

export function login(payload: LoginPayload) {
  return apiClient("/auth/login", { method: "POST", body: payload });
}

export function getMe(): Promise<ApiResponse<UserProfile>> {
  return apiClient("/auth/me");
}

export function logout() {
  return apiClient("/auth/logout", {
    method: "POST",
  });
}

export function googleLogin(payload: { idToken: string }) {
  return apiClient("/auth/google", { method: "POST", body: payload });
}

export const registerUser = async (payload: RegisterPayload) => {
  return apiClient("/auth/register", { method: "POST", body: payload });
};

export const verifyEmailOTP = async (payload: VerifyEmailPayload) => {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
};

export const forgetPassword = async (
  email: string,
): Promise<ApiResponse<null>> => {
  return apiClient<ApiResponse<null>>("/auth/forget-password", {
    method: "POST",
    body: { email },
  });
};

export const resetPassword = async (payload: {
  email: string;
  otp: string;
  newPassword: string;
}): Promise<ApiResponse<null>> => {
  return apiClient<ApiResponse<null>>("/auth/reset-password", {
    method: "POST",
    body: payload,
  });
};

export const changePassword = async (payload: {
  email: string;
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<null>> => {
  return apiClient<ApiResponse<null>>("/auth/change-password", {
    method: "POST",
    body: payload,
  });
};
