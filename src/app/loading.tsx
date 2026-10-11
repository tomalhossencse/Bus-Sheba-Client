import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold">Loading...</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we load your content.
        </p>
      </div>
    </div>
  );
}
