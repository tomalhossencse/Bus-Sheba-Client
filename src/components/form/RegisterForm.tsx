"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, MailCheck, Send, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { registerUser, verifyEmailOTP } from "@/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useRegister } from "@/hooks/auth.hook";
import { extractApiError } from "@/lib/api";
import {
  registerSchema,
  verifyEmailSchema,
} from "@/validation/auth.validation";

type RegisterStep = "details" | "otp";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<RegisterStep>("details");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const otpForm = useForm({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmitDetails = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      if (result.success) {
        setEmail(data.email);
        otpForm.setValue("email", data.email);
        setStep("otp");
        toast.success("OTP sent to your email");
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await verifyEmailOTP({
        email: data.email,
        otp: data.otp,
      });
      if (result.success) {
        toast.success("Email verified! Welcome to BusSheba");
        router.push("/dashboard/passenger");
      } else {
        setError(result.message || "Invalid OTP");
      }
    } catch (err: unknown) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-heading text-2xl">Create Account</CardTitle>
        <CardDescription>
          {step === "details"
            ? "Join BusSheba to book your tickets"
            : "We sent a 6-digit code to your email"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {step === "details" ? (
          <form onSubmit={handleSubmit(onSubmitDetails)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars with upper, lower, number & special"
                  {...register("password")}
                  className="pr-12"
                />
                <button
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <Send className="h-4 w-4" />
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </form>
        ) : (
          <form
            onSubmit={otpForm.handleSubmit(onSubmitOtp)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="otp">6-Digit OTP</Label>
              <Input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="text-center text-2xl tracking-[0.5em]"
                {...otpForm.register("otp")}
              />
              {otpForm.formState.errors.otp && (
                <p className="text-xs text-destructive">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              <MailCheck className="h-4 w-4" />
              {loading ? "Verifying..." : "Verify Email"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs"
              onClick={() => setStep("details")}
            >
              Change email
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
