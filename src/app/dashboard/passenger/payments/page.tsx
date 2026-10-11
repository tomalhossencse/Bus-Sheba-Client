"use client";

import { Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyPayments } from "@/hooks";
import { formatDateTime, formatPrice } from "@/utils";

function statusVariant(status: string) {
  switch (status) {
    case "PAID":
      return "secondary";
    case "PENDING":
      return "outline";
    case "REFUNDED":
    case "REFUND_PENDING":
    case "PARTIALLY_REFUNDED":
      return "default";
    case "FAILED":
    case "CANCELLED":
      return "destructive";
    default:
      return "secondary";
  }
}

export default function PassengerPaymentsPage() {
  const { data: payments, isLoading } = useMyPayments();
  console.log("payments", payments);

  const totalPaid =
    payments
      ?.filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + Number(p.amount), 0) || 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground">Your payment history</p>
        </div>
        <div className="rounded-lg bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
          Total Paid: {formatPrice(totalPaid)}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_) => (
            <Skeleton key={Math.random()} className="h-32" />
          ))
        ) : payments?.length ? (
          payments.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Wallet className="h-5 w-5" />
                  </div>
                  <Badge variant={statusVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </div>
                <p className="font-heading text-xl font-bold text-primary">
                  {formatPrice(payment.amount)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {payment.provider} · {payment.currency}
                </p>
                <div className="mt-3 border-t pt-3 text-xs text-muted-foreground">
                  <p>Trx: {payment.trxID || "—"}</p>
                  <p>Invoice: {payment.merchantInvoiceNumber || "—"}</p>
                  <p>
                    Date:{" "}
                    {payment.createdAt
                      ? formatDateTime(payment.createdAt)
                      : "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full rounded-xl border bg-card p-12 text-center text-muted-foreground">
            <Wallet className="mx-auto mb-2 h-10 w-10" />
            No payments yet
          </div>
        )}
      </div>
    </div>
  );
}
