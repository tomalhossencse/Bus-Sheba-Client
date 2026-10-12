import type { ReactNode } from "react";
import { Toaster } from "sonner";
import { GoogleAuthProvider } from "./google.auth.provider";
import QueryProvider from "./query.provider";
import { ThemeProvider } from "./theme.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <GoogleAuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <Toaster
            position="top-right"
            duration={3500}
            richColors
            expand
            visibleToasts={4}
            closeButton
            gap={12}
            toastOptions={{
              classNames: {
                toast:
                  "rounded-2xl border bg-background/95 px-4 py-3 shadow-xl shadow-foreground/10 backdrop-blur-xl",
                title: "font-semibold tracking-tight",
                description: "mt-1 text-sm leading-5 text-muted-foreground",
                closeButton:
                  "left-auto right-2 top-2 border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground",
                success:
                  "border-emerald-200/80 bg-emerald-50/95 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/95 dark:text-emerald-50",
                error:
                  "border-red-200/80 bg-red-50/95 text-red-950 dark:border-red-900 dark:bg-red-950/95 dark:text-red-50",
                warning:
                  "border-amber-200/80 bg-amber-50/95 text-amber-950 dark:border-amber-900 dark:bg-amber-950/95 dark:text-amber-50",
                info: "border-sky-200/80 bg-sky-50/95 text-sky-950 dark:border-sky-900 dark:bg-sky-950/95 dark:text-sky-50",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
}
