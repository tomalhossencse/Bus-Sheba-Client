import { ofetch } from "ofetch";

const Base_URL =
  typeof window === "undefined"
    ? `${process.env.BACKEND_API_URL}/api/v1`
    : "/api/v1";

const apiClient = ofetch.create({
  baseURL: Base_URL,
  credentials: "include",
});

export default apiClient;
