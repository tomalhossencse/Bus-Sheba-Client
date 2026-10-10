"use client";

import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { applyOperator } from "@/api/operator.api";
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
import { useOperatorVerifyEmail } from "@/hooks";

type FormState = {
  name: string;
  email: string;
  password: string;
  companyName: string;
  phone: string;
  nidNumber: string;
  tradeLicenseNo: string;
  businessRegistrationNo: string;
  taxIdentificationNo: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  password: "",
  companyName: "",
  phone: "",
  nidNumber: "",
  tradeLicenseNo: "",
  businessRegistrationNo: "",
  taxIdentificationNo: "",
};

export default function ApplyOperatorPage() {
  const [form, setForm] = useState(initialForm);
  const [nidDocument, setNidDocument] = useState<File | null>(null);
  const [tradeLicenseDocument, setTradeLicenseDocument] = useState<File | null>(
    null,
  );
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);
  const [otp, setOtp] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: verifyEmail, isPending: isVerifying } =
    useOperatorVerifyEmail();

  const update =
    (key: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!nidDocument || !tradeLicenseDocument) {
      toast.error("NID and trade license documents are required");
      return;
    }

    setLoading(true);
    try {
      const result = await applyOperator({
        ...form,
        nidDocument,
        tradeLicenseDocument,
        additionalDocuments,
      });
      toast.success(result.message || "Application submitted");
      setSubmittedEmail(form.email);
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  const verify = async (event: FormEvent) => {
    event.preventDefault();
    const data = {
      email: submittedEmail,
      otp,
    };

    verifyEmail(data, {
      onSuccess: (response) => {
        toast.success(response.message || "Email verified successfully");
        window.location.href = "/login";
      },
      onError: (error) => {
        toast.error(error.message || "Failed to verify email");
      },
    });
  };

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We sent a 6-digit verification code to {submittedEmail}. Verify it
              to submit your operator application for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={verify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <Button className="w-full" disabled={isVerifying}>
                {isVerifying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}
                {isVerifying ? "Verifying..." : "Verify email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  const field = (
    key: keyof FormState,
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <div className="space-y-2">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        required
        value={form[key]}
        onChange={update(key)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Become a BusSheba operator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Register your transport business and start managing buses, routes,
          trips, and tickets.
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account information</CardTitle>
            <CardDescription>
              Create the account used to manage your operator dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {field("name", "Full name", "Your full name")}
            {field("email", "Email address", "operator@example.com", "email")}
            {field("password", "Password", "At least 8 characters", "password")}
            {field("companyName", "Company name", "Your transport company")}
            {field("phone", "Phone number", "01XXXXXXXXX", "tel")}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business verification</CardTitle>
            <CardDescription>
              Enter your legal business information exactly as shown on your
              documents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {field("nidNumber", "NID number", "10, 13, or 17 digits")}
            {field("tradeLicenseNo", "Trade license number", "5 to 15 digits")}
            {field(
              "businessRegistrationNo",
              "Business registration number",
              "Registration number",
            )}
            {field("taxIdentificationNo", "TIN", "12-digit TIN")}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nidDocument">NID document</Label>
                <Input
                  id="nidDocument"
                  type="file"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(event) =>
                    setNidDocument(event.target.files?.[0] || null)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tradeLicenseDocument">Trade license</Label>
                <Input
                  id="tradeLicenseDocument"
                  type="file"
                  required
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={(event) =>
                    setTradeLicenseDocument(event.target.files?.[0] || null)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalDocuments">
                Additional documents (optional)
              </Label>
              <Input
                id="additionalDocuments"
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) =>
                  setAdditionalDocuments(
                    Array.from(event.target.files || []).slice(0, 3),
                  )
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p>
                Your application will be reviewed by BusSheba administrators
                after email verification.
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="sm:min-w-52"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Submitting..." : "Submit application"}
            </Button>
          </CardContent>
        </Card>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
