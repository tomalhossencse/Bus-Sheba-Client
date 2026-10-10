import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  applyOperator,
  approve,
  getAllOperators,
  OperatorVerifyEmail,
} from "@/api/operator.api";
import type { OperatorProfile } from "@/lib/types";
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

export function useGetAllOperators() {
  return useQuery({
    queryKey: queryKeys.operators,
    queryFn: getAllOperators,
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
      const previous = queryClient.getQueryData<OperatorProfile[]>(
        queryKeys.operators,
      );
      queryClient.setQueryData(queryKeys.operators, (oldData: any) => {
        if (!oldData?.data?.data) return oldData;

        return {
          ...oldData,
          data: {
            ...oldData.data,
            data: oldData.data.data.map((operator: any) =>
              operator.id === operatorId
                ? {
                    ...operator,
                    verificationStatus: status,
                    rejectionReason: rejectReason || null,
                  }
                : operator,
            ),
          },
        };
      });
      return { previous };
    },
    onSuccess: (result) => {
      toast.success(result.message || "Operator updated");
    },
    onError: (error: unknown, _variables, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKeys.operators, context.previous);
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.operators }),
  });
};
