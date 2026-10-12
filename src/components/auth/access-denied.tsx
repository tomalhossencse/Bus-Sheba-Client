import { ArrowLeft, House, Route, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";

const AccessDenied = () => {
  return (
    <main className="relative isolate flex min-h-[60vh] items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_48%)]" />
      <div className="w-full max-w-lg">
        <div className="mb-8 flex justify-center">
          <BrandLogo />
        </div>

        <div className="rounded-3xl border bg-card/90 p-8 text-center shadow-xl shadow-foreground/5 backdrop-blur-sm sm:p-10">
          <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
            <ShieldAlert className="size-9" strokeWidth={1.8} />
          </div>
          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Restricted area
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">
            Access denied
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
            This page is reserved for a different account type. If you think
            this is a mistake, please contact your administrator.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button variant="outline" asChild>
              <Link href="/">
                <House className="size-4" />
                Back to home
              </Link>
            </Button>
            <Button asChild>
              <Link href="/routes">
                <Route className="size-4" />
                Browse bus routes
              </Link>
            </Button>
          </div>
        </div>

        <Link
          href="/"
          className="mx-auto mt-6 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Return to a safe place
        </Link>
      </div>
    </main>
  );
};

export default AccessDenied;
