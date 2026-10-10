"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetme } from "@/hooks";
import type { UserRole } from "@/types";
import AccessDenied from "./access-denied";
import AuthLoading from "./auth-loading";

interface IProps {
  children: React.ReactNode;
  roles: UserRole[];
}

const RoleGuard = ({ children, roles }: IProps) => {
  const { data, isPending, isError } = useGetme();
  const router = useRouter();
  const pathname = usePathname();

  const user = data?.data;
  const isAuthenticated = !!user;
  const isAuthorized = isAuthenticated && roles.includes(user.role);

  useEffect(() => {
    if (!isPending && (isError || !isAuthenticated)) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, isError, isAuthenticated, router, pathname]);

  if (isPending) {
    return <AuthLoading />;
  }
  if (isAuthorized) {
    return <>{children}</>;
  }
  return <AccessDenied />;
};

export default RoleGuard;
