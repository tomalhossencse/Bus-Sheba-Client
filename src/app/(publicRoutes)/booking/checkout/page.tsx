/** biome-ignore-all lint/correctness/useExhaustiveDependencies: <explanation> */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bus,
  CheckCircle2,
  Loader2,
  MapPin,
  Route as RouteIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateBooking,
  useRouteStop,
  useTripDetail,
  useTripSeats,
} from "@/hooks";
import type { TripSeat } from "@/lib/types";
import { formatPrice, formatTime } from "@/utils";
import { bookingPassengerSchema } from "@/validation";

const checkoutSchema = z.object({
  fromStopId: z.string().min(1, "Select boarding point"),
  toStopId: z.string().min(1, "Select dropping point"),
  passengers: z.array(bookingPassengerSchema).min(1),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tripId = searchParams.get("tripId") || "";
  const seatIds = searchParams.get("seats")?.split(",").filter(Boolean) || [];

  const { data: trip, isLoading } = useTripDetail(tripId);
  const { data: seats } = useTripSeats(tripId);
  const { data: routeStops, isLoading: routeStopsLoading } = useRouteStop(
    trip?.routeId || "",
  );

  const createBooking = useCreateBooking();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fromStopId: "",
      toStopId: "",
      passengers: [],
    },
  });

  const { fields, replace } = useFieldArray({ control, name: "passengers" });

  const selectedSeats: TripSeat[] =
    seats?.filter((s) => seatIds.includes(s.id)) || [];
  const totalFare = (trip?.fare || 0) * selectedSeats.length;

  useEffect(() => {
    if (!selectedSeats.length) {
      replace([]);
      return;
    }

    replace(
      selectedSeats.map((_, index) => {
        const existingPassenger = fields[index];
        return {
          name: existingPassenger?.name || "",
          phone: existingPassenger?.phone || "",
          email: existingPassenger?.email || "",
        };
      }),
    );
    // Seat IDs are the source of truth for the passenger count.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seatIds.join(","), selectedSeats.length, replace]);

  const onSubmit = async (values: CheckoutFormValues) => {
    const bookingResult = await createBooking.mutateAsync({
      tripId,
      fromStopId: values.fromStopId,
      toStopId: values.toStopId,
      tripSeatIds: seatIds,
      passengers: values.passengers.map((p) => ({
        name: p.name,
        phone: p.phone,
        email: p.email,
      })),
    });

    if (bookingResult.success && bookingResult.data) {
      router.push(
        `/dashboard/passenger/bookings?status=pending&bookingId=${bookingResult.data.id}`,
      );
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="text-muted-foreground">Trip not found</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link href="/search">Back to Search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href={`/booking?tripId=${tripId}`}>
          <ArrowLeft className="h-4 w-4" />
          Back to Seat Selection
        </Link>
      </Button>

      <div className="mb-8">
        <p className="mb-2 text-sm font-medium text-primary">Secure booking</p>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Complete your booking
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose your journey points and add details for every selected
          passenger.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Bus className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{trip.bus?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTime(trip.departureTime)} -{" "}
                    {formatTime(trip.arrivalTime)} ·{" "}
                    {new Date(trip.travelDate).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right sm:ml-auto">
                  <p className="font-medium">
                    {trip.route?.source} → {trip.route?.destination}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedSeats.length} passenger
                    {selectedSeats.length === 1 ? "" : "s"} · Seats{" "}
                    {selectedSeats.map((s) => s.seat?.seatNumber).join(", ")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Boarding point */}
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-primary" />
                Boarding & Dropping Points
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Select where each passenger boards and leaves the bus.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {routeStopsLoading ? (
                <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading boarding and dropping points...
                </div>
              ) : !routeStops?.length ? (
                <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  No boarding points are configured for this route. Please go
                  back and choose another trip.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="from-stop">Boarding point</Label>
                    <Controller
                      control={control}
                      name="fromStopId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={routeStopsLoading}
                        >
                          <SelectTrigger id="from-stop">
                            <SelectValue placeholder="Select boarding point" />
                          </SelectTrigger>
                          <SelectContent>
                            {routeStops.map((stop) => (
                              <SelectItem key={stop.id} value={stop.id}>
                                {stop.stopOrder}. {stop.stopName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.fromStopId && (
                      <p className="text-xs text-destructive">
                        {errors.fromStopId.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="to-stop">Dropping point</Label>
                    <Controller
                      control={control}
                      name="toStopId"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={routeStopsLoading}
                        >
                          <SelectTrigger id="to-stop">
                            <SelectValue placeholder="Select dropping point" />
                          </SelectTrigger>
                          <SelectContent>
                            {routeStops.map((stop) => (
                              <SelectItem key={stop.id} value={stop.id}>
                                {stop.stopOrder}. {stop.stopName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.toStopId && (
                      <p className="text-xs text-destructive">
                        {errors.toStopId.message}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Passenger details */}
          <Card>
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4 text-primary" />
                Passenger Details ({selectedSeats.length})
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Add one passenger for each selected seat.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="rounded-xl border p-4 shadow-sm">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-foreground">
                      Passenger {index + 1}
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Seat {selectedSeats[index]?.seat?.seatNumber || "—"}
                    </span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label>Name</Label>
                      <Input
                        placeholder="Full name"
                        {...register(`passengers.${index}.name`)}
                      />
                      {errors.passengers?.[index]?.name && (
                        <p className="text-xs text-destructive">
                          {errors.passengers[index]?.name?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Phone</Label>
                      <Input
                        placeholder="01XXXXXXXXX"
                        {...register(`passengers.${index}.phone`)}
                      />
                      {errors.passengers?.[index]?.phone && (
                        <p className="text-xs text-destructive">
                          {errors.passengers[index]?.phone?.message}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...register(`passengers.${index}.email`)}
                      />
                      {errors.passengers?.[index]?.email && (
                        <p className="text-xs text-destructive">
                          {errors.passengers[index]?.email?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {!fields.length && (
                <div className="flex items-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                  <RouteIcon className="h-4 w-4" />
                  Select seats before entering passenger details.
                </div>
              )}
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleSubmit(onSubmit)}
            disabled={createBooking.isPending}
          >
            {createBooking.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating booking...
              </>
            ) : (
              `Create Booking · ${formatPrice(totalFare)}`
            )}
          </Button>
        </div>

        {/* Summary */}
        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              <h3 className="mb-4 font-heading text-lg font-semibold">
                Fare Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Bus Fare ({selectedSeats.length} ×{" "}
                    {formatPrice(trip?.fare || 0)})
                  </span>
                  <span className="font-medium">{formatPrice(totalFare)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(totalFare)}</span>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Seats Selected
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {selectedSeats.map((s) => s.seat?.seatNumber).join(", ") ||
                      "—"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
