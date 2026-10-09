import { ShieldCheck, Sparkles } from "lucide-react";
import { BusSearchBar } from "./BusSearchBar";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute -right-32 top-10 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Bangladesh&apos;s smarter way to travel
          </div>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Book Bus Tickets{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Anytime, Anywhere
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-xl">
            Compare buses, choose your seat, and travel across Bangladesh with
            ease. Safe, reliable, and affordable.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mx-auto mt-8 max-w-4xl">
          <BusSearchBar />
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-primary" /> Secure booking
          </span>
          <span>•</span>
          <span>Real-time seat selection</span>
          <span>•</span>
          <span>Instant e-ticket</span>
        </div>
      </div>
    </section>
  );
}
