import type React from "react";
import AuthGuard from "@/components/auth/auth-guard";
import RoleGuard from "@/components/auth/role-guard";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <RoleGuard roles={["PASSENGER"]}>{children}</RoleGuard>
    </AuthGuard>
  );
}
