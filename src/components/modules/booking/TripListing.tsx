"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Armchair,
  ArrowRightLeft,
  Bus,
  Calendar,
  Clock,
  MapPin,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { LocationPicker } from "@/components/dashboard/LocationPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useTripsSearch } from "@/hooks";
import type { BusType } from "@/lib/types";
import { formatPrice, formatTime } from "@/utils";

const searchSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
});

type TripSearchForm = z.infer<typeof searchSchema>;

function TripCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <Skeleton className="h-16 w-full md:w-48" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-9 w-28" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TripListing() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { control, handleSubmit, setValue, watch } = useForm<TripSearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      origin: searchParams.get("origin") || "",
      destination: searchParams.get("destination") || "",
      date: searchParams.get("date") || new Date().toISOString().split("T")[0],
    },
  });

  const origin = watch("origin");
  const destination = watch("destination");
  const date = watch("date");

  const {
    data: trips,
    isLoading,
    isError,
    error,
  } = useTripsSearch({ source: origin, destination, date });

  const handleSearch = (data: TripSearchForm) => {
    const params = new URLSearchParams();
    if (data.origin) params.set("origin", data.origin);
    if (data.destination) params.set("destination", data.destination);
    if (data.date) params.set("date", data.date);
    router.push(`/search?${params.toString()}`);
  };

  const handleSwap = () => {
    setValue("origin", destination, { shouldValidate: true });
    setValue("destination", origin, { shouldValidate: true });
  };

  const getTypeBadge = (
    type: BusType,
  ): "default" | "secondary" | "success" | "outline" => {
    const variants: Record<
      BusType,
      "default" | "secondary" | "success" | "outline"
    > = {
      AC: "default",
      NON_AC: "secondary",
      SLEEPER: "success",
      SEMI_SLEEPER: "outline",
    };
    return variants[type] || "default";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search form */}
      <div className="mb-8 rounded-2xl border bg-card p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-12 md:items-end">
          <div className="space-y-1.5 md:col-span-3">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              From
            </Label>
            <Controller
              control={control}
              name="origin"
              render={({ field }) => (
                <LocationPicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Dhaka"
                  levels={["Terminal", "Upazila", "District", "Division"]}
                />
              )}
            />
          </div>

          <div className="hidden md:col-span-1 md:flex md:items-end md:justify-center">
            <Button variant="outline" size="icon" onClick={handleSwap}>
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              To
            </Label>
            <Controller
              control={control}
              name="destination"
              render={({ field }) => (
                <LocationPicker
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder="Chattogram"
                  levels={["Terminal", "Upazila", "District", "Division"]}
                />
              )}
            />
          </div>

          <div className="space-y-1.5 md:col-span-3">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Date
            </Label>
            <Controller
              control={control}
              name="date"
              render={({ field }) => (
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input type="date" {...field} className="pl-9" />
                </div>
              )}
            />
          </div>

          <div className="md:col-span-2">
            <Button className="w-full" onClick={handleSubmit(handleSearch)}>
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {(origin || destination) && (
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold">
            {origin || "Dhaka"}
            <ArrowRightLeft className="mx-2 inline h-5 w-5 text-primary" />
            {destination || "Chattogram"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading
              ? "Searching for available buses..."
              : `${trips?.data?.length || 0} bus${(trips?.data?.length || 0) !== 1 ? "es" : ""} available`}
            {date && (
              <>
                {" "}
                on{" "}
                {new Date(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </>
            )}
          </p>
        </div>
      )}

      {/* Guard: need origin + destination */}
      {(!origin || !destination) && (
        <div className="rounded-xl border bg-card p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 font-heading text-lg font-semibold">
            Select your route
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a source and destination to find available buses
          </p>
        </div>
      )}

      {/* Loading */}
      {isLoading && origin && destination && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <TripCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-destructive">
            Failed to load trips:{" "}
            {error instanceof Error ? error.message : "Please try again"}
          </p>
        </div>
      )}

      {/* Trips */}
      {!isLoading && !isError && trips && (
        <div className="space-y-4">
          {trips.data.map((trip) => (
            <Card
              key={trip.id}
              className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row md:items-stretch">
                  {/* Bus info */}
                  <div className="flex items-center gap-4 border-b p-5 md:border-b-0 md:border-r md:flex-1 md:basis-64">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Bus className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="font-semibold">{trip.bus?.name}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <Badge
                          variant={getTypeBadge(trip.bus?.busType as BusType)}
                        >
                          {trip.bus?.busType?.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {trip.bus?.registrationNo}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {trip.bus?.operator?.companyName}
                      </p>
                    </div>
                  </div>

                  {/* Time info */}
                  <div className="flex flex-1 items-center justify-between gap-4 px-5 py-5">
                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {formatTime(trip.departureTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip.route?.source}
                      </p>
                    </div>

                    <div className="flex-1 px-2 text-center">
                      <div className="flex items-center gap-1">
                        <Clock className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {trip.route?.estimatedMinutes
                            ? `${Math.floor(trip.route.estimatedMinutes / 60)}h ${trip.route.estimatedMinutes % 60}m`
                            : "—"}
                        </span>
                      </div>
                      <div className="mx-auto mt-1 h-px w-full bg-border relative">
                        <div className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary" />
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xl font-bold">
                        {formatTime(trip.arrivalTime)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip.route?.destination}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between border-t bg-muted/30 p-5 md:flex-col md:justify-center md:gap-3 md:border-l md:border-t-0 md:w-52">
                    <div className="text-center">
                      <p className="font-heading text-2xl font-bold text-primary">
                        {formatPrice(trip.fare)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {trip.bus?.totalSeats
                          ? `${trip.bus.totalSeats - (trip._count?.tripSeats || 0)} seats`
                          : "per seat"}
                      </p>
                    </div>
                    <Button asChild>
                      <Link
                        href={`/booking?tripId=${trip.id}`}
                        className="gap-2"
                      >
                        <Armchair className="h-4 w-4" />
                        View Seats
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {trips.data.length === 0 && (
            <div className="rounded-xl border bg-card p-12 text-center">
              <Bus className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 font-heading text-lg font-semibold">
                No buses found
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try a different route or date
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
