"use client";

import { CalendarX2 } from "lucide-react";
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
import { useAllTrips } from "@/hooks";
import { formatDate, formatPrice, formatTime } from "@/utils";

function statusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "DEPARTED":
      return "outline";
    case "BOARDING":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function AdminTripsPage() {
  const { data: trips, isLoading } = useAllTrips();

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Trips</h1>
        <p className="text-sm text-muted-foreground">
          All scheduled trips across all operators
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Route</TableHead>
                <TableHead>Bus</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Arrival</TableHead>
                <TableHead>Fare</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={`skeleton-loading-${Math.random()}`}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : trips?.length ? (
                trips.map((trip) => (
                  <TableRow key={trip.id}>
                    <TableCell className="font-medium">
                      {trip.route?.source} → {trip.route?.destination}
                    </TableCell>
                    <TableCell className="text-sm">
                      {trip.bus?.name}
                      <p className="text-xs text-muted-foreground">
                        {trip.bus?.registrationNo}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(trip.travelDate)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTime(trip.departureTime)}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatTime(trip.arrivalTime)}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(trip.fare)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(trip.status)}>
                        {trip.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <CalendarX2 className="mx-auto mb-2 h-8 w-8" />
                    No trips found
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
