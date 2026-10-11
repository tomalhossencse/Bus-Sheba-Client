"use client";

import {
  CheckCircle2,
  ExternalLink,
  Ticket as TicketIcon,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCheckTicket } from "@/hooks";
import {
  formatDate,
  formatDateTime,
  formatPrice,
  formatStopTime,
  formatTime,
} from "@/utils";

export default function VerifyTicketPage() {
  const params = useParams<{ ticketNumber: string }>();
  const ticketNumber = decodeURIComponent(params.ticketNumber);
  const {
    data: ticketCheck,
    isLoading,
    isError,
  } = useCheckTicket(ticketNumber);
  const ticket = ticketCheck?.ticket;
  const booking = ticketCheck;
  const trip = booking?.trip;

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <TicketIcon className="h-6 w-6" />
          </div>
          <CardTitle className="font-heading text-2xl">
            BusSheba Ticket
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : isError || !ticket ? (
            <div className="space-y-3 text-center">
              <XCircle className="mx-auto h-12 w-12 text-destructive" />
              <h2 className="text-lg font-semibold">Ticket not found</h2>
              <p className="text-sm text-muted-foreground">
                This QR code is invalid or the ticket is no longer available.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Ticket number</p>
                  <p className="font-mono text-sm font-semibold">
                    {ticket.ticketNumber}
                  </p>
                </div>
                <Badge
                  variant={ticket.status === "ACTIVE" ? "default" : "secondary"}
                >
                  {ticket.status}
                </Badge>
              </div>

              {ticket.status === "ACTIVE" ? (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  This ticket is valid for travel.
                </div>
              ) : (
                <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                  This ticket cannot be used for boarding.
                </div>
              )}

              <div className="space-y-3 rounded-lg border p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Route</span>
                  <span className="text-right font-medium">
                    {trip?.route?.source || "—"} →{" "}
                    {trip?.route?.destination || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Travel date</span>
                  <span>
                    {trip?.travelDate ? formatDate(trip.travelDate) : "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Departure</span>
                  <span>
                    {trip?.departureTime ? formatTime(trip.departureTime) : "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Arrival</span>
                  <span>
                    {trip?.arrivalTime ? formatTime(trip.arrivalTime) : "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Amount</span>
                  <span>{formatPrice(booking?.totalAmount || 0)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Boarding</span>
                  <span className="text-right">
                    {booking?.fromStop?.stopName || "—"} ·{" "}
                    {formatStopTime(
                      trip?.departureTime,
                      booking?.fromStop?.departureMinutes,
                    )}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Dropping</span>
                  <span className="text-right">
                    {booking?.toStop?.stopName || "—"} ·{" "}
                    {formatStopTime(
                      trip?.departureTime,
                      booking?.toStop?.arrivalMinutes,
                    )}
                  </span>
                </div>
                {ticket.usedAt && (
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground">Used at</span>
                    <span>{formatDateTime(ticket.usedAt)}</span>
                  </div>
                )}
              </div>

              <div className="space-y-3 rounded-lg border p-4 text-sm">
                <p className="font-semibold">
                  Passengers ({booking?.passengers?.length || 0})
                </p>
                {booking?.passengers?.length ? (
                  booking.passengers.map((passenger, index) => (
                    <div
                      key={passenger.id}
                      className="rounded-md bg-muted/40 p-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">
                          {index + 1}. {passenger.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Seat{" "}
                          {booking.seats?.[index]?.tripSeat?.seat?.seatNumber ||
                            "—"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {passenger.phone} · {passenger.email}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">
                    Passenger details unavailable.
                  </p>
                )}
              </div>

              {ticket.ticketPdfUrl && (
                <Button className="w-full" variant="outline" asChild>
                  <a
                    href={ticket.ticketPdfUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open ticket PDF
                  </a>
                </Button>
              )}
            </>
          )}

          <Button className="w-full" variant="ghost" asChild>
            <Link href="/tickets/scan">Scan another ticket</Link>
          </Button>
          <Button className="w-full" variant="ghost" asChild>
            <Link href="/">Return to BusSheba</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
