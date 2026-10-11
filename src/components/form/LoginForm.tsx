"use client";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks";
import { extractApiError } from "@/lib/api";
import type { UserRole } from "@/types";
import { loginZodSchema } from "@/validation";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import GoogleLoginButton from "./GoogleLoginButton";

const demoAccounts = [
  {
    label: "Admin demo",
    email: "testeradmin@gmail.com",
    password: "Tester@dmin1",
  },
  {
    label: "Operator demo",
    email: "testeroperator@gmail.com",
    password: "Tester@operator1",
  },
  {
    label: "Passenger demo",
    email: "passenger1@gmail.com",
    password: "Password123!",
  },
] as const;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending: loginPending } = useLogin();

  const handleLoginSuccess = (res: {
    message?: string;
    data?: { user?: { role?: UserRole } };
  }) => {
    toast.success(res.message || "Login successful");

    const userRole = res.data?.user?.role;

    let dashboardRoute = "/";
    if (userRole === "ADMIN" || userRole === "SUPER_ADMIN") {
      dashboardRoute = "/dashboard/admin";
    } else if (userRole === "OPERATOR") {
      dashboardRoute = "/dashboard/operator";
    } else if (userRole === "PASSENGER") {
      dashboardRoute = "/dashboard/passenger";
    }

    const redirectTo = searchParams.get("redirectTo") || dashboardRoute;
    router.replace(redirectTo);
  };

  const handleLoginError = (error: unknown) => {
    toast.error(extractApiError(error) || "Login failed. Please try again.");
  };

  const handleDemoLogin = (email: string, password: string) => {
    login(
      { email, password },
      {
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
      },
    );
  };

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginZodSchema,
    },
    onSubmit: ({ value }) => {
      const loginData = {
        email: value.email,
        password: value.password,
      };

      login(loginData, {
        onSuccess: handleLoginSuccess,
        onError: handleLoginError,
      });
    },
  });
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Welcome Back</CardTitle>
        <CardDescription>Sign in to your BusSheba account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <FieldGroup>
            {/* email */}
            <form.Field name="email">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      onChange={(e) => field.handleChange(e.target.value)}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      placeholder="you@example.com"
                      type="email"
                      autoComplete="off"
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* password */}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forget-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div>
                <form.Field name="password">
                  {(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field className="" data-invalid={isInvalid}>
                        <div className="relative">
                          <Input
                            id={field.name}
                            name={field.name}
                            onChange={(e) => field.handleChange(e.target.value)}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            autoComplete="off"
                            aria-invalid={isInvalid}
                          />
                          <button
                            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                          >
                            {showPassword ? (
                              <EyeClosed className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </div>
                      </Field>
                    );
                  }}
                </form.Field>
              </div>
            </div>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={loginPending}
          >
            <LogIn className="h-4 w-4" />
            {loginPending ? (
              <>
                <Spinner /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            or continue with
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <GoogleLoginButton />

        <div className="mt-6 space-y-2">
          <p className="text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Demo accounts
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {demoAccounts.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                size="sm"
                disabled={loginPending}
                onClick={() => handleDemoLogin(account.email, account.password)}
              >
                {account.label}
              </Button>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
