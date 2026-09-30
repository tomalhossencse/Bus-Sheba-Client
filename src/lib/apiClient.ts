import { ofetch } from "ofetch";

const Base_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiClient = ofetch.create({
  baseURL: Base_URL,
  credentials: "include",
});

export default apiClient;
