"use client";

import { ArrowLeft, Compass, Home, SearchX } from "lucide-react";
import Link from "next/link";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_15%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_46%)]" />
      <div className="w-full max-w-xl text-center">
        <div className="mb-10 flex justify-center">
          <BrandLogo />
        </div>

        <div className="mx-auto flex size-28 items-center justify-center rounded-[2rem] border bg-card shadow-xl shadow-foreground/5">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <SearchX className="size-8" strokeWidth={1.8} />
          </div>
        </div>

        <p className="mt-8 font-mono text-sm font-semibold tracking-[0.28em] text-primary">
          ERROR 404
        </p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          This stop doesn&apos;t exist
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          The page you&apos;re looking for may have moved, expired, or never
          existed. Let&apos;s get you back on route.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button onClick={() => window.history.back()} variant="outline">
            <ArrowLeft className="size-4" />
            Go back
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="size-4" />
              Back to home
            </Link>
          </Button>
        </div>

        <Link
          href="/routes"
          className="mx-auto mt-7 flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Compass className="size-4" />
          Explore available routes
        </Link>
      </div>
    </main>
  );
}
