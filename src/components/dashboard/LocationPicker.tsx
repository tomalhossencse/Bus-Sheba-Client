"use client";

import {
  Building2,
  Bus,
  ChevronsUpDown,
  Map as MapIcon,
  MapPin,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LOCATION_SUGGESTIONS,
  type LocationLevel,
  locationLevel,
} from "@/lib/locations";

const LEVEL_ICONS: Record<
  LocationLevel,
  React.ComponentType<{ className?: string }>
> = {
  Terminal: Bus,
  Upazila: MapPin,
  District: MapIcon,
  Division: Building2,
};

const LEVEL_ORDER: LocationLevel[] = [
  "Terminal",
  "Upazila",
  "District",
  "Division",
];

const LEVEL_LABELS: Record<LocationLevel, string> = {
  Terminal: "Bus Terminal",
  Upazila: "Upazila",
  District: "District",
  Division: "Division",
};

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  levels?: LocationLevel[];
  className?: string;
}

export function LocationPicker({
  value,
  onChange,
  placeholder = "Search location...",
  disabled,
  levels,
  className,
}: LocationPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const q = query.trim().toLowerCase();

  const matches = useMemo(() => {
    const pool = q
      ? LOCATION_SUGGESTIONS.filter((s) => s.toLowerCase().includes(q))
      : LOCATION_SUGGESTIONS;
    return pool
      .map((v) => ({
        value: v,
        level: locationLevel(v) ?? ("Upazila" as LocationLevel),
      }))
      .filter((item) => !levels || levels.includes(item.level))
      .slice(0, 14);
  }, [q, levels]);

  const grouped = useMemo(() => {
    const map = new Map<LocationLevel, typeof matches>();
    for (const item of matches) {
      const arr = map.get(item.level) ?? [];
      arr.push(item);
      map.set(item.level, arr);
    }
    return LEVEL_ORDER.filter((l) => map.has(l)).map((l) => ({
      level: l,
      items: map.get(l)!,
    }));
  }, [matches]);

  const select = (v: string) => {
    onChange(v);
    setQuery(v);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`}>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          disabled={disabled}
          placeholder={placeholder}
          className="pl-8 pr-9"
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "Enter" && matches.length > 0) {
              e.preventDefault();
              select(matches[0].value);
            }
          }}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground"
          onClick={() =>
            value
              ? (onChange(""), setQuery(""), setOpen(false))
              : setOpen((o) => !o)
          }
          disabled={disabled}
        >
          <ChevronsUpDown className="h-4 w-4" />
        </Button>
      </div>

      {open && !disabled && grouped.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-auto rounded-md border bg-popover p-1 shadow-md">
          {grouped.map(({ level, items }) => {
            const Icon = LEVEL_ICONS[level];
            return (
              <div key={level}>
                <p className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {LEVEL_LABELS[level]}
                </p>
                {items.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2.5 py-1.5 text-left text-sm hover:bg-accent data-[selected=true]:bg-accent"
                    data-selected={item.value === value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      select(item.value);
                    }}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    {item.value}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
