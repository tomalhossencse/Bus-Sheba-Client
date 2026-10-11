import apiClient from "@/lib/apiClient";
import type { IRoute } from "@/lib/types";
import type { ApiResponse, PaginatedData } from "@/types";

export const createRoute = async (payload: {
  name: string;
  source: string;
  destination: string;
  distanceKm: number;
  estimatedMinutes: number;
  routeStops?: Array<{
    stopName: string;
    arrivalMinutes: number;
    departureMinutes: number;
  }>;
}): Promise<ApiResponse<IRoute>> => {
  return apiClient<ApiResponse<IRoute>>("/route/add", {
    method: "POST",
    body: payload,
  });
};

export const updateRoute = async (
  id: string,
  payload: Partial<IRoute>,
): Promise<ApiResponse<IRoute>> => {
  return apiClient<ApiResponse<IRoute>>(`/route/update/${id}`, {
    method: "PUT",
    body: payload,
  });
};

export const getAllRoutes = async (params?: {
  searchTerm?: string;
  page?: number;
  limit?: number;
}) => {
  return apiClient<ApiResponse<PaginatedData<IRoute>>>("/route", {
    params: { page: 1, limit: 50, ...params },
  });
};

export const setActiveRoute = async (
  id: string,
  active: boolean,
): Promise<ApiResponse<IRoute>> => {
  return apiClient<ApiResponse<IRoute>>(
    active ? `/route/activate/${id}` : `/route/deactivate/${id}`,
    {
      method: "PATCH",
    },
  );
};
