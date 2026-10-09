import { ScanLine } from "lucide-react";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden border-y bg-primary">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
          Ready to Travel Across Bangladesh?
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/80">
          Join thousands of happy passengers who book their bus tickets with
          BusSheba. Fast, secure, and hassle-free.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/search"
            className="inline-flex h-11 items-center justify-center rounded-md bg-primary-foreground px-6 text-sm font-semibold text-primary shadow transition hover:bg-primary-foreground/90"
          >
            Book Your Ticket Now
          </Link>
          <Link
            href="/tickets/scan"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-primary-foreground/40 px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
          >
            <ScanLine className="h-4 w-4" />
            Scan Ticket
          </Link>
        </div>
      </div>
    </section>
  );
}
