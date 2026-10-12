"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { toast } from "sonner";
import { changePassword } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetme } from "@/hooks";
import { extractApiError } from "@/lib/api";
import { changePasswordSchema } from "@/validation";

export default function ChangePasswordPage() {
  const { data: user } = useGetme();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: { oldPassword: "", newPassword: "" },
    validators: {
      onSubmit: changePasswordSchema.omit({ email: true }),
    },
    onSubmit: async ({ value }) => submit(value),
  });

  const submit = async (value: {
    oldPassword: string;
    newPassword: string;
  }) => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const result = await changePassword({
        email: user.email,
        oldPassword: value.oldPassword,
        newPassword: value.newPassword,
      });
      toast.success(result.message || "Password changed successfully");
      form.reset();
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
        <form
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5 rounded-lg border p-6"
        >
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Current password</Label>
            <form.Field name="oldPassword">
              {(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New password</Label>
            <form.Field name="newPassword">
              {(field) => (
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
          </div>
          <Button disabled={loading || !user}>
            {loading ? "Saving..." : "Change password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
