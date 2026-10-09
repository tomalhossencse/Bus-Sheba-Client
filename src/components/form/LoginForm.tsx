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
import type { UserRole } from "@/types";
import { loginZodSchema } from "@/validation";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import GoogleLoginButton from "./GoogleLoginButton";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  //   const {
  //     register,
  //     handleSubmit,
  //     formState: { errors },
  //   } = useForm<LoginFormData>({
  //     resolver: zodResolver(loginSchema),
  //   });

  //   const onSubmit = async (data: LoginFormData) => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const result = await loginUser(data);
  //       if (result.success) {
  //         toast.success(result.message || "Login successful");
  //         const profile = await authService.me();
  //         const role = profile.data?.role;
  //         const requestedPath = searchParams.get("redirectUrl");
  //         const destination =
  //           requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
  //             ? requestedPath
  //             : null;
  //         if (role === "ADMIN" || role === "SUPER_ADMIN") {
  //           router.replace(
  //             destination?.startsWith("/dashboard/admin")
  //               ? destination
  //               : "/dashboard/admin",
  //           );
  //         } else if (role === "OPERATOR") {
  //           router.replace(
  //             destination?.startsWith("/dashboard/operator")
  //               ? destination
  //               : "/dashboard/operator",
  //           );
  //         } else {
  //           router.replace(
  //             destination?.startsWith("/dashboard/passenger")
  //               ? destination
  //               : "/dashboard/passenger",
  //           );
  //         }
  //       } else {
  //         setError(result.message || "Invalid credentials");
  //       }
  //     } catch (err) {
  //       setError(extractApiError(err));
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  const { mutate: login, isPending: loginPending } = useLogin();

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
        onSuccess: (res) => {
          toast.success(res.message || "Login successful");

          const userRole: UserRole = res?.data?.user?.role;

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
        },
        onError: (err) => {
          console.log(err);
          toast.error(err.message || "Login failed. Please try again.");
        },
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
                          <Button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            type="button"
                            variant="link"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeClosed /> : <Eye />}
                          </Button>
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
