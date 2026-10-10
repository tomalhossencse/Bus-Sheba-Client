"use client";

import { useState } from "react";
import type { UserProfile } from "@/lib/types";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";

interface DashboardShellProps {
  user?: UserProfile;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar
        user={user}
        mobileOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar user={user} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 bg-muted/20">{children}</main>
      </div>
    </div>
  );
}
