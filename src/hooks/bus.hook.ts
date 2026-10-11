import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { createBus, getAllBuses, getMyBuses, setBusStatus } from "@/api";
import { extractApiError } from "@/lib/api";
import { toPaginatedResult } from "@/lib/pagination";
import type { IBus } from "@/lib/types";
import type { PaginatedResult } from "@/types";
import { queryKeys } from "./auth.hook";

export const useBuses = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: [...queryKeys.buses, page, limit],
    queryFn: async () => {
      const result = await getAllBuses({ page, limit });
      return toPaginatedResult(result.data, result.meta, limit);
    },
    placeholderData: keepPreviousData,
  });
};

export const useMyBuses = () => {
  return useQuery({
    queryKey: queryKeys.myBuses,
    queryFn: async () => {
      const result = await getMyBuses();
      return toPaginatedResult(result.data, result.meta, result.data.length);
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
      toast.error(extractApiError(error) || "Failed to add bus"),
  });
};

export const useUpdateBusStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: IBus["status"] }) =>
      setBusStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.myBuses });
      const previous = queryClient.getQueriesData<PaginatedResult<IBus>>({
        queryKey: queryKeys.myBuses,
      });
      queryClient.setQueriesData<PaginatedResult<IBus>>(
        { queryKey: queryKeys.myBuses },
        (buses) =>
          buses
            ? {
                ...buses,
                data: buses.data.map((bus) =>
                  bus.id === id ? { ...bus, status } : bus,
                ),
              }
            : buses,
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Bus updated");
    },
    onError: (error: unknown, _variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(extractApiError(error) || "Failed to update bus");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.myBuses }),
  });
};
