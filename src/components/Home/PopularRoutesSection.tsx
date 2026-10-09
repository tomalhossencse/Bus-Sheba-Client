import { ArrowRight, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { POPULAR_ROUTES } from "@/lib/types";

export function PopularRoutesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 sm:py-20">
      <div className="mb-8 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Popular Routes
          </h2>
          <p className="mt-2 text-muted-foreground">
            Most traveled routes across Bangladesh
          </p>
        </div>
        <Link
          href="/search"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Explore all routes <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {POPULAR_ROUTES.map((route) => (
          <Link
            key={`${route.origin}-${route.destination}`}
            href={`/search?${new URLSearchParams({
              origin: route.origin,
              destination: route.destination,
            }).toString()}`}
          >
            <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
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
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
