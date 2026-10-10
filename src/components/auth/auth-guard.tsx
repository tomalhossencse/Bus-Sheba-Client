"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGetme } from "@/hooks";
import AuthLoading from "./auth-loading";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data, isPending, isError } = useGetme();
  const router = useRouter();
  const pathname = usePathname();
  const user = data?.data;
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isPending && (isError || !isAuthenticated)) {
      router.replace(`/login?redirectTo=${encodeURIComponent(pathname)}`);
    }
  }, [isPending, isError, isAuthenticated, router, pathname]);

  if (isPending) {
    return <AuthLoading />;
  }
  if (isAuthenticated) {
    return <>{children}</>;
  }
  return <AuthLoading />;
};

export default AuthGuard;
