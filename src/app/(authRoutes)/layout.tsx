"use client";

import { ArrowLeft, Moon, ShieldCheck, Sparkles, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex min-h-screen flex-col bg-muted/20">
      <header className="sticky top-0 z-50 border-b bg-background/85 shadow-sm backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent opacity-80" />
        <div className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute -inset-3 rounded-2xl bg-primary/10 blur-xl" />
            <BrandLogo className="relative" />
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border bg-background/70 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-xs sm:flex">
              <ShieldCheck className="size-4 text-primary" />
              <span>Secure account access</span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative rounded-full bg-background/70"
              aria-label="Toggle theme"
            >
              <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">Back to home</span>
                <span className="sm:hidden">Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10 sm:py-14">
        <Sparkles className="pointer-events-none absolute left-[12%] top-[15%] size-5 text-primary/40" />
        <Sparkles className="pointer-events-none absolute bottom-[18%] right-[12%] size-4 text-primary/30" />
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
