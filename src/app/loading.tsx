import { Loader2 } from "lucide-react";
import { BrandLogo } from "@/components/shared/BrandLogo";

export default function Loading() {
  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_44%)]" />
      <div className="relative flex w-full max-w-sm flex-col items-center text-center">
        <BrandLogo />
        <div className="mt-12 flex size-20 items-center justify-center rounded-3xl border bg-card shadow-lg shadow-foreground/5">
          <Loader2
            className="size-9 animate-spin text-primary"
            aria-hidden="true"
          />
        </div>
        <h1 className="mt-7 font-heading text-2xl font-bold tracking-tight">
          Preparing your journey
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          We&apos;re getting everything ready for you. This should only take a
          moment.
        </p>
        <div className="mt-8 flex items-center gap-2" aria-hidden="true">
          <span className="size-1.5 animate-pulse rounded-full bg-primary" />
          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        </div>
      </div>
    </main>
  );
}
