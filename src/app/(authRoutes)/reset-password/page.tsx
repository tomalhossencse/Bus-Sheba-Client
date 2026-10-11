"use client";

import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { resetPassword } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { extractApiError } from "@/lib/api";

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get("email") || "");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const result = await resetPassword({
        email,
        otp,
        newPassword,
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
    <form onSubmit={submit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the OTP sent to your email and choose a new password.
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
      <div className="space-y-2">
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            minLength={8}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
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
