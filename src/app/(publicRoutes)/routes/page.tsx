import { ArrowRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { POPULAR_ROUTES } from "@/lib/types";

export const metadata = {
  title: "Bus Routes | BusSheba",
  description: "Explore all available bus routes across Bangladesh",
};

const allRoutes = [
  ...POPULAR_ROUTES,
  {
    origin: "Dhaka",
    destination: "Jashore",
    duration: "5 hrs",
    price: "500-1000",
  },
  {
    origin: "Dhaka",
    destination: "Bogura",
    duration: "4 hrs",
    price: "400-800",
  },
  {
    origin: "Dhaka",
    destination: "Cox's Bazar",
    duration: "8-9 hrs",
    price: "900-1600",
  },
  {
    origin: "Chattogram",
    destination: "Sylhet",
    duration: "6 hrs",
    price: "600-1000",
  },
  {
    origin: "Sylhet",
    destination: "Cox's Bazar",
    duration: "9 hrs",
    price: "800-1500",
  },
  {
    origin: "Dhaka",
    destination: "Khulna",
    duration: "5-6 hrs",
    price: "500-1000",
  },
];

export default function RoutesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Available Bus Routes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Browse all popular routes and start your journey
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allRoutes.map((route) => (
          <Link
            key={`${route.origin}-${route.destination}`}
            href={`/search?origin=${route.origin}&destination=${route.destination}`}
            className="group"
          >
            <Card className="h-full transition-all group-hover:border-primary/50 group-hover:shadow-lg">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{route.origin}</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold">{route.destination}</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {route.duration}
                  </span>
                  <span className="font-medium text-primary">
                    ৳{route.price}
                  </span>
                </div>
                <p className="mt-3 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View trips →
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
