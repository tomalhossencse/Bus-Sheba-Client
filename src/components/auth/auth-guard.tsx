"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useGetme } from "@/hooks";
import AuthLoading from "./auth-loading";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isPending, isError } = useGetme();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAuthenticated = !!user;

  useEffect(() => {
    if (!isPending && (isError || !isAuthenticated)) {
      const queryString = searchParams.toString();
      const redirectTo = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
    }
  }, [isPending, isError, isAuthenticated, router, pathname, searchParams]);

  if (isPending) {
    return <AuthLoading />;
  }
  if (isAuthenticated) {
    return <>{children}</>;
  }
  return <AuthLoading />;
};

export default AuthGuard;
