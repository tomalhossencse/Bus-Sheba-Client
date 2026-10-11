"use client";

import { AlertTriangle, Check, Copy, Home, RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  copied: boolean;
}

export class GracefullyDegradingErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, copied: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, copied: false };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, copied: false });
  };

  handleCopyError = () => {
    if (this.state.error) {
      navigator.clipboard.writeText(
        this.state.error.stack || this.state.error.message,
      );
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-112 w-full flex-col items-center justify-center p-6 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-2xl border border-border/60 bg-card p-8 shadow-xl backdrop-blur-sm">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive dark:bg-destructive/20">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Something went wrong
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              We encountered an unexpected error. You can try refreshing or
              returning to the homepage.
            </p>
            {process.env.NODE_ENV !== "production" && this.state.error && (
              <div className="mt-4 w-full rounded-lg border border-border/50 bg-muted/50 p-3 text-left">
                <div className="flex items-center justify-between pb-1">
                  <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground">
                    Developer Error Info
                  </span>
                  <button
                    type="button"
                    onClick={this.handleCopyError}
                    className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {this.state.copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Stack</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="line-clamp-3 font-mono text-xs text-destructive">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="mt-6 flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
              <Button
                onClick={this.handleReset}
                variant="default"
                className="gap-2 font-semibold shadow-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="gap-2 border-border/60 font-semibold"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GracefullyDegradingErrorBoundary;
