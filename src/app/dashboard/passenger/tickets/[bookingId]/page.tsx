"use client";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MapPin,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBooking } from "@/hooks";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  formatStopTime,
  formatTime,
} from "@/utils";

export default function PassengerTicketPage() {
  const params = useParams<{ bookingId: string }>();
  const { data: booking, isLoading, isError } = useBooking(params.bookingId);
  const ticket = booking?.ticket;
  const trip = booking?.trip;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-4 sm:p-8">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (isError || !booking || !ticket) {
    return (
      <div className="mx-auto max-w-xl p-8 text-center">
        <p className="font-semibold">Ticket not available</p>
        <p className="mt-1 text-sm text-muted-foreground">
          This booking does not have an issued ticket yet.
        </p>
        <Button className="mt-4" asChild>
          <Link href="/dashboard/passenger/bookings">Back to bookings</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-8">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/dashboard/passenger/bookings">
          <ArrowLeft className="h-4 w-4" /> Back to bookings
        </Link>
      </Button>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="border-b bg-primary/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                BusSheba e-ticket
              </p>
              <CardTitle className="mt-1 font-mono text-xl">
                {ticket.ticketNumber}
              </CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Booking {booking.bookingNumber}
              </p>
            </div>
            <Badge
              variant="secondary"
              className={
                ticket.status === "ACTIVE"
                  ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-300"
                  : undefined
              }
            >
              {ticket.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 p-5 sm:p-8">
          <div className="flex items-center gap-3 rounded-xl bg-emerald-500/10 p-4 text-emerald-700 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">
              This ticket is valid for travel.
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Journey
              </div>
              <p className="font-semibold">
                {trip?.route?.source} → {trip?.route?.destination}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Boarding: {booking.fromStop?.stopName}
              </p>
              <p className="text-sm text-muted-foreground">
                Boarding time:{" "}
                {formatStopTime(
                  trip?.departureTime,
                  booking.fromStop?.departureMinutes,
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Dropping: {booking.toStop?.stopName}
              </p>
              <p className="text-sm text-muted-foreground">
                Dropping time:{" "}
                {formatStopTime(
                  trip?.departureTime,
                  booking.toStop?.arrivalMinutes,
                )}
              </p>
            </div>
            <div className="rounded-xl border p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                <CalendarDays className="h-4 w-4 text-primary" /> Schedule
              </div>
              <p className="font-semibold">
                {trip?.travelDate ? formatDate(trip.travelDate) : "—"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Departure:{" "}
                {trip?.departureTime ? formatTime(trip.departureTime) : "—"}
              </p>
              <p className="text-sm text-muted-foreground">
                Arrival:{" "}
                {trip?.arrivalTime ? formatTime(trip.arrivalTime) : "—"}
              </p>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <UserRound className="h-4 w-4 text-primary" /> Passengers
            </div>
            <div className="space-y-2">
              {booking.passengers?.map((passenger, index) => (
                <div
                  key={passenger.id}
                  className="flex flex-col gap-1 rounded-lg bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {index + 1}. {passenger.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {passenger.phone} · {passenger.email}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Seat{" "}
                    {booking.seats?.[index]?.tripSeat?.seat?.seatNumber || "—"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <span className="text-muted-foreground">Amount</span>
              <p className="font-semibold">
                {formatPrice(booking.totalAmount)}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Payment</span>
              <p className="font-semibold">
                {booking.payment?.status || "PAID"}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Transaction</span>
              <p className="font-mono text-xs font-semibold">
                {booking.payment?.trxID || "—"}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            {ticket.ticketPdfUrl && (
              <Button className="flex-1" asChild>
                <a href={ticket.ticketPdfUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="h-4 w-4" /> Open ticket PDF
                </a>
              </Button>
            )}
            {ticket.qrCode && (
              <Button variant="outline" className="flex-1" asChild>
                <a href={ticket.qrCode} target="_blank" rel="noreferrer">
                  Open verification page
                </a>
              </Button>
            )}
          </div>
          {ticket.usedAt && (
            <p className="text-center text-xs text-muted-foreground">
              Used at {formatDateTime(ticket.usedAt)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
