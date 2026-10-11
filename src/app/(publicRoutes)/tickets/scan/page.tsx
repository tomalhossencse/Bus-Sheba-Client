"use client";

import { Camera, ExternalLink, ScanLine } from "lucide-react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";
import { useCallback, useEffect, useRef, useState } from "react";
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

function getTicketValue(value: string) {
  const trimmedValue = value.trim();
  try {
    const url = new URL(trimmedValue);
    const segments = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(segments[segments.length - 1] || trimmedValue);
  } catch {
    return trimmedValue;
  }
}

export default function PublicTicketScannerPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [input, setInput] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const openTicket = (value: string) => {
    const ticketNumber = getTicketValue(value);
    if (ticketNumber) {
      router.push(`/tickets/verify/${encodeURIComponent(ticketNumber)}`);
    }
  };

  const stopCamera = useCallback(() => {
    scannerRef.current?.stop();
    scannerRef.current?.destroy();
    scannerRef.current = null;
    setCameraActive(false);
  }, []);

  const startCamera = async () => {
    setCameraError("");

    if (!videoRef.current) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access is unavailable. Use HTTPS or enter the ticket number below.",
      );
      return;
    }

    try {
      QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";
      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          stopCamera();
          openTicket(typeof result === "string" ? result : result.data);
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
        "Camera permission was denied or unavailable. Use HTTPS or enter the ticket number below.",
      );
      stopCamera();
    }
  };

  useEffect(() => stopCamera, [stopCamera]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ScanLine className="h-6 w-6" />
          </div>
          <CardTitle className="font-heading text-2xl">
            Scan BusSheba Ticket
          </CardTitle>
          <CardDescription>
            Scan a ticket QR code to view its public verification details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-hidden rounded-lg border bg-black">
            <video
              ref={videoRef}
              className={`aspect-video w-full object-cover ${cameraActive ? "block" : "hidden"}`}
              muted
              playsInline
            />
            {!cameraActive && (
              <div className="flex aspect-video items-center justify-center text-center text-sm text-white/70">
                Camera preview will appear here
              </div>
            )}
          </div>

          <Button
            className="w-full"
            onClick={cameraActive ? stopCamera : startCamera}
          >
            <Camera className="h-4 w-4" />
            {cameraActive ? "Stop camera" : "Open camera scanner"}
          </Button>

          {cameraError && (
            <Alert variant="destructive">
              <AlertDescription>{cameraError}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="ticket-input">Ticket number or QR URL</Label>
            <Input
              id="ticket-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Paste ticket number or scanned URL"
            />
          </div>

          <Button
            className="w-full"
            variant="outline"
            disabled={!input.trim()}
            onClick={() => openTicket(input)}
          >
            <ExternalLink className="h-4 w-4" />
            View ticket
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
