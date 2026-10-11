import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createRoute, getAllRoutes, setActiveRoute, updateRoute } from "@/api";
import type { IRoute } from "@/lib/types";
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
      toast.error((error as Error).message || "Failed to add route"),
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IRoute> }) =>
      updateRoute(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.routes });
      const previous = queryClient.getQueryData<IRoute[]>(queryKeys.routes);
      queryClient.setQueryData<IRoute[]>(queryKeys.routes, (routes) =>
        routes?.map((route) =>
          route.id === id ? { ...route, ...payload } : route,
        ),
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Route updated");
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKeys.routes, context.previous);
      toast.error((error as Error).message || "Failed to update route");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.routes }),
  });
};

export const useRoutes = () => {
  return useQuery({
    queryKey: queryKeys.routes,
    queryFn: async () => {
      const result = await getAllRoutes();
      return result.data.data;
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
      const previous = queryClient.getQueryData<IRoute[]>(queryKeys.routes);
      queryClient.setQueryData<IRoute[]>(queryKeys.routes, (routes) =>
        routes?.map((route) =>
          route.id === id ? { ...route, isActive: active } : route,
        ),
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Route updated");
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKeys.routes, context.previous);
      toast.error((error as Error).message || "Failed to toggle route");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.routes }),
  });
};
