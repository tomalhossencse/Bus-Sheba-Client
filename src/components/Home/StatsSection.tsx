import { Bus, Clock, ShieldCheck, Wallet } from "lucide-react";

const stats = [
  {
    icon: Bus,
    title: "200+",
    subtitle: "Partner Buses",
  },
  {
    icon: ShieldCheck,
    title: "50,000+",
    subtitle: "Happy Passengers",
  },
  {
    icon: Clock,
    title: "100+",
    subtitle: "Daily Trips",
  },
  {
    icon: Wallet,
    title: "64",
    subtitle: "Districts Covered",
  },
];

export function StatsSection() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold sm:text-3xl">
                  {stat.title}
                </p>
                <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
