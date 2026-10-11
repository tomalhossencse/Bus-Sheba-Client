"use client";

import { Ticket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAllBookings } from "@/hooks";
import { formatDateTime, formatPrice } from "@/utils";

function statusVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "default";
    case "COMPLETED":
      return "default";
    case "CANCELLED":
    case "EXPIRED":
      return "destructive";
    case "PENDING":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function AdminBookingsPage() {
  const { data: bookings, isLoading } = useAllBookings();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          All bookings across the platform
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map(() => (
                  <TableRow key={Math.random()}>
                    <TableCell colSpan={6}>
                      <Skeleton className="h-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : bookings?.length ? (
                bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs font-medium">
                      {booking.bookingNumber}
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.user?.name || "—"}
                      <p className="text-xs text-muted-foreground">
                        {booking.user?.email}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.trip?.route?.source} →{" "}
                      {booking.trip?.route?.destination}
                    </TableCell>
                    <TableCell className="text-sm">
                      {booking.trip
                        ? formatDateTime(booking.trip.travelDate)
                        : "—"}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(booking.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <Ticket className="mx-auto mb-2 h-8 w-8" />
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
