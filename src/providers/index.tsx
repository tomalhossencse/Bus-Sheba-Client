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
            closeButton
            expand
            visibleToasts={4}
            toastOptions={{
              classNames: {
                toast: "rounded-xl border shadow-lg",
                title: "font-semibold",
                description: "text-sm",
                success:
                  "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-50",
                error:
                  "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950 dark:text-red-50",
                warning:
                  "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50",
                info: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-50",
              },
            }}
          />
          {children}
        </ThemeProvider>
      </QueryProvider>
    </GoogleAuthProvider>
  );
}
