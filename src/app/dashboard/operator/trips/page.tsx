"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useCancelTrip,
  useCreateTrip,
  useMyBuses,
  useMyTrips,
  useRoutes,
} from "@/hooks";
import { formatDate, formatPrice, formatTime } from "@/utils";
import {
  type CreateTripFormValues,
  combineDateTime,
  createTripFormSchema,
  formatISOLocal,
} from "@/validation";

function statusVariant(status: string) {
  switch (status) {
    case "COMPLETED":
      return "default";
    case "CANCELLED":
      return "destructive";
    case "DEPARTED":
      return "default";
    case "BOARDING":
      return "outline";
    default:
      return "secondary";
  }
}

export default function OperatorTripsPage() {
  const [page, setPage] = useState(1);
  const { data: tripData, isLoading } = useMyTrips({ page });
  const { data: busData } = useMyBuses();
  const { data: routeData } = useRoutes(1, 100, true);
  const trips = tripData?.data;
  const buses = busData?.data;
  const routes = routeData?.data;
  const createTrip = useCreateTrip();
  const cancelTrip = useCancelTrip();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<CreateTripFormValues>({
    resolver: zodResolver(createTripFormSchema),
    defaultValues: {
      busId: "",
      routeId: "",
      travelDate: "",
      departureTime: "",
      fare: 0,
    },
  });

  const travelDate = watch("travelDate");
  const departureTime = watch("departureTime");
  const routeId = watch("routeId");
  const selectedRoute = routes?.find((r) => r.id === routeId);
  const tripStatuses = [
    "SCHEDULED",
    "BOARDING",
    "DEPARTED",
    "COMPLETED",
    "CANCELLED",
  ] as const;

  const estimatedArrival =
    travelDate && departureTime && selectedRoute
      ? formatISOLocal(
          new Date(
            new Date(combineDateTime(travelDate, departureTime)).getTime() +
              selectedRoute.estimatedMinutes * 60000,
          ),
        )
      : null;

  const onSubmit = async (values: CreateTripFormValues) => {
    if (!selectedRoute) return;
    const departureDate = new Date(
      combineDateTime(values.travelDate, values.departureTime),
    );
    const arrivalDate = new Date(
      departureDate.getTime() + selectedRoute.estimatedMinutes * 60000,
    );

    await createTrip.mutateAsync({
      ...values,
      fare: Number(values.fare),
      travelDate: values.travelDate,
      departureTime: departureDate.toISOString(),
      arrivalTime: arrivalDate.toISOString(),
    });
    setOpen(false);
    reset();
  };

  return (
    <div className="space-y-5 p-3 sm:space-y-6 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">My Trips</h1>
          <p className="text-sm text-muted-foreground">
            Schedule and manage trips
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <CalendarPlus className="h-4 w-4" />
              Create Trip
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Create New Trip</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Bus</Label>
                <Controller
                  control={control}
                  name="busId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select bus" />
                      </SelectTrigger>
                      <SelectContent>
                        {buses?.map((bus) => (
                          <SelectItem key={bus.id} value={bus.id}>
                            {bus.name} ({bus.registrationNo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.busId && (
                  <p className="text-xs text-destructive">
                    {errors.busId.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Route</Label>
                <Controller
                  control={control}
                  name="routeId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select route" />
                      </SelectTrigger>
                      <SelectContent>
                        {routes?.map((route) => (
                          <SelectItem key={route.id} value={route.id}>
                            {route.name} ({route.source} → {route.destination})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.routeId && (
                  <p className="text-xs text-destructive">
                    {errors.routeId.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Travel Date</Label>
                <Input type="date" {...register("travelDate")} />
                {errors.travelDate && (
                  <p className="text-xs text-destructive">
                    {errors.travelDate.message}
                  </p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Departure Time</Label>
                  <Input type="time" {...register("departureTime")} />
                  {errors.departureTime && (
                    <p className="text-xs text-destructive">
                      {errors.departureTime.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Arrival Time</Label>
                  <Input
                    type="text"
                    readOnly
                    value={
                      estimatedArrival ? formatTime(estimatedArrival) : "—"
                    }
                    className="bg-muted text-muted-foreground"
                    placeholder="Auto from route"
                  />
                  <p className="text-xs text-muted-foreground">
                    Auto-calculated from route duration
                  </p>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Fare (BDT)</Label>
                <Input
                  type="number"
                  {...register("fare", { valueAsNumber: true })}
                  placeholder="1250"
                />
                {errors.fare && (
                  <p className="text-xs text-destructive">
                    {errors.fare.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createTrip.isPending}
              >
                {createTrip.isPending ? "Creating..." : "Create Trip"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="ALL" className="space-y-4">
        <TabsList className="flex h-auto max-w-full justify-start gap-1 overflow-x-auto">
          <TabsTrigger value="ALL" className="shrink-0">
            All ({trips?.length || 0})
          </TabsTrigger>
          {tripStatuses.map((status) => (
            <TabsTrigger key={status} value={status} className="shrink-0">
              {status.charAt(0) + status.slice(1).toLowerCase()} (
              {trips?.filter((trip) => trip.status === status).length || 0})
            </TabsTrigger>
          ))}
        </TabsList>

        {["ALL", ...tripStatuses].map((status) => {
          const filteredTrips =
            status === "ALL"
              ? trips
              : trips?.filter((trip) => trip.status === status);

          return (
            <TabsContent key={status} value={status}>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Bus</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Departure</TableHead>
                        <TableHead>Arrival</TableHead>
                        <TableHead>Fare</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 3 }).map(() => (
                          <TableRow key={Math.random()}>
                            <TableCell colSpan={8}>
                              <Skeleton className="h-10" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : filteredTrips?.length ? (
                        filteredTrips.map((trip) => (
                          <TableRow key={trip.id}>
                            <TableCell className="max-w-56 truncate font-medium">
                              {trip.route?.source} → {trip.route?.destination}
                            </TableCell>
                            <TableCell className="max-w-40 truncate text-sm">
                              {trip.bus?.name}
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
                            <TableCell className="bg-card text-right">
                              {(trip.status === "SCHEDULED" ||
                                trip.status === "BOARDING") && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="text-red-600"
                                  disabled={cancelTrip.isPending}
                                  onClick={() => cancelTrip.mutate(trip.id)}
                                >
                                  <X className="h-4 w-4" />
                                  Cancel
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="py-12 text-center text-muted-foreground"
                          >
                            No trips found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      {tripData?.meta && tripData.meta.totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Showing page {tripData.meta.page} of {tripData.meta.totalPages} (
            {tripData.meta.total} total trips)
          </p>
          <Pagination
            page={tripData.meta.page}
            totalPages={tripData.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
