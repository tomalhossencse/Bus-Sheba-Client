"use client";

import { Bus, MapIcon, Ticket, TrendingUp, Users, Wallet } from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/dashboard/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminAnalytics } from "@/hooks";
import { formatDateTime, formatPrice } from "@/utils";

export default function AdminDashboardPage() {
  const { data: analytics, isLoading, isError } = useAdminAnalytics();

  if (isError) {
    return (
      <div className="p-6">
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center text-destructive">
          Failed to load analytics. Please check your connection.
        </div>
      </div>
    );
  }

  const summary = analytics?.data.summary;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform-wide overview and management
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <Skeleton key={i} className="h-24" />
          ))
        ) : (
          <>
            <StatCard
              icon={Wallet}
              label="Total Revenue"
              value={formatPrice(summary?.totalRevenue || 0)}
              iconClassName="bg-emerald-500/10 text-emerald-600"
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={summary?.totalUsers || 0}
            />
            <StatCard
              icon={Bus}
              label="Total Buses"
              value={summary?.totalBuses || 0}
            />
            <StatCard
              icon={MapIcon}
              label="Total Routes"
              value={summary?.totalRoutes || 0}
            />
            <StatCard
              icon={Ticket}
              label="Total Bookings"
              value={summary?.totalBookings || 0}
              sub={`${summary?.activeBookings || 0} active`}
            />
            <StatCard
              icon={Users}
              label="Operators"
              value={summary?.totalOperators || 0}
            />
            <StatCard
              icon={TrendingUp}
              label="Paid Payments"
              value={summary?.totalPaidPayments || 0}
            />
            <StatCard
              icon={Ticket}
              label="Cancelled"
              value={summary?.cancelledBookings || 0}
            />
          </>
        )}
      </div>

      {/* Recent trips */}
      <Card>
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Recent Trips</h2>
            <Link
              href="/dashboard/admin/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {isLoading ? (
            <Skeleton className="h-40" />
          ) : analytics?.data?.recentTrips?.length ? (
            <div className="space-y-3">
              {analytics.data.recentTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {trip.route?.source} → {trip.route?.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trip.bus?.name} · {formatDateTime(trip.departureTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      {formatPrice(trip.fare)}
                    </p>
                    <Badge variant="secondary" className="mt-1">
                      {trip.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No recent trips
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
