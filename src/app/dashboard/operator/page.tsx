"use client";

import {
  Bus,
  Calendar,
  MapIcon,
  Ticket,
  TrendingUp,
  UserRound,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOperatorAnalytics } from "@/hooks";
import { formatPrice } from "@/utils";

export default function OperatorDashboardPage() {
  const { data: analytics, isLoading, isError } = useOperatorAnalytics();

  if (isError) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
          Failed to load analytics. Please check your connection.
        </div>
      </div>
    );
  }

  const summary = analytics?.summary;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">
          {analytics?.operator?.companyName || "Operator"} Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Your fleet at a glance</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_) => (
            <Skeleton key={Math.random()} className="h-24" />
          ))
        ) : (
          <>
            <StatCard
              icon={Wallet}
              label="Revenue"
              value={formatPrice(summary?.totalRevenue || 0)}
              iconClassName="bg-emerald-500/10 text-emerald-600"
            />
            <StatCard
              icon={Bus}
              label="Buses"
              value={summary?.totalBuses || 0}
            />
            <StatCard
              icon={Calendar}
              label="Trips"
              value={summary?.totalTrips || 0}
            />
            <StatCard
              icon={Ticket}
              label="Bookings"
              value={summary?.totalBookings || 0}
              sub={`${summary?.activeBookings || 0} active`}
            />
            <StatCard
              icon={TrendingUp}
              label="Occupancy"
              value={`${Math.round(summary?.occupancyRate || 0)}%`}
              sub={`${summary?.bookedSeats || 0}/${summary?.totalSeats || 0} seats`}
            />
            <StatCard
              icon={Wallet}
              label="Paid"
              value={summary?.totalPaidPayments || 0}
              sub="payments"
            />
            <StatCard
              icon={Ticket}
              label="Cancelled"
              value={summary?.cancelledBookings || 0}
            />
            <StatCard
              icon={UserRound}
              label="Operator ID"
              value={analytics?.operator?.id?.slice(0, 8) || "—"}
            />
          </>
        )}
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Top Routes</h2>
            <Link
              href="/dashboard/operator/analytics"
              className="text-sm text-primary hover:underline"
            >
              Analytics
            </Link>
          </div>

          {isLoading ? (
            <Skeleton className="h-32" />
          ) : analytics?.topRoutes?.length ? (
            <div className="space-y-3">
              {analytics.topRoutes.slice(0, 5).map((r, i) => (
                <div
                  key={`${r.tripId}-${i}`}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-sm font-semibold text-primary">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">
                        {r.source} → {r.destination}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {r.routeName}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{r.bookings} bookings</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <MapIcon className="mx-auto mb-2 h-8 w-8" />
              No route analytics yet
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
