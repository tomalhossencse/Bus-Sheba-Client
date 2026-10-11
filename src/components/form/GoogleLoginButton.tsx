"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { getMe } from "@/api";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from "@/hooks";
import { extractApiError } from "@/lib/api";
import type { UserRole } from "@/types";

const GoogleIcon = () => (
  <svg
    aria-hidden="true"
    className="size-4"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill="#4285F4"
      d="M21.35 12.27c0-.73-.07-1.43-.2-2.1H12v3.98h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.7 2.91-4.2 2.91-7.27Z"
    />
    <path
      fill="#34A853"
      d="M12 21.6c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.74 9.74 0 0 0 12 21.6Z"
    />
    <path
      fill="#FBBC05"
      d="M6.53 13.68A5.86 5.86 0 0 1 6.22 12c0-.58.1-1.15.31-1.68V7.79H3.29A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.21l3.24-2.53Z"
    />
    <path
      fill="#EA4335"
      d="M12 6.29c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.4 14.63 2.4 12 2.4a9.74 9.74 0 0 0-8.71 5.39l3.24 2.53C7.3 8.01 9.46 6.29 12 6.29Z"
    />
  </svg>
);

export const GoogleLoginComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { mutate: googleLogin, isPending } = useGoogleLogin();
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const getDashboardRoute = (role?: UserRole) => {
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      return "/dashboard/admin";
    }
    if (role === "OPERATOR") {
      return "/dashboard/operator";
    }
    if (role === "PASSENGER") {
      return "/dashboard/passenger";
    }
    return "/";
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast.error("Google login failed. No credential was received.");
      return;
    }

    googleLogin(
      { idToken },
      {
        onSuccess: async (res) => {
          setIsLoadingProfile(true);
          try {
            const profile = await getMe();
            const redirectTo =
              searchParams.get("redirectTo") ||
              getDashboardRoute(profile.data.role);

            toast.success(res.message || "Login successful");
            router.replace(redirectTo);
          } catch (error: unknown) {
            toast.error(
              extractApiError(error) ||
                "Login succeeded, but your profile could not be loaded.",
            );
          } finally {
            setIsLoadingProfile(false);
          }
        },
        onError: (err: unknown) => {
          toast.error(
            extractApiError(err) || "Google Login failed. Please try again.",
          );
        },
      },
    );
  };

  const handleGoogleError = () => {
    toast.error("Google Login failed. Please try again.");
  };

  if (!googleClientId) {
    return (
      <Button type="button" variant="outline" className="w-full" disabled>
        Google sign-in is unavailable
      </Button>
    );
  }

  return (
    <div className="relative h-10 w-full">
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full rounded-md"
        disabled={isPending || isLoadingProfile}
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <div
        className="absolute inset-0 z-10 overflow-hidden opacity-0"
        aria-hidden="true"
      >
        <GoogleLogin
          theme="outline"
          shape="rectangular"
          text="continue_with"
          width={400}
          containerProps={{
            className: "h-10 w-full max-w-[400px]",
          }}
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap={false}
        />
      </div>
      {(isPending || isLoadingProfile) && (
        <span className="sr-only">Signing in with Google...</span>
      )}
    </div>
  );
};
export default GoogleLoginComponent;
