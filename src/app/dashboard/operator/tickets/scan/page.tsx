"use client";

import {
  Camera,
  CheckCircle2,
  ScanLine,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import QrScanner from "qr-scanner";
import { useEffect, useRef, useState } from "react";
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
import { usePreviewOperatorTicket, useVerifyTicket } from "@/hooks";
import { extractApiError } from "@/lib/api";
import type { ITicket } from "@/lib/types";
import { formatDate, formatPrice, formatStopTime, formatTime } from "@/utils";

export default function OperatorTicketScanPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [previewTicket, setPreviewTicket] = useState<ITicket | null>(null);
  const [boardingConfirmed, setBoardingConfirmed] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const previewOperatorTicket = usePreviewOperatorTicket();
  const verifyTicket = useVerifyTicket();

  const getTicketNumber = (rawValue: string) => {
    let value = rawValue;
    try {
      const parsedUrl = new URL(rawValue);
      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      value = decodeURIComponent(segments[segments.length - 1] || rawValue);
    } catch {
      // Scanner input may be a raw ticket number instead of a URL.
    }
    return value.trim();
  };

  const verify = (rawValue: string) => {
    const value = getTicketNumber(rawValue);
    if (!value) return;
    setPreviewTicket(null);
    setBoardingConfirmed(false);
    previewOperatorTicket.mutate(value, {
      onSuccess: (result) => {
        setPreviewTicket(result.data);
        setTicketNumber("");
      },
    });
  };

  const confirmBoarding = () => {
    if (!previewTicket) return;
    verifyTicket.mutate(previewTicket.ticketNumber, {
      onSuccess: (result) => {
        setPreviewTicket(result.data);
        setBoardingConfirmed(true);
      },
    });
  };

  const ticketStatus = boardingConfirmed
    ? "BOARDING_CONFIRMED"
    : previewTicket?.booking?.trip?.status === "CANCELLED"
      ? "CANCELLED"
      : previewTicket?.booking?.trip?.status === "COMPLETED" ||
          previewTicket?.booking?.trip?.status === "DEPARTED"
        ? "EXPIRED"
        : previewTicket?.booking?.payment?.status !== "PAID"
          ? "PAYMENT_PENDING"
          : previewTicket.status;

  const statusLabel = {
    ACTIVE: "VALID - READY TO BOARD",
    BOARDING_CONFIRMED: "BOARDING CONFIRMED",
    USED: "ALREADY USED",
    CANCELLED: "TRIP CANCELLED",
    EXPIRED: "BOARDING CLOSED",
    PAYMENT_PENDING: "PAYMENT INCOMPLETE",
  }[ticketStatus || "ACTIVE"];

  const stopCamera = () => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setCameraActive(false);
  };

  const startCamera = async () => {
    setCameraError("");
    if (!videoRef.current) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera scanning requires HTTPS and browser camera support.",
      );
      return;
    }

    try {
      QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          const value = typeof result === "string" ? result : result.data;
          stopCamera();
          setTicketNumber(value);
          verify(value);
        },
        {
          preferredCamera: "environment",
          highlightScanRegion: true,
          highlightCodeOutline: true,
        },
      );
      scannerRef.current = scanner;
      setCameraActive(true);
      await scanner.start();
    } catch {
      setCameraError(
        "Camera permission was denied or unavailable. Enter the ticket number below.",
      );
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      scannerRef.current?.stop();
      scannerRef.current?.destroy();
      scannerRef.current = null;
      setCameraActive(false);
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Scan Ticket</h1>
        <p className="text-sm text-muted-foreground">
          Scan the passenger QR code or enter its ticket number to verify
          boarding.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScanLine className="h-5 w-5 text-primary" />
            Verify passenger ticket
          </CardTitle>
          <CardDescription>
            Scan or enter a ticket to review its manifest. Confirm boarding only
            after checking the passenger and route details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-black">
              <video
                ref={videoRef}
                className={`aspect-video w-full object-cover ${cameraActive ? "block" : "hidden"}`}
                muted
                playsInline
              />
              {!cameraActive && (
                <div className="flex aspect-video items-center justify-center px-4 text-center text-sm text-white/70">
                  Camera preview will appear here
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={cameraActive ? stopCamera : startCamera}
              disabled={
                previewOperatorTicket.isPending || verifyTicket.isPending
              }
            >
              <Camera className="h-4 w-4" />
              {cameraActive ? "Stop camera" : "Open QR scanner"}
            </Button>
            {cameraError && (
              <Alert variant="destructive">
                <AlertDescription>{cameraError}</AlertDescription>
              </Alert>
            )}
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              verify(ticketNumber);
            }}
            className="mt-4 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="ticket-number">Ticket number</Label>
              <Input
                id="ticket-number"
                value={ticketNumber}
                onChange={(event) => setTicketNumber(event.target.value)}
                placeholder="Enter ticket number or paste QR URL"
                autoFocus
                disabled={
                  previewOperatorTicket.isPending || verifyTicket.isPending
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={
                !ticketNumber.trim() ||
                previewOperatorTicket.isPending ||
                verifyTicket.isPending
              }
            >
              <ShieldCheck className="h-4 w-4" />
              {previewOperatorTicket.isPending
                ? "Loading ticket..."
                : "Load ticket"}
            </Button>
          </form>

          {(previewOperatorTicket.isError || verifyTicket.isError) && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                {extractApiError(
                  previewOperatorTicket.error || verifyTicket.error,
                )}
              </AlertDescription>
            </Alert>
          )}

          {previewTicket && (
            <div className="mt-4 space-y-4">
              <Alert
                className={
                  ticketStatus !== "ACTIVE"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-700"
                    : "border-emerald-500/30 bg-emerald-500/10 text-emerald-700"
                }
              >
                {ticketStatus !== "ACTIVE" ? (
                  <XCircle className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
                <AlertDescription>
                  <span className="font-semibold">{statusLabel}</span> · Ticket{" "}
                  <span className="font-mono font-semibold">
                    {previewTicket.ticketNumber}
                  </span>
                </AlertDescription>
              </Alert>
              <Card>
                <CardHeader>
                  <CardTitle>Passenger and trip details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <p>
                      <span className="text-muted-foreground">Route:</span>{" "}
                      {previewTicket.booking?.trip?.route?.source} →{" "}
                      {previewTicket.booking?.trip?.route?.destination}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Booking:</span>{" "}
                      {previewTicket.booking?.bookingNumber || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        Ticket status:
                      </span>{" "}
                      {previewTicket.status}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        Booking status:
                      </span>{" "}
                      {previewTicket.booking?.status || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Payment:</span>{" "}
                      {previewTicket.booking?.payment?.status || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Bus:</span>{" "}
                      {previewTicket.booking?.trip?.bus?.name ||
                        previewTicket.booking?.trip?.bus?.registrationNo ||
                        "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">
                        Travel date:
                      </span>{" "}
                      {previewTicket.booking?.trip?.travelDate
                        ? formatDate(previewTicket.booking.trip.travelDate)
                        : "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Departure:</span>{" "}
                      {previewTicket.booking?.trip?.departureTime
                        ? formatTime(previewTicket.booking.trip.departureTime)
                        : "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Arrival:</span>{" "}
                      {previewTicket.booking?.trip?.arrivalTime
                        ? formatTime(previewTicket.booking.trip.arrivalTime)
                        : "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Boarding:</span>{" "}
                      {previewTicket.booking?.fromStop?.stopName || "—"} ·{" "}
                      {formatStopTime(
                        previewTicket.booking?.trip?.departureTime,
                        previewTicket.booking?.fromStop?.departureMinutes,
                      )}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Dropping:</span>{" "}
                      {previewTicket.booking?.toStop?.stopName || "—"} ·{" "}
                      {formatStopTime(
                        previewTicket.booking?.trip?.departureTime,
                        previewTicket.booking?.toStop?.arrivalMinutes,
                      )}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Amount:</span>{" "}
                      {formatPrice(previewTicket.booking?.totalAmount || 0)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Issued:</span>{" "}
                      {previewTicket.issuedAt
                        ? formatDate(previewTicket.issuedAt)
                        : "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Used at:</span>{" "}
                      {previewTicket.usedAt
                        ? new Date(previewTicket.usedAt).toLocaleString()
                        : "Not used"}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="mb-2 font-medium">
                      Passengers (
                      {previewTicket.booking?.passengers?.length || 0})
                    </p>
                    <div className="space-y-2">
                      {previewTicket.booking?.passengers?.map(
                        (passenger, index) => (
                          <div
                            key={passenger.id}
                            className="rounded-md border p-2"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">
                                {index + 1}. {passenger.name}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                Seat{" "}
                                {previewTicket.booking?.seats?.[index]?.tripSeat
                                  ?.seat?.seatNumber || "—"}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {passenger.phone} · {passenger.email}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              {ticketStatus === "ACTIVE" && !boardingConfirmed && (
                <Button
                  className="w-full"
                  onClick={confirmBoarding}
                  disabled={verifyTicket.isPending}
                >
                  <ShieldCheck className="h-4 w-4" />
                  {verifyTicket.isPending
                    ? "Confirming boarding..."
                    : "Confirm boarding and mark used"}
                </Button>
              )}
              {boardingConfirmed && (
                <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Boarding confirmed. This ticket was marked as used at{" "}
                    {previewTicket.usedAt
                      ? new Date(previewTicket.usedAt).toLocaleString()
                      : "now"}
                    .
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
