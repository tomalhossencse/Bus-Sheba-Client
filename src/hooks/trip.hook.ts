import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  cancelTrip,
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  getTripSeats,
  search,
} from "@/api";
import { extractApiError } from "@/lib/api";
import { toPaginatedResult } from "@/lib/pagination";
import type { ITrip } from "@/lib/types";
import { queryKeys } from "./auth.hook";

export const useTripsSearch = (params: {
  source?: string;
  destination?: string;
  travelDate?: string;
}) => {
  return useQuery({
    queryKey: ["trip-search", params],
    queryFn: () => search(params),
    enabled: Boolean(params.source && params.destination),
    staleTime: 30 * 1000,
  });
};

export const useAllTrips = (page = 1, limit = 20, status?: string) => {
  return useQuery({
    queryKey: ["all-trips", page, limit, status],
    queryFn: async () => {
      const result = await getAllTrips({ page, limit, status });
      return toPaginatedResult(result.data, result.meta, limit);
    },
  });
};

export const useMyTrips = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const page = params?.page || 1;
  const limit = params?.limit || 20;
  return useQuery({
    queryKey: ["my-trips", page, limit, params?.status],
    queryFn: async () => {
      const result = await getMyTrips(params);
      return toPaginatedResult(result.data, result.meta, limit);
    },
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrip,
    onSuccess: (result) => {
      toast.success(result.message || "Trip created");
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.operator });
    },
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to create trip"),
  });
};

export const useCancelTrip = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelTrip(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["my-trips"] });
      const previous = queryClient.getQueriesData<ITrip[]>({
        queryKey: ["my-trips"],
      });
      queryClient.setQueriesData<ITrip[]>({ queryKey: ["my-trips"] }, (trips) =>
        trips?.map((trip) =>
          trip.id === id ? { ...trip, status: "CANCELLED" } : trip,
        ),
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Trip cancelled");
    },
    onError: (error: unknown, _id, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(extractApiError(error) || "Failed to cancel trip");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["my-trips"] }),
  });
};

export const useTripDetail = (id: string) => {
  return useQuery({
    queryKey: queryKeys.trip(id),
    queryFn: async () => {
      const result = await getTripById(id);
      return result.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
};

export const useTripSeats = (tripId: string) => {
  return useQuery({
    queryKey: queryKeys.tripSeats(tripId),
    queryFn: async () => {
      const result = await getTripSeats(tripId);
      return result.data;
    },
    enabled: Boolean(tripId),
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000,
  });
};
