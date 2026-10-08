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
        <svg viewBox="0 0 64 64" className="h-7 w-7" aria-hidden="true">
          <path
            d="M15 19.5C15 16.462 17.462 14 20.5 14h23c3.038 0 5.5 2.462 5.5 5.5V43c0 2.761-2.239 5-5 5H20c-2.761 0-5-2.239-5-5V19.5Z"
            fill="white"
          />
          <path
            d="M19 20.5c0-1.105.895-2 2-2h21c1.105 0 2 .895 2 2V30H19v-9.5Z"
            fill="#CCFBF1"
          />
          <path d="M19 38h26" stroke="#0F766E" strokeWidth="2" />
          <circle cx="22.5" cy="42" r="3" fill="#0F766E" />
          <circle cx="41.5" cy="42" r="3" fill="#0F766E" />
          <path
            d="M21.5 34h4M38.5 34h4"
            stroke="#0F766E"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
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
