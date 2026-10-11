"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  BriefcaseBusiness,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Ticket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { useLogout } from "@/hooks";
import { extractApiError } from "@/lib/api";
import type { UserProfile } from "@/lib/types";

export function getInitials(name?: string | null) {
  const words = name?.trim().split(/\s+/).filter(Boolean) || [];
  if (!words.length) return "US";
  return words
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getProfileImage(image?: string | null) {
  const value = image?.trim();
  return value && value !== "null" && value !== "undefined" ? value : null;
}

function getDashboardHref(role: UserProfile["role"]) {
  return role === "ADMIN" || role === "SUPER_ADMIN"
    ? "/dashboard/admin"
    : role === "OPERATOR"
      ? "/dashboard/operator"
      : "/dashboard/passenger";
}

interface UserMenuProps {
  user: UserProfile;
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate: logout, isPending: logoutPending } = useLogout();
  const profileImage = getProfileImage(user.image);

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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 w-10 rounded-full p-0"
          aria-label="Open user menu"
        >
          <Avatar>
            {profileImage ? (
              <AvatarImage src={profileImage} alt={user.name} />
            ) : null}
            <AvatarFallback className="relative z-0">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="flex flex-col items-start gap-0.5">
          <span className="max-w-full truncate font-semibold">{user.name}</span>
          <span className="max-w-full truncate text-xs font-normal text-muted-foreground">
            {user.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getDashboardHref(user.role)}>
            <LayoutDashboard /> Dashboard
          </Link>
        </DropdownMenuItem>
        {user.role === "PASSENGER" && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard/passenger/bookings">
              <Ticket /> My bookings
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link href={`${getDashboardHref(user.role)}/change-password`}>
            <KeyRound /> Change password
          </Link>
        </DropdownMenuItem>
        {user.role === "PASSENGER" && (
          <DropdownMenuItem asChild>
            <Link href="/apply-operator">
              <BriefcaseBusiness /> Apply as operator
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={logoutPending} onClick={handleLogout}>
          <LogOut /> {logoutPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
