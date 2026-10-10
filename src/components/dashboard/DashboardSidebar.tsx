"use client";

import { useQueryClient } from "@tanstack/react-query";
import { LogOut, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { BrandLogo } from "@/components/shared/BrandLogo";
import { Button } from "@/components/ui/button";
import { useGetme, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { type NavItem, navsByRole } from "@/routes/sidebarNavs";

interface DashboardSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  mobileOpen,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const { data: user } = useGetme();

  const role = user.data?.role || "PASSENGER";
  const navs: NavItem[] =
    navsByRole[role as keyof typeof navsByRole] || navsByRole.PASSENGER;

  const { mutate: logout } = useLogout();
  const router = useRouter();
  const queryClient = useQueryClient();

  //     const result = await getMe();
  //   console.log("DashboardLayout getMe result:", result);
  //   const user = result?.success ? result.data : null;

  //   if (!user) {
  //     redirect("/login?reason=session");
  //   }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <BrandLogo className="text-lg" onClick={onClose} />
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navs.map((nav) => {
            const isActive =
              pathname === nav.href || pathname.startsWith(nav.href + "/");
            return (
              <Link
                key={nav.href}
                href={nav.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <nav.icon className="h-4 w-4 shrink-0" />
                {nav.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="border-t p-3">
          <div className="mb-2 flex items-center gap-3 rounded-md bg-muted/50 p-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {user?.data?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.data?.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.role}
              </p>
            </div>
          </div>
          <form
            action={async () => {
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
            }}
          >
            <Button
              type="submit"
              variant="ghost"
              className="w-full justify-start gap-2 text-muted-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </aside>
    </>
  );
}
