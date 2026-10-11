import { FetchError } from "ofetch";
import type { ApiResponse } from "./types";

export class ApiError extends Error {
  statusCode: number;
  success: boolean;

  constructor(message: string, statusCode = 500, success = false) {
    super(message);
    this.statusCode = statusCode;
    this.success = success;
  }
}

export const extractApiError = (error: unknown): string => {
  if (error instanceof FetchError) {
    const data = error.data as
      | (Partial<ApiResponse<unknown>> & {
          error?: { message?: string } | string;
          errors?: Array<{ message?: string } | string>;
        })
      | undefined;
    const nestedMessage =
      typeof data?.error === "string"
        ? data.error
        : data?.error?.message ||
          data?.errors?.find((item) =>
            typeof item === "string" ? item : item?.message,
          );
    return (
      data?.message ||
      (typeof nestedMessage === "string" ? nestedMessage : undefined) ||
      error.message ||
      "Something went wrong"
    );
  }

  return error instanceof Error ? error.message : "Something went wrong";
};
