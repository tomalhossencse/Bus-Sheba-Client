"use client";

import { Armchair, Bus, CalendarDays, Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllTrips } from "@/hooks";
import type { BusType } from "@/lib/types";
import { formatDate, formatPrice, formatTime } from "@/utils";

function getTypeBadge(type?: BusType): "default" | "secondary" | "outline" {
  const variants: Record<BusType, "default" | "secondary" | "outline"> = {
    AC: "default",
    NON_AC: "secondary",
    SLEEPER: "default",
    SEMI_SLEEPER: "outline",
  };

  return type ? variants[type] || "default" : "outline";
}

function TripCardSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
        <div className="grid grid-cols-3 items-center gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-4" />
          <Skeleton className="h-10" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

interface UpcomingTripsListingProps {
  limit?: number;
  showPagination?: boolean;
  showViewAll?: boolean;
}

export function UpcomingTripsListing({
  limit = 6,
  showPagination = true,
  showViewAll = false,
}: UpcomingTripsListingProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useAllTrips(page, limit, "SCHEDULED");
  const trips = data?.data || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Upcoming Trips
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find your next journey and book your seat with ease
          </p>
        </div>
        {showViewAll && (
          <Button variant="outline" asChild>
            <Link href="/trips">View all trips</Link>
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {["trip-1", "trip-2", "trip-3", "trip-4", "trip-5", "trip-6"].map(
            (key) => (
              <TripCardSkeleton key={key} />
            ),
          )}
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-10 text-center">
          <Bus className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="mt-4 font-heading text-lg font-semibold">
            Unable to load trips
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Please try again in a moment.
          </p>
        </div>
      )}

      {!isLoading && !isError && trips.length === 0 && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground" />
          <h2 className="mt-4 font-heading text-lg font-semibold">
            No upcoming trips found
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Check back later or search for a trip by route.
          </p>
          <Button asChild className="mt-5">
            <Link href="/search">Search buses</Link>
          </Button>
        </div>
      )}

      {!isLoading && !isError && trips.length > 0 && (
        <>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <CardContent className="space-y-5 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Bus className="h-6 w-6" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {trip.bus?.name || "Bus service"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {trip.bus?.operator?.companyName ||
                            trip.bus?.registrationNo ||
                            "Verified operator"}
                        </p>
                      </div>
                    </div>
                    <Badge variant={getTypeBadge(trip.bus?.busType)}>
                      {trip.bus?.busType?.replace("_", " ") || "Bus"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">
                        {formatTime(trip.departureTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip.route?.source || "Origin"}
                      </p>
                    </div>
                    <div className="flex flex-1 items-center gap-2 px-2">
                      <div className="h-px flex-1 bg-border" />
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div className="h-px flex-1 bg-border" />
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        {formatTime(trip.arrivalTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip.route?.destination || "Destination"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t pt-4 text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      {formatDate(trip.travelDate)}
                    </span>
                    <span className="font-heading text-xl font-bold text-primary">
                      {formatPrice(trip.fare)}
                    </span>
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/booking?tripId=${trip.id}`}>
                      <Armchair className="h-4 w-4" />
                      View seats
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {showPagination && data?.meta && data.meta.totalPages > 1 && (
            <div className="mt-10 flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                Showing page {data.meta.page} of {data.meta.totalPages} (
                {data.meta.total} total trips)
              </p>
              <Pagination
                page={data.meta.page}
                totalPages={data.meta.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
