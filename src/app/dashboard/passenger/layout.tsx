import RoleGuard from "@/components/auth/role-guard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard roles={["PASSENGER"]}>
      <DashboardShell>{children}</DashboardShell>
    </RoleGuard>
  );
}
