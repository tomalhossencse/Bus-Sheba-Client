"use client";

import { useForm } from "@tanstack/react-form";
import {
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Eye,
  EyeClosed,
  FileText,
  FileUp,
  Hash,
  IdCard,
  KeyRound,
  Mail,
  Phone,
  Plus,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useApplyOperator, useOperatorVerifyEmail } from "@/hooks";
import { extractApiError } from "@/lib/api";
import { applyOperatorFormSchema } from "@/validation";

const MAX_ADDITIONAL_DOCUMENTS = 3;

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const initialValues = {
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

export default function ApplyOperatorForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [nidDocument, setNidDocument] = useState<File | null>(null);
  const [tradeLicenseDocument, setTradeLicenseDocument] = useState<File | null>(
    null,
  );
  const [additionalDocuments, setAdditionalDocuments] = useState<File[]>([]);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { mutate: apply, isPending: applyPending } = useApplyOperator();
  const { mutate: verifyEmail, isPending: verifyPending } =
    useOperatorVerifyEmail();

  const form = useForm({
    defaultValues: initialValues,
    validators: {
      onSubmit: applyOperatorFormSchema,
    },
    onSubmit: ({ value }) => {
      if (!nidDocument || !tradeLicenseDocument) {
        toast.error("NID and trade license documents are required");
        return;
      }

      apply(
        {
          ...value,
          name: value.name.trim(),
          email: value.email.trim(),
          companyName: value.companyName.trim(),
          phone: value.phone.trim(),
          nidNumber: value.nidNumber.trim(),
          tradeLicenseNo: value.tradeLicenseNo.trim(),
          businessRegistrationNo: value.businessRegistrationNo.trim(),
          taxIdentificationNo: value.taxIdentificationNo.trim(),
          nidDocument,
          tradeLicenseDocument,
          additionalDocuments,
        },
        {
          onSuccess: (result) => {
            toast.success(result.message || "Application submitted");
            setSubmittedEmail(value.email.trim());
            setSubmitted(true);
          },
          onError: (error) => {
            toast.error(
              extractApiError(error) || "Failed to submit application",
            );
          },
        },
      );
    },
  });

  const renderField = (
    name:
      | "name"
      | "email"
      | "companyName"
      | "phone"
      | "nidNumber"
      | "tradeLicenseNo"
      | "businessRegistrationNo"
      | "taxIdentificationNo",
    label: string,
    placeholder: string,
    Icon: typeof User,
    type = "text",
    autoComplete?: string,
  ) => (
    <form.Field name={name}>
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
            <div className="relative">
              <Icon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={field.name}
                name={field.name}
                type={type}
                placeholder={placeholder}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete={autoComplete}
                className="pl-9"
              />
            </div>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    </form.Field>
  );

  const renderPasswordField = () => (
    <form.Field name="password">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid;
        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Password</FieldLabel>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={field.name}
                name={field.name}
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isInvalid}
                autoComplete="new-password"
                className="px-9"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeClosed className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        );
      }}
    </form.Field>
  );

  const renderSingleFile = (
    id: string,
    label: string,
    file: File | null,
    setFile: (file: File | null) => void,
  ) => (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="flex flex-wrap items-center gap-3">
        <label
          htmlFor={id}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
        >
          <FileUp className="size-4" />
          Upload file
        </label>
        <input
          id={id}
          type="file"
          className="sr-only"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(event) => {
            setFile(event.target.files?.[0] || null);
            event.target.value = "";
          }}
        />
        {file ? (
          <span className="inline-flex max-w-full items-center gap-2 rounded-lg bg-muted px-2.5 py-1 text-sm">
            <FileText className="size-4 shrink-0 text-primary" />
            <span className="max-w-44 truncate">{file.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
            <button
              type="button"
              aria-label={`Remove ${label}`}
              onClick={() => setFile(null)}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="size-4" />
            </button>
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            JPG, PNG, or PDF
          </span>
        )}
      </div>
    </Field>
  );

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-12">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
              <ShieldCheck className="size-7" />
            </div>
            <CardTitle className="text-2xl">Verify your email</CardTitle>
            <CardDescription>
              We sent a 6-digit verification code to {submittedEmail}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                verifyEmail(
                  { email: submittedEmail, otp },
                  {
                    onSuccess: (response) => {
                      toast.success(
                        response.message || "Email verified successfully",
                      );
                      window.location.href = "/login";
                    },
                    onError: (error) => {
                      toast.error(
                        extractApiError(error) || "Failed to verify email",
                      );
                    },
                  },
                );
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="operator-otp" className="text-sm font-medium">
                  Verification code
                </label>
                <Input
                  id="operator-otp"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(event) => setOtp(event.target.value)}
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              <Button className="w-full" disabled={verifyPending}>
                {verifyPending ? "Verifying..." : "Verify email"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="size-7" />
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          Become a BusSheba operator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Register your transport business and start managing buses, routes,
          trips, and tickets.
        </p>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
        className="space-y-6"
      >
        <FieldGroup>
          <Card>
            <CardHeader>
              <CardTitle>Account information</CardTitle>
              <CardDescription>
                Create the account used to manage your operator dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                {renderField(
                  "name",
                  "Full name",
                  "Your full name",
                  User,
                  "text",
                  "name",
                )}
                {renderField(
                  "email",
                  "Email address",
                  "operator@example.com",
                  Mail,
                  "email",
                  "email",
                )}
                {renderPasswordField()}
                {renderField(
                  "companyName",
                  "Company name",
                  "Your transport company",
                  Building2,
                )}
                {renderField(
                  "phone",
                  "Phone number",
                  "01XXXXXXXXX",
                  Phone,
                  "tel",
                  "tel",
                )}
              </div>
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
            <CardContent>
              <div className="grid gap-5 sm:grid-cols-2">
                {renderField(
                  "nidNumber",
                  "NID number",
                  "10, 13, or 17 digits",
                  IdCard,
                )}
                {renderField(
                  "tradeLicenseNo",
                  "Trade license number",
                  "5 to 15 digits",
                  BadgeCheck,
                )}
                {renderField(
                  "businessRegistrationNo",
                  "Business registration number",
                  "Registration number",
                  Hash,
                )}
                {renderField(
                  "taxIdentificationNo",
                  "Tax identification number",
                  "12-digit TIN",
                  BriefcaseBusiness,
                )}
              </div>
              <div className="mt-6 grid gap-5">
                {renderSingleFile(
                  "nid-document",
                  "NID document",
                  nidDocument,
                  setNidDocument,
                )}
                {renderSingleFile(
                  "trade-license-document",
                  "Trade license",
                  tradeLicenseDocument,
                  setTradeLicenseDocument,
                )}
                <Field>
                  <FieldLabel htmlFor="additional-documents">
                    Additional documents{" "}
                    <span className="font-normal text-muted-foreground">
                      (optional)
                    </span>
                  </FieldLabel>
                  <div className="flex flex-wrap items-center gap-3">
                    <label
                      htmlFor="additional-documents"
                      className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-sm font-medium shadow-xs transition-colors hover:bg-muted"
                    >
                      <Plus className="size-4" />
                      Add files
                    </label>
                    <input
                      id="additional-documents"
                      type="file"
                      multiple
                      className="sr-only"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(event) => {
                        const incoming = Array.from(
                          event.target.files || [],
                        ).slice(
                          0,
                          MAX_ADDITIONAL_DOCUMENTS - additionalDocuments.length,
                        );
                        setAdditionalDocuments((current) => [
                          ...current,
                          ...incoming,
                        ]);
                        event.target.value = "";
                      }}
                    />
                    <FieldDescription>
                      {additionalDocuments.length} of {MAX_ADDITIONAL_DOCUMENTS}{" "}
                      added
                    </FieldDescription>
                  </div>
                  {additionalDocuments.length > 0 && (
                    <ul className="mt-3 flex flex-col gap-2">
                      {additionalDocuments.map((file, index) => (
                        <li
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-sm"
                        >
                          <span className="flex min-w-0 items-center gap-2">
                            <FileText className="size-4 shrink-0 text-primary" />
                            <span className="truncate">{file.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          </span>
                          <button
                            type="button"
                            aria-label={`Remove ${file.name}`}
                            onClick={() =>
                              setAdditionalDocuments((current) =>
                                current.filter(
                                  (_, itemIndex) => itemIndex !== index,
                                ),
                              )
                            }
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </Field>
              </div>
            </CardContent>
          </Card>
        </FieldGroup>

        <Card>
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <FileText className="mt-0.5 size-5 shrink-0 text-primary" />
              <p>
                Your application will be reviewed by BusSheba administrators
                after email verification.
              </p>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={applyPending}
              className="sm:min-w-52"
            >
              {applyPending ? "Submitting..." : "Submit application"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
