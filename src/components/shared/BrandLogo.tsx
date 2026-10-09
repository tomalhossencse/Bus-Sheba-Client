import { Bus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
}

export function BrandLogo({
  href = "/",
  compact = false,
  className,
  onClick,
}: BrandLogoProps) {
  const content = (
    <>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-700 to-teal-500 shadow-sm shadow-teal-700/20">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Bus className="h-5 w-5" />
        </div>
      </span>
      {!compact && (
        <span className="font-heading text-xl font-bold tracking-tight">
          Bus<span className="text-primary">Sheba</span>
        </span>
      )}
    </>
  );

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex items-center gap-2", className)}
    >
      {content}
    </Link>
  );
}
