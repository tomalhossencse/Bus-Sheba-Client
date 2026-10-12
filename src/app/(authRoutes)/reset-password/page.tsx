"use client";

import { useForm } from "@tanstack/react-form";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";
import { resetPasswordSchema } from "@/validation";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: params.get("email") || "",
      otp: "",
      newPassword: "",
    },
    validators: { onSubmit: resetPasswordSchema },
    onSubmit: async ({ value }) => submit(value),
  });

  const submit = async (value: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    setLoading(true);
    try {
      const result = await resetPassword({
        email: value.email,
        otp: value.otp,
        newPassword: value.newPassword,
      });
      toast.success(result.message || "Password reset successfully");
      window.location.href = "/login";
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-5"
    >
      <div>
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the OTP sent to your email and choose a new password.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <form.Field name="email">
          {(field) => (
            <Input
              id={field.name}
              name={field.name}
              type="email"
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
      </div>
      <div className="space-y-2">
        <Label htmlFor="otp">OTP</Label>
        <form.Field name="otp">
          {(field) => (
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(event) => field.handleChange(event.target.value)}
              onBlur={field.handleBlur}
            />
          )}
        </form.Field>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <form.Field name="newPassword">
            {(field) => (
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? "text" : "password"}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
          <button
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeClosed className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
      <Button className="w-full" disabled={loading}>
        {loading ? "Resetting..." : "Reset password"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link className="text-primary hover:underline" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
