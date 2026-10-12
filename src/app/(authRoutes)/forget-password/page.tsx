"use client";

import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { forgetPassword } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";
import { forgetPasswordSchema } from "@/validation";

export default function ForgetPasswordPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: { email: "" },
    validators: { onSubmit: forgetPasswordSchema },
    onSubmit: async ({ value }) => {
      await submit(value.email);
    },
  });

  const submit = async (value: string) => {
    setLoading(true);
    try {
      const result = await forgetPassword(value);
      toast.success(result.message || "OTP sent to your email");
      window.location.href = `/reset-password?email=${encodeURIComponent(value)}`;
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
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We will send a verification code to your email.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <form.Field name="email">
          {(field) => (
            <>
              <Input
                id={field.name}
                name={field.name}
                type="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
              />
              {field.state.meta.isTouched && !field.state.meta.isValid && (
                <p className="text-xs text-destructive">
                  {field.state.meta.errors[0]?.message}
                </p>
              )}
            </>
          )}
        </form.Field>
      </div>
      <Button className="w-full" disabled={loading}>
        {loading ? "Sending..." : "Send OTP"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        <Link className="text-primary hover:underline" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
