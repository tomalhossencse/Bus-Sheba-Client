import apiClient from "@/lib/apiClient";
import type { OperatorProfile } from "@/lib/types";
import type { ApiResponse, PaginatedData, VerifyEmailPayload } from "@/types";
import type { OperatorPayload } from "@/types/operator.type";

export const applyOperator = async (
  payload: OperatorPayload,
): Promise<ApiResponse<OperatorProfile>> => {
  const formData = new FormData();
  formData.append(
    "data",
    JSON.stringify({
      user: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      },
      operator: {
        companyName: payload.companyName,
        phone: payload.phone,
        nidNumber: payload.nidNumber,
        tradeLicenseNo: payload.tradeLicenseNo,
        businessRegistrationNo: payload.businessRegistrationNo,
        taxIdentificationNo: payload.taxIdentificationNo,
      },
    }),
  );
  formData.append("nidDocument", payload.nidDocument);
  formData.append("tradeLicenseDocument", payload.tradeLicenseDocument);
  payload.additionalDocuments.forEach((file) => {
    formData.append("additionalDocuments", file);
  });
  return apiClient<ApiResponse<OperatorProfile>>("/operator/apply", {
    method: "POST",
    body: formData,
  });
};

export const OperatorVerifyEmail = async (payload: VerifyEmailPayload) => {
  return apiClient("/operator/verify-email", { method: "POST", body: payload });
};

export const getAllOperators = async () => {
  return apiClient<ApiResponse<PaginatedData<OperatorProfile>>>("/operator", {
    params: { page: 1, limit: 50 },
  });
};

export const approve = async (
  operatorId: string,
  verificationStatus: "APPROVED" | "REJECTED",
  rejectReason?: string,
): Promise<ApiResponse<OperatorProfile>> => {
  return apiClient<ApiResponse<OperatorProfile>>("/operator/approve", {
    method: "PATCH",
    body: {
      operatorId,
      verificationStatus,
      rejectReason,
    },
  });
};
