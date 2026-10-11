"use client";

import { CloudOff, Ticket, TrendingUp, Wallet } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePassengerAnalytics } from "@/hooks";
import { formatDate, formatPrice, formatTime } from "@/utils";

function statusVariant(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "secondary";
    case "COMPLETED":
      return "default";
    case "CANCELLED":
    case "EXPIRED":
      return "destructive";
    default:
      return "outline";
  }
}

export default function PassengerDashboardPage() {
  const { data: analytics, isLoading, isError } = usePassengerAnalytics();

  if (isError) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
          Failed to load your dashboard.
        </div>
      </div>
    );
  }

  const summary = analytics?.summary;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">My Dashboard</h1>
        <p className="text-sm text-muted-foreground">Your travel summary</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_) => (
            <Skeleton key={Math.random()} className="h-24" />
          ))
        ) : (
          <>
            <StatCard
              icon={Ticket}
              label="Total Bookings"
              value={summary?.totalBookings || 0}
            />
            <StatCard
              icon={Ticket}
              label="Active"
              value={summary?.activeBookings || 0}
            />
            <StatCard
              icon={Ticket}
              label="Cancelled"
              value={summary?.cancelledBookings || 0}
            />
            <StatCard
              icon={Wallet}
              label="Total Spent"
              value={formatPrice(summary?.totalSpent || 0)}
              iconClassName="bg-emerald-500/10 text-emerald-600"
            />
            <StatCard
              icon={Wallet}
              label="Refunded"
              value={
                summary?.totalRefunded
                  ? formatPrice(summary.totalRefunded)
                  : "—"
              }
            />
            <StatCard
              icon={TrendingUp}
              label="Trips Taken"
              value={summary?.totalTripsTaken || 0}
            />
          </>
        )}
      </div>

      {/* Upcoming trips */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">
              Upcoming Trips
            </h2>
            <Link
              href="/dashboard/passenger/bookings"
              className="text-sm text-primary hover:underline"
            >
              All bookings
            </Link>
          </div>

          {isLoading ? (
            <Skeleton className="h-32" />
          ) : analytics?.upcomingTrips?.length ? (
            <div className="space-y-3">
              {analytics.upcomingTrips.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {booking.trip?.route?.source} →{" "}
                        {booking.trip?.route?.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {booking.trip
                          ? formatDate(booking.trip.travelDate)
                          : "—"}{" "}
                        ·{" "}
                        {booking.trip
                          ? formatTime(booking.trip.departureTime)
                          : "—"}{" "}
                        · {booking.trip?.bus?.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      {formatPrice(booking.totalAmount)}
                    </span>
                    <Badge variant={statusVariant(booking.status)}>
                      {booking.status}
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/dashboard/passenger/bookings">Details</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <CloudOff className="mx-auto mb-2 h-8 w-8" />
              No upcoming trips. Plan your next journey!
              <div className="mt-3">
                <Button asChild variant="outline">
                  <Link href="/search">Search Buses</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
