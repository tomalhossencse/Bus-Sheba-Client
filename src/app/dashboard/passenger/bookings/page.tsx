"use client";

import {
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Ticket,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCreatePayment, useMyBookings } from "@/hooks";
import { formatDate, formatPrice, formatTime } from "@/utils";

const FILTERS = [
  "all",
  "CONFIRMED",
  "PENDING",
  "COMPLETED",
  "CANCELLED",
] as const;
type Filter = (typeof FILTERS)[number];

function statusVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "secondary";
    case "COMPLETED":
      return "default";
    case "CANCELLED":
    case "EXPIRED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function PassengerBookingsPage() {
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [payingBookingId, setPayingBookingId] = useState<string | null>(null);
  const { data, isLoading } = useMyBookings(
    filter === "all" ? undefined : filter,
    page,
  );
  const bookings = data?.data;
  const createPayment = useCreatePayment();
  const status = searchParams.get("status");
  const highlightedBookingId = searchParams.get("bookingId");
  const highlightedBooking = bookings?.find(
    (booking) => booking.id === highlightedBookingId,
  );

  const handlePay = async (bookingId: string) => {
    setPayingBookingId(bookingId);
    try {
      const result = await createPayment.mutateAsync(bookingId);
      if (result.success && result.data.paymentUrl) {
        window.location.assign(result.data.paymentUrl);
      }
    } finally {
      setPayingBookingId(null);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value as Filter);
    setPage(1);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">My Bookings</h1>
        <p className="text-sm text-muted-foreground">
          View and manage your bookings
        </p>
      </div>

      {status === "success" && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
            <div className="space-y-2">
              <div>
                <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                  Payment successful
                </p>
                <p className="text-sm text-muted-foreground">
                  {highlightedBooking
                    ? `Your booking ${highlightedBooking.bookingNumber} is confirmed.`
                    : "Your payment was received. Your booking details are being refreshed."}
                </p>
              </div>
              {highlightedBooking && (
                <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2 sm:gap-x-8">
                  <span>
                    Payment: {highlightedBooking.payment?.status || "PAID"}
                  </span>
                  {highlightedBooking.payment?.trxID && (
                    <span>Transaction: {highlightedBooking.payment.trxID}</span>
                  )}
                  {highlightedBooking.ticket?.ticketNumber && (
                    <span>
                      Ticket: {highlightedBooking.ticket.ticketNumber}
                    </span>
                  )}
                </div>
              )}
              {highlightedBooking?.ticket?.ticketPdfUrl && (
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" asChild>
                    <Link
                      href={`/dashboard/passenger/tickets/${highlightedBooking.id}`}
                    >
                      <Ticket className="h-4 w-4" />
                      View ticket
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline" asChild>
                    <a
                      href={highlightedBooking.ticket.ticketPdfUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {(status === "failure" || status === "cancelled") && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-5">
            <XCircle className="h-6 w-6 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">
                {status === "cancelled"
                  ? "Payment cancelled"
                  : "Payment failed"}
              </p>
              <p className="text-sm text-muted-foreground">
                Your booking remains pending. You can try the payment again
                below.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={filter} onValueChange={handleFilterChange}>
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f} value={f}>
              {f === "all" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map(() => (
            <Skeleton key={Math.random()} className="h-24" />
          ))
        ) : bookings?.length ? (
          bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {booking.bookingNumber}
                    </p>
                    <p className="font-semibold">
                      {booking.trip?.route?.source} →{" "}
                      {booking.trip?.route?.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {booking.trip ? formatDate(booking.trip.travelDate) : "—"}{" "}
                      ·{" "}
                      {booking.trip
                        ? formatTime(booking.trip.departureTime)
                        : "—"}{" "}
                      · {booking.trip?.bus?.name || ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {booking.fromStop?.stopName} → {booking.toStop?.stopName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-heading font-bold text-primary">
                    {formatPrice(booking.totalAmount)}
                  </span>
                  <Badge variant={statusVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                  {booking.status === "PENDING" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePay(booking.id)}
                      disabled={payingBookingId === booking.id}
                    >
                      <CreditCard className="h-4 w-4" />
                      {payingBookingId === booking.id
                        ? "Opening..."
                        : "Pay now"}
                    </Button>
                  )}
                  {booking.ticket && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/dashboard/passenger/tickets/${booking.id}`}>
                        <Ticket className="h-4 w-4" />
                        Ticket
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="rounded-xl border bg-card p-12 text-center text-muted-foreground">
            <Ticket className="mx-auto mb-2 h-10 w-10" />
            No bookings found
            <div className="mt-3">
              <Button asChild variant="outline">
                <Link href="/search">Search Buses</Link>
              </Button>
            </div>
          </div>
        )}
      </div>

      {data?.meta && data.meta.totalPages > 1 && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
