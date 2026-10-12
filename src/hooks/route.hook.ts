import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRoute, getAllRoutes, setActiveRoute, updateRoute } from "@/api";
import { extractApiError } from "@/lib/api";
import type { IRoute } from "@/lib/types";
import type { PaginatedData } from "@/types";
import { queryKeys } from "./auth.hook";

export const useCreateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoute,
    onSuccess: (result) => {
      toast.success(result.message || "Route added");
      queryClient.invalidateQueries({ queryKey: queryKeys.routes });
    },
    onError: (error: unknown) =>
      toast.error(extractApiError(error) || "Failed to add route"),
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IRoute> }) =>
      updateRoute(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.routes });
      const previous = queryClient.getQueriesData<PaginatedData<IRoute>>({
        queryKey: queryKeys.routes,
      });
      queryClient.setQueriesData<PaginatedData<IRoute>>(
        { queryKey: queryKeys.routes },
        (routes) =>
          routes
            ? {
                ...routes,
                data: routes.data.map((route) =>
                  route.id === id ? { ...route, ...payload } : route,
                ),
              }
            : routes,
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Route updated");
    },
    onError: (error: unknown, _variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(extractApiError(error) || "Failed to update route");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.routes }),
  });
};

export const useRoutes = (
  page = 1,
  limit = 10,
  isActive?: boolean,
  searchTerm?: string,
) => {
  return useQuery({
    queryKey: [...queryKeys.routes, page, limit, searchTerm, isActive],
    queryFn: async () => {
      const result = await getAllRoutes({ page, limit, isActive, searchTerm });
      return result.data;
    },
  });
};

export const useToggleRouteActive = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      setActiveRoute(id, active),
    onMutate: async ({ id, active }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.routes });
      const previous = queryClient.getQueriesData<PaginatedData<IRoute>>({
        queryKey: queryKeys.routes,
      });
      queryClient.setQueriesData<PaginatedData<IRoute>>(
        { queryKey: queryKeys.routes },
        (routes) =>
          routes
            ? {
                ...routes,
                data: routes.data.map((route) =>
                  route.id === id ? { ...route, isActive: active } : route,
                ),
              }
            : routes,
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Route updated");
    },
    onError: (error: unknown, _variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(extractApiError(error) || "Failed to toggle route");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.routes }),
  });
};
