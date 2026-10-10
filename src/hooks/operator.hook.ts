import { useMutation } from "@tanstack/react-query";
import { applyOperator, OperatorVerifyEmail } from "@/api/operator.api";

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
