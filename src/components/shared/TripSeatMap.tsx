"use client";

import { Armchair, CircleGauge } from "lucide-react";
import type { TripSeat } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type SeatStatus = TripSeat["status"] | "selected";

interface TripSeatMapProps {
  seats: TripSeat[];
  selectedIds: string[];
  onToggle: (tripSeat: TripSeat) => void;
  maxSelect?: number;
}

export function TripSeatMap({
  seats,
  selectedIds,
  onToggle,
  maxSelect = 5,
}: TripSeatMapProps) {
  // Group seats by row
  const layout: Array<{ row: string; left: TripSeat[]; right: TripSeat[] }> =
    [];

  for (const tripSeat of seats) {
    const seat = tripSeat.seat;
    if (!seat) continue;
    const seatNumberMatch = seat.seatNumber.match(/^([A-Za-z]+)(\d+)$/);
    const rowName = seatNumberMatch?.[1] || seat.row;
    let row = layout.find((r) => r.row === rowName);
    if (!row) {
      row = { row: rowName, left: [], right: [] };
      layout.push(row);
    }
    row.left.push(tripSeat);
  }

  layout.forEach((r) => {
    const rowSeats = [...r.left].sort((a, b) => {
      const aNumber = Number(a.seat?.seatNumber.match(/\d+$/)?.[0] || 0);
      const bNumber = Number(b.seat?.seatNumber.match(/\d+$/)?.[0] || 0);
      return aNumber - bNumber || (a.seat?.col || 0) - (b.seat?.col || 0);
    });
    const splitAt = Math.min(2, rowSeats.length);
    r.left = rowSeats.slice(0, splitAt);
    r.right = rowSeats.slice(splitAt);
  });

  const getStatus = (tripSeat: TripSeat): SeatStatus => {
    if (selectedIds.includes(tripSeat.id)) return "selected";
    return tripSeat.status;
  };

  const getClassName = (status: SeatStatus) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-card border-border hover:border-primary hover:bg-primary/10";
      case "HELD":
      case "BLOCKED":
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 cursor-not-allowed opacity-70";
      case "BOOKED":
        return "bg-muted text-muted-foreground cursor-not-allowed opacity-50";
      case "selected":
        return "bg-primary text-primary-foreground border-primary";
      default:
        return "bg-card border-border";
    }
  };

  const isDisabled = (tripSeat: TripSeat) =>
    tripSeat.status === "BOOKED" ||
    tripSeat.status === "HELD" ||
    tripSeat.status === "BLOCKED";

  const renderSeat = (tripSeat: TripSeat) => (
    <Button
      key={tripSeat.id}
      disabled={isDisabled(tripSeat)}
      onClick={() => onToggle(tripSeat)}
      className={cn(
        "group relative flex h-14 w-12 flex-col items-center justify-center gap-0.5 rounded-lg border-2 text-[10px] font-semibold transition-all",
        getClassName(getStatus(tripSeat)),
        selectedIds.length >= maxSelect &&
          !selectedIds.includes(tripSeat.id) &&
          "pointer-events-none opacity-50",
      )}
    >
      <Armchair className="h-5 w-5 opacity-80 transition-transform group-hover:-translate-y-0.5" />
      <span>{tripSeat.seat?.seatNumber}</span>
    </Button>
  );

  return (
    <div>
      {/* Legend */}
      <div className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:justify-start">
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded border-2 border-border bg-card" />
          Available
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded bg-primary" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded bg-muted opacity-50" />
          Booked
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-4 w-4 rounded bg-amber-100 dark:bg-amber-500/20" />
          Held / Blocked
        </span>
      </div>

      {/* Driver */}
      <div className="mx-auto mb-6 flex max-w-md items-center justify-between rounded-t-[2rem] border border-b-0 bg-muted/30 px-5 py-3">
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Front
        </span>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <CircleGauge className="h-5 w-5 text-primary" />
          Driver
        </div>
      </div>

      <div className="mx-auto max-w-full overflow-x-auto overscroll-x-contain rounded-b-[2rem] border bg-muted/10 p-3 pb-4 sm:p-5">
        <div className="relative mx-auto min-w-92 max-w-92 rounded-b-[1.5rem]">
          <span className="pointer-events-none absolute left-0 top-1/2 -translate-x-1/2 -rotate-90 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Windows
          </span>
          <span className="pointer-events-none absolute right-0 top-1/2 translate-x-1/2 rotate-90 text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Windows
          </span>

          <div className="space-y-4 px-2">
            {layout.map((row) => (
              <div
                key={row.row}
                className="grid grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] items-center gap-2"
              >
                <div className="grid grid-cols-2 justify-items-center gap-2">
                  {row.left.map(renderSeat)}
                </div>
                <span className="text-center text-[10px] text-muted-foreground">
                  {row.row}
                </span>
                <div className="grid grid-cols-2 justify-items-center gap-2">
                  {row.right.map(renderSeat)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-center text-[10px] text-muted-foreground sm:hidden">
          Swipe horizontally to see all seats
        </p>
      </div>

      <div className="mt-4 flex justify-center">
        <span className="rounded-full bg-muted px-3 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">
          Back of bus
        </span>
      </div>
    </div>
  );
}
