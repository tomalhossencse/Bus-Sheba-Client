import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  applyOperator,
  approve,
  getAllOperators,
  OperatorVerifyEmail,
} from "@/api/operator.api";
import { extractApiError } from "@/lib/api";
import { toPaginatedResult } from "@/lib/pagination";
import type { OperatorProfile } from "@/lib/types";
import type { PaginatedResult } from "@/types";
import { queryKeys } from "./auth.hook";

export function useApplyOperator() {
  return useMutation({
    mutationFn: applyOperator,
  });
}

export function useOperatorVerifyEmail() {
  return useMutation({
    mutationFn: OperatorVerifyEmail,
  });
}

export function useGetAllOperators(page = 1, limit = 10) {
  return useQuery({
    queryKey: [...queryKeys.operators, page, limit],
    queryFn: async () => {
      const result = await getAllOperators({ page, limit });
      return toPaginatedResult(result.data, result.meta, limit);
    },
  });
}

export const useApproveOperator = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      operatorId,
      status,
      rejectReason,
    }: {
      operatorId: string;
      status: "APPROVED" | "REJECTED";
      rejectReason?: string;
    }) => approve(operatorId, status, rejectReason),
    onMutate: async ({ operatorId, status, rejectReason }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.operators });
      const previous = queryClient.getQueriesData<
        PaginatedResult<OperatorProfile>
      >({ queryKey: queryKeys.operators });
      queryClient.setQueriesData<PaginatedResult<OperatorProfile>>(
        { queryKey: queryKeys.operators },
        (oldData) => {
          if (!oldData?.data) return oldData;

          return {
            ...oldData,
            data: oldData.data.map((operator) =>
              operator.id === operatorId
                ? {
                    ...operator,
                    verificationStatus: status,
                    rejectionReason: rejectReason || null,
                  }
                : operator,
            ),
          };
        },
      );
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Operator updated");
    },
    onError: (error: unknown, _variables, context) => {
      context?.previous?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(extractApiError(error) || "Failed to update operator");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.operators }),
  });
};
