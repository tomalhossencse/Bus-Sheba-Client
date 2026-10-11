import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addRouteStop, deleteRouteStop, updateRouteStop } from "@/api";
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
      toast.error((error as Error).message || "Failed to add stop"),
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
      toast.error((error as Error).message || "Failed to update stop"),
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
      toast.error((error as Error).message || "Failed to remove stop"),
  });
};
