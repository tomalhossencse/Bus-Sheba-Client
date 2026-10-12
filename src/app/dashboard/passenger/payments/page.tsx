"use client";

import { Wallet } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyPayments, usePaymentCounts, usePaymentTotal } from "@/hooks";
import type { PaymentStatus } from "@/lib/types";
import { formatDateTime, formatPrice } from "@/utils";

const FILTERS = [
  "all",
  "PAID",
  "PENDING",
  "FAILED",
  "CANCELLED",
  "REFUND_PENDING",
  "REFUNDED",
  "PARTIALLY_REFUNDED",
] as const;
type Filter = (typeof FILTERS)[number];

function filterLabel(filter: Filter) {
  if (filter === "all") return "All payments";

  return filter
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function amountLabel(filter: Filter) {
  if (filter === "all") return "Total payment amount";

  return `${filterLabel(filter)} amount`;
}

function amountSummaryClass(filter: Filter) {
  switch (filter) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    case "PENDING":
    case "REFUND_PENDING":
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400";
    case "FAILED":
    case "CANCELLED":
      return "bg-destructive/10 text-destructive";
    case "REFUNDED":
    case "PARTIALLY_REFUNDED":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    default:
      return "bg-muted text-foreground";
  }
}

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
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyPayments(
    page,
    12,
    filter === "all" ? undefined : (filter as PaymentStatus),
  );
  const paymentCounts = usePaymentCounts();
  const { data: totalAmount, isLoading: isTotalLoading } = usePaymentTotal(
    filter === "all" ? undefined : (filter as PaymentStatus),
  );
  const payments = data?.data;

  const handleFilterChange = (value: string) => {
    setFilter(value as Filter);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground">Your payment history</p>
        </div>
        <div
          className={`rounded-lg px-4 py-2 text-sm font-semibold ${amountSummaryClass(filter)}`}
        >
          {amountLabel(filter)}:{" "}
          {isTotalLoading ? "..." : formatPrice(totalAmount || 0)}
        </div>
      </div>

      <Tabs value={filter} onValueChange={handleFilterChange}>
        <TabsList className="max-w-full gap-1 overflow-x-auto">
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f} className="shrink-0">
              {filterLabel(f)}
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[11px] font-semibold leading-none text-muted-foreground">
                {paymentCounts[f] ?? "..."}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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

      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Showing page {data.meta.page} of {data.meta.totalPages} (
            {data.meta.total} total payments)
          </p>
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
