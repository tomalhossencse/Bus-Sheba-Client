"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetme } from "@/hooks";
import { extractApiError } from "@/lib/api";

export default function ChangePasswordPage() {
  const { data: user } = useGetme();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!user?.email) return;
    setLoading(true);
    try {
      const result = await changePassword({
        email: user.email,
        oldPassword,
        newPassword,
      });
      toast.success(result.message || "Password changed successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (error) {
      toast.error(extractApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Change password</h1>
          <p className="text-sm text-muted-foreground">
            Use your current password to set a new one.
          </p>
        </div>
        <form onSubmit={submit} className="space-y-5 rounded-lg border p-6">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current password</Label>
            <Input
              id="oldPassword"
              type="password"
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <Input
              id="newPassword"
              type="password"
              minLength={8}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button disabled={loading || !user}>
            {loading ? "Saving..." : "Change password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
