import { Armchair, CreditCard, Search, TicketCheck } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Search & Compare",
    description:
      "Find the best bus with advanced search and compare various operators, timings, and prices in one place.",
  },
  {
    icon: Armchair,
    title: "Choose Your Seat",
    description:
      "Pick your preferred seat from the interactive seat map. Choose window, aisle, or more legroom.",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description:
      "Pay securely with bKash, Nagad, Rocket, or card. Multiple payment methods for your convenience.",
  },
  {
    icon: TicketCheck,
    title: "Instant E-Ticket",
    description:
      "Get your e-ticket instantly via SMS and email. No printing required - just show on your phone.",
  },
];

export function FeaturesSection() {
  return (
    <section className="border-y bg-muted/30 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose BusSheba?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Everything you need for a smooth journey
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
