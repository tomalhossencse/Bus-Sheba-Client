import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addRouteStop,
  deleteRouteStop,
  getRouteStops,
  updateRouteStop,
} from "@/api";
import { extractApiError } from "@/lib/api";
import { queryKeys } from "./auth.hook";

export const useCreateRouteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      routeId,
      ...payload
    }: {
      routeId: string;
      stopName: string;
      stopOrder: number;
      arrivalMinutes: number;
      departureMinutes: number;
    }) => addRouteStop(routeId, payload),
    onSuccess: (result) => {
      toast.success(result.message || "Stop added");
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
    },
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to add stop"),
  });
};

export const useUpdateRouteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      stopId,
      ...payload
    }: {
      stopId: string;
      stopName?: string;
      stopOrder?: number;
      arrivalMinutes?: number;
      departureMinutes?: number;
    }) => updateRouteStop(stopId, payload),
    onSuccess: (result) => {
      toast.success(result.message || "Stop updated");
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
    },
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to update stop"),
  });
};

export const useDeleteRouteStop = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (stopId: string) => deleteRouteStop(stopId),
    onSuccess: (result) => {
      toast.success(result.message || "Stop removed");
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
    },
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to remove stop"),
  });
};

export const useRouteStop = (routeId: string) => {
  return useQuery({
    queryKey: queryKeys.stops(routeId),
    queryFn: async () => {
      const result = await getRouteStops(routeId);
      return result.data;
    },
    enabled: Boolean(routeId),
    staleTime: 5 * 60 * 1000,
  });
};
