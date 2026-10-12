"use client";

import { ArrowLeft, Bus, Clock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { TripSeatMap } from "@/components/shared/TripSeatMap";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripDetail, useTripSeats } from "@/hooks";
import type { TripSeat } from "@/lib/types";
import { formatPrice, formatTime } from "@/utils";
import { THRASHHOLD } from "@/validation";

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tripId = searchParams.get("tripId") || "";

  const {
    data: trip,
    isLoading: tripLoading,
    isError: tripError,
  } = useTripDetail(tripId);
  const { data: seats, isLoading: seatsLoading } = useTripSeats(tripId);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggle = (tripSeat: TripSeat) => {
    setSelectedIds((prev) => {
      if (prev.includes(tripSeat.id)) {
        return prev.filter((id) => id !== tripSeat.id);
      }
      if (prev.length >= THRASHHOLD) {
        return prev;
      }
      return [...prev, tripSeat.id];
    });
  };

  const handleContinue = () => {
    const seatsParam = selectedIds.join(",");
    router.push(`/booking/checkout?tripId=${tripId}&seats=${seatsParam}`);
  };

  if (tripLoading || seatsLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-24 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (tripError || !trip) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>
            Unable to load trip. It may have been cancelled or removed.
          </AlertDescription>
        </Alert>
        <Button variant="ghost" asChild className="mt-4">
          <Link href="/search">
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-4 sm:mb-6">
        <Link href="/search">
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Link>
      </Button>

      {/* Trip summary */}
      <Card className="mb-6 overflow-hidden sm:mb-8">
        <CardContent className="p-4 sm:p-5">
          <div className="flex min-w-0 flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Bus className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {trip.bus?.name || "Bus service"}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {trip.bus?.busType?.replace("_", " ") || "Bus"}
                  </Badge>
                  <span className="truncate text-xs text-muted-foreground">
                    {trip.bus?.registrationNo}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 items-center justify-between gap-3 text-sm sm:justify-start sm:gap-6">
              <div className="min-w-0">
                <p className="text-lg font-bold">
                  {formatTime(trip.departureTime)}
                </p>
                <p className="max-w-28 truncate text-xs text-muted-foreground sm:max-w-none">
                  {trip.route?.source}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {trip.route?.estimatedMinutes
                  ? `${Math.floor(trip.route.estimatedMinutes / 60)}h ${trip.route.estimatedMinutes % 60}m`
                  : "—"}
              </div>
              <div className="min-w-0 text-right">
                <p className="text-lg font-bold">
                  {formatTime(trip.arrivalTime)}
                </p>
                <p className="max-w-28 truncate text-xs text-muted-foreground sm:max-w-none">
                  {trip.route?.destination}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 border-t pt-3 md:block md:border-t-0 md:pt-0 md:text-right">
              <span className="text-xs text-muted-foreground sm:hidden">
                Fare per seat
              </span>
              <p className="font-heading text-xl font-bold text-primary sm:text-2xl">
                {formatPrice(trip.fare)}
              </p>
              <p className="hidden text-xs text-muted-foreground sm:block">
                per seat
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid min-w-0 gap-5 sm:gap-8 lg:grid-cols-3">
        {/* Seat map */}
        <div className="min-w-0 lg:col-span-2">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-heading text-base font-semibold sm:text-lg">
                  Select Your Seats
                </h2>
                <span className="text-xs text-muted-foreground sm:text-sm">
                  Selected:{" "}
                  <span className="font-semibold text-foreground">
                    {selectedIds.length}
                  </span>
                  /{THRASHHOLD}
                </span>
              </div>

              {seats && seats.length > 0 ? (
                <TripSeatMap
                  seats={seats}
                  selectedIds={selectedIds}
                  onToggle={handleToggle}
                  maxSelect={THRASHHOLD}
                />
              ) : (
                <div className="py-10 text-center text-sm text-muted-foreground">
                  {seatsLoading ? (
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  ) : (
                    "No seats available for this trip"
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary sidebar */}
        <div className="min-w-0 space-y-4">
          <Card className="lg:sticky lg:top-24">
            <CardContent className="p-4 sm:p-6">
              <h3 className="mb-4 font-heading text-lg font-semibold">
                Booking Summary
              </h3>

              <div className="mb-4 space-y-2 border-b pb-4 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Route</span>
                  <span className="max-w-[65%] break-words text-right font-medium">
                    {trip.route?.source} → {trip.route?.destination}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Bus</span>
                  <span className="max-w-[65%] break-words text-right font-medium">
                    {trip.bus?.name}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Travel Date</span>
                  <span className="text-right font-medium">
                    {new Date(trip.travelDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="max-w-[65%] break-words text-right font-medium">
                    {selectedIds
                      .map(
                        (id) =>
                          seats?.find((s) => s.id === id)?.seat?.seatNumber,
                      )
                      .filter(Boolean)
                      .join(", ") || "—"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fare per seat</span>
                  <span className="font-medium">{formatPrice(trip.fare)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seats</span>
                  <span className="font-medium">
                    × {selectedIds.length || 0}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2 text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatPrice(trip.fare * selectedIds.length)}
                  </span>
                </div>
              </div>

              <Button
                className="mt-6 w-full"
                size="lg"
                disabled={selectedIds.length === 0}
                onClick={handleContinue}
              >
                {selectedIds.length === 0
                  ? "Select at least 1 seat"
                  : `Continue with ${selectedIds.length} seat${selectedIds.length > 1 ? "s" : ""}`}
              </Button>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                Seats are held for 15 minutes
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
