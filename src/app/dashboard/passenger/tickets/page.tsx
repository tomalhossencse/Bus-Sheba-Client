"use client";

import { ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyBookings } from "@/hooks";
import { formatDate, formatPrice, formatTime } from "@/utils";

export default function PassengerTicketsPage() {
  const { data: bookings, isLoading } = useMyBookings("CONFIRMED");
  const tickets = bookings?.filter((booking) => booking.ticket);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <p className="text-sm font-medium text-primary">Travel documents</p>
        <h1 className="font-heading text-2xl font-bold">My Tickets</h1>
        <p className="text-sm text-muted-foreground">
          Access your confirmed tickets and boarding information.
        </p>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_) => (
            <Skeleton key={Math.random()} className="h-32 w-full" />
          ))
        ) : tickets?.length ? (
          tickets.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Ticket className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      {booking.ticket?.ticketNumber}
                    </p>
                    <p className="font-semibold">
                      {booking.trip?.route?.source} →{" "}
                      {booking.trip?.route?.destination}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.trip ? formatDate(booking.trip.travelDate) : "—"}{" "}
                      ·{" "}
                      {booking.trip
                        ? formatTime(booking.trip.departureTime)
                        : "—"}{" "}
                      · {booking.seats?.length || 0} seat(s) ·{" "}
                      {formatPrice(booking.totalAmount)}
                    </p>
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/dashboard/passenger/tickets/${booking.id}`}>
                    Open ticket
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Ticket className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
              <p className="font-medium">No tickets yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tickets will appear here after a booking is paid successfully.
              </p>
              <Button className="mt-4" variant="outline" asChild>
                <Link href="/search">Search buses</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
