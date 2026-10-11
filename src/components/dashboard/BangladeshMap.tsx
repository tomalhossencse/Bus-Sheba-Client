"use client";

import { useId, useMemo } from "react";
import { getDivisionForDistrict } from "@/lib/locations";
import { DISTRICT_COORDS, DIVISION_COORDS, getCoords } from "@/lib/routeStops";

const BOUNDS = { minLon: 88, maxLon: 92.7, minLat: 20.7, maxLat: 26.6 };
const W = 360;
const SCALE_X = W / (BOUNDS.maxLon - BOUNDS.minLon);
const H = (BOUNDS.maxLat - BOUNDS.minLat) * SCALE_X;

// Loosely-traced border polygon of Bangladesh (lon, lat pairs).
const BORDER: Array<[number, number]> = [
  [88.05, 24.5],
  [87.95, 24.8],
  [88.1, 25.0],
  [88.05, 25.3],
  [88.2, 25.5],
  [88.15, 25.8],
  [88.3, 26.05],
  [88.5, 26.25],
  [88.75, 26.4],
  [89.0, 26.55],
  [89.3, 26.35],
  [89.55, 26.25],
  [89.8, 26.1],
  [90.0, 25.9],
  [90.25, 25.75],
  [90.5, 25.5],
  [90.75, 25.3],
  [91.0, 25.15],
  [91.25, 25.2],
  [91.5, 25.1],
  [91.75, 25.05],
  [92.0, 25.1],
  [92.2, 24.9],
  [92.35, 24.7],
  [92.45, 24.45],
  [92.5, 24.2],
  [92.35, 23.95],
  [92.2, 23.7],
  [92.15, 23.45],
  [92.25, 23.2],
  [92.35, 22.95],
  [92.4, 22.7],
  [92.25, 22.45],
  [92.1, 22.2],
  [92.05, 21.95],
  [92.0, 21.7],
  [91.8, 21.55],
  [91.6, 21.7],
  [91.4, 21.5],
  [91.2, 21.7],
  [91.0, 21.8],
  [90.8, 21.7],
  [90.6, 21.85],
  [90.4, 21.75],
  [90.2, 21.9],
  [90.0, 21.8],
  [89.8, 21.9],
  [89.6, 21.85],
  [89.4, 22.0],
  [89.2, 21.95],
  [89.0, 22.05],
  [88.85, 22.1],
  [88.7, 22.2],
  [88.55, 22.35],
  [88.4, 22.5],
  [88.3, 22.7],
  [88.25, 22.9],
  [88.3, 23.05],
  [88.2, 23.25],
  [88.1, 23.45],
  [88.0, 23.6],
  [88.0, 23.85],
  [88.05, 24.05],
  [88.05, 24.3],
];

const pt = (lon: number, lat: number) =>
  [(lon - BOUNDS.minLon) * SCALE_X, (BOUNDS.maxLat - lat) * SCALE_X] as const;

const DIVISION_COLORS: Record<string, string> = {
  Dhaka: "#2563eb",
  Chattogram: "#dc2626",
  Barishal: "#0891b2",
  Khulna: "#7c3aed",
  Rajshahi: "#ea580c",
  Rangpur: "#ca8a04",
  Mymensingh: "#16a34a",
  Sylhet: "#db2777",
};

const DIVISION_LABELS: Record<string, [number, number]> = {
  Dhaka: [23.8, 90.3],
  Chattogram: [22.4, 91.6],
  Barishal: [22.7, 90.3],
  Khulna: [22.8, 89.3],
  Rajshahi: [24.0, 88.5],
  Rangpur: [25.6, 89.1],
  Mymensingh: [24.9, 90.2],
  Sylhet: [24.8, 91.7],
};

const DIVISION_ORDER = [
  "Rangpur",
  "Rajshahi",
  "Mymensingh",
  "Sylhet",
  "Dhaka",
  "Khulna",
  "Barishal",
  "Chattogram",
] as const;

interface BangladeshMapProps {
  source?: string;
  destination?: string;
  onPick?: (name: string) => void;
  className?: string;
}

