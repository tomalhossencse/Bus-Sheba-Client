import type React from "react";
import AuthGuard from "@/components/auth/auth-guard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

export default layout;
