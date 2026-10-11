"use client";

import { ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyTrips } from "@/hooks";
import { formatDate, formatPrice } from "@/utils";

function statusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "DEPARTED":
      return "default";
    case "BOARDING":
      return "secondary";
    default:
      return "secondary";
  }
}

export default function OperatorBookingsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMyTrips({ page });
  const trips = data?.data;

  const totalBookings =
    trips?.reduce((sum, t) => sum + (t._count?.bookings || 0), 0) || 0;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Booking activity across your trips · {totalBookings} total
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
                <TableHead>Fare</TableHead>
                <TableHead>Bookings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_) => (
                  <TableRow key={Math.random()}>
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
                    <TableCell className="text-sm">{trip.bus?.name}</TableCell>
                    <TableCell className="text-sm">
                      {formatDate(trip.travelDate)}
                    </TableCell>
                    <TableCell className="font-semibold text-primary">
                      {formatPrice(trip.fare)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          trip._count?.bookings ? "default" : "secondary"
                        }
                      >
                        {trip._count?.bookings || 0} bookings
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(trip.status)}>
                        {trip.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/operator/trips`}>
                          <ClipboardList className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <ClipboardList className="mx-auto mb-2 h-8 w-8" />
                    No booking activity yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {data?.meta && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
