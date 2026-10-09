import {
  ArrowRight,
  Calendar,
  CreditCard,
  Search,
  TicketCheck,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Search Buses",
    description: "Enter your route and travel date to find available buses.",
  },
  {
    icon: Calendar,
    step: "02",
    title: "Select Trip & Seat",
    description: "Pick a bus and choose your preferred seat from the map.",
  },
  {
    icon: CreditCard,
    step: "03",
    title: "Pay Securely",
    description: "Complete your payment using your preferred method.",
  },
  {
    icon: TicketCheck,
    step: "04",
    title: "Travel with E-Ticket",
    description: "Show your digital ticket to board the bus. Simple!",
  },
];

export function HowItWorksSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          How It Works
        </h2>
        <p className="mt-2 text-muted-foreground">
          Booking your ticket in 4 easy steps
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step.title} className="relative">
            {index < steps.length - 1 && (
              <div className="absolute right-0 top-6 hidden h-px w-1/2 border-t-2 border-dashed border-muted-foreground/30 lg:block" />
            )}
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background">
                  {step.step}
                </span>
              </div>
              <h3 className="mb-1 font-heading text-lg font-semibold">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button size="lg" asChild>
          <Link href="/search">
            Start Booking Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
