"use client";

import Link from "next/link";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { forgetPassword } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await forgetPassword(email);
      toast.success(result.message || "OTP sent to your email");
      window.location.href = `/reset-password?email=${encodeURIComponent(email)}`;
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Forgot password?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We will send a verification code to your email.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
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
