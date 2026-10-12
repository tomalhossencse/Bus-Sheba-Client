"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  CalendarDays,
  ChevronRight,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Route,
  ScanLine,
  Search,
  Sun,
  Ticket,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useGetme, useLogout } from "@/hooks";
import { extractApiError } from "@/lib/api";
import { BrandLogo } from "./BrandLogo";
import { getInitials, getProfileImage, UserMenu } from "./UserMenu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useGetme();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const profileImage = getProfileImage(user?.image);

  const navLinks = [
    { label: "Home", href: "/", icon: LayoutDashboard },
    { label: "Routes", href: "/routes", icon: Route },
    { label: "Upcoming Trips", href: "/trips", icon: CalendarDays },
    { label: "Search", href: "/search", icon: Search },
    {
      label: "Become an Operator",
      href: "/apply-operator",
      icon: BriefcaseBusiness,
    },
    { label: "Scan Ticket", href: "/tickets/scan", icon: ScanLine },
  ];

  const dashboardHref =
    user?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.role === "OPERATOR"
        ? "/dashboard/operator"
        : "/dashboard/passenger";

  const isActiveLink = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (result) => {
        toast.success(result.message || "Logged out successfully");
        router.push("/login");
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: (error) => {
        toast.error(extractApiError(error) || "Logged out failed");
      },
    });
  };

  if (userLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 min-w-0 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <BrandLogo className="min-w-0 shrink" />

        <nav className="hidden items-center gap-0.5 rounded-xl border bg-muted/40 p-1 lg:flex">
          {navLinks.map((link) => (
            <div key={link.href} className="relative">
              <Link
                href={link.href}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
                className={`relative block rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  isActiveLink(link.href)
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border/60"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {link.label}
              </Link>
              {isActiveLink(link.href) && (
                <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hidden sm:inline-flex"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {user ? (
            <UserMenu user={user} />
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/register">
                  <UserPlus className="h-4 w-4" />
                  Register
                </Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-background/95 shadow-xl ring-1 ring-foreground/5 backdrop-blur-xl lg:hidden"
        >
          <div className="mx-auto max-w-7xl px-4 pb-5 pt-4 sm:px-6">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Navigation
            </p>
            <nav className="grid gap-1 sm:grid-cols-2">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={isActiveLink(link.href) ? "page" : undefined}
                    className={`group flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                      isActiveLink(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        isActiveLink(link.href)
                          ? "bg-primary/15"
                          : "bg-muted/70 group-hover:bg-background"
                      }`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="flex-1">{link.label}</span>
                    <ChevronRight className="size-4 opacity-40 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t pt-4">
              {user ? (
                <>
                  <div className="mb-2 flex items-center gap-3 rounded-xl border bg-muted/40 px-3.5 py-3">
                    <Avatar className="h-9 w-9">
                      {profileImage ? (
                        <AvatarImage src={profileImage} alt={user.name} />
                      ) : null}
                      <AvatarFallback className="relative z-0">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-1 sm:grid-cols-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href={dashboardHref}>
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    </Button>
                    {user.role === "PASSENGER" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <Link href="/dashboard/passenger/bookings">
                          <Ticket className="h-4 w-4" />
                          My bookings
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link href="/dashboard/change-password">
                        <KeyRound className="h-4 w-4" />
                        Change password
                      </Link>
                    </Button>
                    {user.role === "PASSENGER" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="w-full justify-start"
                      >
                        <Link href="/apply-operator">
                          <BriefcaseBusiness className="h-4 w-4" />
                          Apply as operator
                        </Link>
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={logoutPending}
                    onClick={handleLogout}
                    className="mt-2 w-full justify-start"
                  >
                    <LogOut className="h-4 w-4" />
                    {logoutPending ? "Logging out..." : "Log out"}
                  </Button>
                </>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full"
                  >
                    <Link href="/login">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild className="w-full">
                    <Link href="/register">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </Link>
                  </Button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 w-full justify-start border-t pt-3"
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                Toggle Theme
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
