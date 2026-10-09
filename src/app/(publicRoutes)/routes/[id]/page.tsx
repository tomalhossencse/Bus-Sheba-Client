import { ArrowLeft, Bus, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Route Details | BusSheba",
  description: "View route details and available buses",
};

// Static mock data for a specific route
const routeData = {
  id: "route-1",
  origin: "Dhaka",
  destination: "Chattogram",
  distance: 250,
  estimatedDuration: "6h 30m",
  trips: [
    {
      id: "t1",
      name: "Green Line Paribahan",
      type: "AC",
      depart: "06:00",
      arrive: "12:30",
      price: 850,
      seats: 12,
    },
    {
      id: "t2",
      name: "Shohagh Paribahan",
      type: "NON_AC",
      depart: "07:00",
      arrive: "13:30",
      price: 550,
      seats: 20,
    },
    {
      id: "t3",
      name: "Hanif Enterprise",
      type: "AC",
      depart: "08:00",
      arrive: "14:30",
      price: 900,
      seats: 6,
    },
    {
      id: "t4",
      name: "Ena Transport",
      type: "SLEEPER",
      depart: "21:00",
      arrive: "03:30",
      price: 1200,
      seats: 15,
    },
  ],
};

export default function RouteDetailPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/routes">
          <ArrowLeft className="h-4 w-4" />
          Back to Routes
        </Link>
      </Button>

      {/* Route header */}
      <div className="mb-8 rounded-2xl border bg-card p-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="font-heading text-2xl font-bold">
              {routeData.origin} → {routeData.destination}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Distance: {routeData.distance} km
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">
              {routeData.estimatedDuration}
            </span>
          </div>
        </div>
      </div>

      {/* Bus cards */}
      <div className="space-y-4">
        {routeData.trips.map((trip) => (
          <Card key={trip.id}>
            <CardContent className="p-5">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Bus className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold">{trip.name}</p>
                    <Badge variant="secondary" className="mt-1">
                      {trip.type}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center gap-8 text-center">
                  <div>
                    <p className="text-lg font-bold">{trip.depart}</p>
                    <p className="text-xs text-muted-foreground">Departs</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {routeData.estimatedDuration}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{trip.arrive}</p>
                    <p className="text-xs text-muted-foreground">Arrives</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">
                      ৳{trip.price}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {trip.seats} seats left
                    </p>
                  </div>
                  <Button asChild>
                    <Link href={`/booking/result?tripId=${trip.id}`}>
                      Select Seat
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
