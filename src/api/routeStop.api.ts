import apiClient from "@/lib/apiClient";
import type { RouteStop } from "@/lib/types";
import type { ApiResponse } from "@/types";

export const addRouteStop = async (
  routeId: string,
  payload: {
    stopName: string;
    stopOrder: number;
    arrivalMinutes: number;
    departureMinutes: number;
  },
): Promise<ApiResponse<RouteStop>> => {
  return apiClient<ApiResponse<RouteStop>>("/route-stop/add", {
    method: "POST",
    body: {
      routeId,
      ...payload,
    },
  });
};

export const updateRouteStop = async (
  stopId: string,
  payload: Partial<RouteStop>,
): Promise<ApiResponse<RouteStop>> => {
  return apiClient<ApiResponse<RouteStop>>(`/route-stop/update/${stopId}`, {
    method: "PUT",
    body: payload,
  });
};

export const deleteRouteStop = async (
  stopId: string,
): Promise<ApiResponse<RouteStop>> => {
  return apiClient<ApiResponse<RouteStop>>(`/route-stop/deactivate/${stopId}`, {
    method: "PATCH",
  });
};
