"use client";

import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-8 shadow-xl">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
          Page Not Found
        </h3>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Button
            onClick={() => window.history.back()}
            variant="default"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Go Back
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
