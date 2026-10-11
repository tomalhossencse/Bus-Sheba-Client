import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createBus, getAllBuses, getMyBuses, setBusStatus } from "@/api";
import type { IBus } from "@/lib/types";
import { queryKeys } from "./auth.hook";

export const useBuses = () => {
  return useQuery({
    queryKey: queryKeys.buses,
    queryFn: async () => {
      const result = await getAllBuses();
      return result.data.data;
    },
  });
};

export const useMyBuses = () => {
  return useQuery({
    queryKey: queryKeys.myBuses,
    queryFn: async () => {
      const result = await getMyBuses();
      return result.data;
    },
  });
};

export const useCreateBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBus,
    onSuccess: (result) => {
      toast.success(result.message || "Bus added");
      queryClient.invalidateQueries({ queryKey: queryKeys.myBuses });
    },
    onError: (error: unknown) =>
      toast.error((error as Error).message || "Failed to add bus"),
  });
};

export const useUpdateBusStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: IBus["status"] }) =>
      setBusStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.myBuses });
      const previous = queryClient.getQueryData<IBus[]>(queryKeys.myBuses);
      queryClient.setQueryData<IBus[]>(queryKeys.myBuses, (buses) =>
        buses?.map((bus) => (bus.id === id ? { ...bus, status } : bus)),
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Bus updated");
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKeys.myBuses, context.previous);
      toast.error((error as Error).message || "Failed to update bus");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.myBuses }),
  });
};
