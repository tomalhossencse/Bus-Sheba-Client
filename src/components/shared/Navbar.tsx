"use client";

import { useQueryClient } from "@tanstack/react-query";
import { log } from "console";
import {
  BriefcaseBusiness,
  KeyRound,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  Sun,
  Ticket,
  UserPlus,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGetme, useLogout } from "@/hooks";
import { BrandLogo } from "./BrandLogo";

function getInitials(name?: string | null) {
  const words = name?.trim().split(/\s+/).filter(Boolean) || [];
  if (!words.length) return "US";
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getProfileImage(image?: string | null) {
  const value = image?.trim();
  return value && value !== "null" && value !== "undefined" ? value : null;
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user, isLoading: userLoading } = useGetme();
  const { mutate: logout, isPending: logoutPending } = useLogout();

  const profileImage = getProfileImage(user?.data?.image);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Routes", href: "/routes" },
    { label: "Search", href: "/search" },
    { label: "Scan Ticket", href: "/tickets/scan" },
    { label: "Become an Operator", href: "/apply-operator" },
    { label: "Contact", href: "/contact" },
  ];

  const dashboardHref =
    user?.data?.role === "ADMIN"
      ? "/dashboard/admin"
      : user?.data?.role === "OPERATOR"
        ? "/dashboard/operator"
        : "/dashboard/passenger";

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: (result) => {
        toast.success(result.message || "Logged out successfully");
        router.push("/login");
        queryClient.removeQueries({ queryKey: ["user"] });
      },
      onError: (error) => {
        toast.error(error.message || "Logged out failed");
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
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <BrandLogo />

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
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

          {user?.data ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 rounded-full p-0"
                  aria-label="Open user menu"
                >
                  <Avatar>
                    {profileImage ? (
                      <AvatarImage src={profileImage} alt={user.data.name} />
                    ) : null}
                    <AvatarFallback className="relative z-0">
                      {getInitials(user.data.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="flex flex-col items-start gap-0.5">
                  <span className="max-w-full truncate font-semibold">
                    {user.data.name}
                  </span>
                  <span className="max-w-full truncate text-xs font-normal text-muted-foreground">
                    {user.data.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={dashboardHref}>
                    <LayoutDashboard /> Dashboard
                  </Link>
                </DropdownMenuItem>
                {user.data?.role === "PASSENGER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/passenger/bookings">
                      <Ticket /> My bookings
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/change-password">
                    <KeyRound /> Change password
                  </Link>
                </DropdownMenuItem>
                {user.data?.role === "PASSENGER" && (
                  <DropdownMenuItem asChild>
                    <Link href="/apply-operator">
                      <BriefcaseBusiness /> Apply as operator
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  disabled={logoutPending}
                  onClick={handleLogout}
                >
                  <LogOut /> {logoutPending ? "Logging out..." : "Log out"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="border-t bg-background md:hidden">
          <div className="space-y-1 px-4 pb-4 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t pt-2 mt-2 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
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
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={dashboardHref}>
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </Button>
                  {user.role === "PASSENGER" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/dashboard/passenger/bookings">
                        <Ticket className="h-4 w-4" />
                        My bookings
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/change-password">
                      <KeyRound className="h-4 w-4" />
                      Change password
                    </Link>
                  </Button>
                  {user.role === "PASSENGER" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/apply-operator">
                        <BriefcaseBusiness className="h-4 w-4" />
                        Apply as operator
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={logoutPending}
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    {logoutPending ? "Logging out..." : "Log out"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/login">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href="/register">
                      <UserPlus className="h-4 w-4" />
                      Register
                    </Link>
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="sm"
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