export function BangladeshMap({
  source,
  destination,
  onPick,
  className,
}: BangladeshMapProps) {
  const clipId = useId();

  const projection = useMemo(() => pt, []);

  const coordsOf = (name: string) => getCoords(name);

  const {
    sx,
    sy,
  }: { sx?: { lat: number; lon: number }; sy?: { lat: number; lon: number } } =
    {
      sx: coordsOf(source ?? "") ?? undefined,
      sy: coordsOf(destination ?? "") ?? undefined,
    };

  const markers = useMemo(() => {
    const list: Array<{
      name: string;
      lat: number;
      lon: number;
      division: string;
      major: boolean;
    }> = [];
    for (const division of DIVISION_ORDER) {
      const c = DIVISION_COORDS[division];
      if (c)
        list.push({
          name: division,
          lat: c.lat,
          lon: c.lon,
          division,
          major: true,
        });
    }
    const divisionSet = new Set(DIVISION_ORDER as readonly string[]);
    for (const [district, c] of Object.entries(DISTRICT_COORDS)) {
      if (divisionSet.has(district)) continue;
      list.push({
        name: district,
        lat: c.lat,
        lon: c.lon,
        division: getDivisionForDistrict(district) ?? "Dhaka",
        major: false,
      });
    }
    return list;
  }, []);

  const line =
    sx && sy
      ? `M ${projection(sx.lon, sx.lat)[0]} ${projection(sx.lon, sx.lat)[1]} L ${projection(sy.lon, sy.lat)[0]} ${projection(sy.lon, sy.lat)[1]}`
      : null;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full rounded-lg border border-border bg-slate-50 dark:bg-slate-900"
        role="img"
        aria-label="Bangladesh map. Click a point to pick source or destination."
      >
        <defs>
          <clipPath id={clipId}>
            <path
              d={`M ${BORDER.map(([lon, lat]) => projection(lon, lat).join(",")).join(" L ")} Z`}
            />
          </clipPath>
        </defs>

        <path
          d={`M ${BORDER.map(([lon, lat]) => projection(lon, lat).join(",")).join(" L ")} Z`}
          fill="#e2e8f0"
          stroke="#94a3b8"
          strokeWidth="1"
          className="dark:fill-slate-700 dark:stroke-slate-500"
        />

        {line && (
          <line
            x1={projection(sx!.lon, sx!.lat)[0]}
            y1={projection(sx!.lon, sx!.lat)[1]}
            x2={projection(sy!.lon, sy!.lat)[0]}
            y2={projection(sy!.lon, sy!.lat)[1]}
            stroke="#0f172a"
            strokeWidth="1.5"
            strokeDasharray="4 3"
            className="dark:stroke-slate-200"
          />
        )}

        <g clipPath={`url(#${clipId})`}>
          {markers.map((m) => {
            const [x, y] = projection(m.lon, m.lat);
            const isSource = source === m.name;
            const isDest = destination === m.name;
            const color = DIVISION_COLORS[m.division];
            return (
              <g
                key={m.name}
                onClick={() => onPick?.(m.name)}
                className="cursor-pointer"
              >
                <title>{m.name}</title>
                <circle
                  cx={x}
                  cy={y}
                  r={isSource || isDest ? 6 : m.major ? 4.5 : 3}
                  fill={
                    isSource || isDest
                      ? "#0ea5e9"
                      : color === "strokeless"
                        ? color
                        : undefined
                  }
                  fillOpacity={0.15}
                  stroke={color}
                  strokeWidth={isSource || isDest ? 2 : 1.5}
                />
                <circle
                  cx={x}
                  cy={y}
                  r={isSource || isDest ? 2 : 1.5}
                  fill={color}
                  stroke="#fff"
                  strokeWidth="0.5"
                />
              </g>
            );
          })}
        </g>

        {Object.entries(DIVISION_LABELS).map(([division, [lat, lon]]) => {
          const [x, y] = projection(lon, lat);
          return (
            <text
              key={division}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="8"
              fontWeight="600"
              fill={DIVISION_COLORS[division]}
              className="select-none"
            >
              {division}
            </text>
          );
        })}
      </svg>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-blue-500" />
          Source
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-sky-600" />
          Selected
        </span>
        <span className="ml-auto text-[10px]">
          Click a district to set source / destination
        </span>
      </div>
    </div>
  );
}
