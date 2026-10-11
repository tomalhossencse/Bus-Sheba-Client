"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1 ${className || ""}`}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="First page"
        disabled={page === 1}
        onClick={() => onPageChange(1)}
      >
        <ChevronsLeft />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <span className="px-3 text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{" "}
        <span className="font-medium text-foreground">{totalPages}</span>
      </span>
      <Button
        variant="outline"
        size="icon"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Last page"
        disabled={page === totalPages}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronsRight />
      </Button>
    </nav>
  );
}
