import {
  BANGLADESH_DISTRICTS,
  BANGLADESH_DIVISIONS,
  DISTRICT_UPAZILAS,
  getDistrictForUpazila,
  getDivisionForDistrict,
  locationLevel,
} from "./locations";

// ---------------------------------------------------------------------------
// Geographic coordinates (approx. district HQ centroids) used to render the
// Bangladesh SVG map plus the highway-corridor stop generator.
// ---------------------------------------------------------------------------

export const DIVISION_COORDS: Record<string, { lat: number; lon: number }> = {
  Dhaka: { lat: 23.81, lon: 90.41 },
  Chattogram: { lat: 22.36, lon: 91.79 },
  Barishal: { lat: 22.7, lon: 90.37 },
  Khulna: { lat: 22.82, lon: 89.54 },
  Rajshahi: { lat: 24.37, lon: 88.62 },
  Rangpur: { lat: 25.74, lon: 89.26 },
  Mymensingh: { lat: 24.75, lon: 90.41 },
  Sylhet: { lat: 24.9, lon: 91.87 },
};

const DISTRICT_COORDS_RAW: Record<string, { lat: number; lon: number }> = {
  // Dhaka division
  Dhaka: { lat: 23.81, lon: 90.41 },
  Faridpur: { lat: 23.6, lon: 89.83 },
  Gazipur: { lat: 23.99, lon: 90.42 },
  Gopalganj: { lat: 23.0, lon: 89.83 },
  Kishoreganj: { lat: 24.44, lon: 90.78 },
  Madaripur: { lat: 23.17, lon: 90.19 },
  Manikganj: { lat: 23.86, lon: 90.01 },
  Munshiganj: { lat: 23.54, lon: 90.53 },
  Narayanganj: { lat: 23.62, lon: 90.5 },
  Narsingdi: { lat: 23.92, lon: 90.71 },
  Rajbari: { lat: 23.76, lon: 89.64 },
  Shariatpur: { lat: 23.21, lon: 90.35 },
  Tangail: { lat: 24.25, lon: 89.92 },
  // Chattogram division
  Chattogram: { lat: 22.36, lon: 91.79 },
  "Cox's Bazar": { lat: 21.43, lon: 92.01 },
  Bandarban: { lat: 22.19, lon: 92.22 },
  Khagrachhari: { lat: 23.12, lon: 91.95 },
  Rangamati: { lat: 22.65, lon: 92.19 },
  Noakhali: { lat: 22.83, lon: 91.1 },
  Feni: { lat: 23.02, lon: 91.41 },
  Lakshmipur: { lat: 22.94, lon: 90.85 },
  Cumilla: { lat: 23.46, lon: 91.18 },
  Brahmanbaria: { lat: 23.96, lon: 91.11 },
  Chandpur: { lat: 23.23, lon: 90.75 },
  // Barishal division
  Barishal: { lat: 22.7, lon: 90.37 },
  Barguna: { lat: 22.15, lon: 90.13 },
  Bhola: { lat: 22.69, lon: 90.65 },
  Jhalokati: { lat: 22.64, lon: 90.2 },
  Patuakhali: { lat: 22.36, lon: 90.32 },
  Pirojpur: { lat: 22.58, lon: 89.97 },
  // Khulna division
  Khulna: { lat: 22.82, lon: 89.54 },
  Bagerhat: { lat: 22.66, lon: 89.79 },
  Satkhira: { lat: 22.72, lon: 89.07 },
  Jessore: { lat: 23.17, lon: 89.21 },
  Magura: { lat: 23.49, lon: 89.42 },
  Narail: { lat: 23.15, lon: 89.49 },
  Jhenaidah: { lat: 23.54, lon: 89.15 },
  Kushtia: { lat: 23.9, lon: 89.12 },
  Chuadanga: { lat: 23.64, lon: 88.83 },
  Meherpur: { lat: 23.77, lon: 88.64 },
  // Rajshahi division
  Rajshahi: { lat: 24.37, lon: 88.62 },
  Natore: { lat: 24.42, lon: 89.0 },
  Naogaon: { lat: 24.81, lon: 88.95 },
  Chapainawabganj: { lat: 24.6, lon: 88.27 },
  Pabna: { lat: 24.01, lon: 89.24 },
  Sirajganj: { lat: 24.46, lon: 89.71 },
  Bogura: { lat: 24.85, lon: 89.37 },
  Joypurhat: { lat: 25.1, lon: 89.02 },
  // Rangpur division
  Rangpur: { lat: 25.74, lon: 89.26 },
  Dinajpur: { lat: 25.62, lon: 88.63 },
  Kurigram: { lat: 25.81, lon: 89.66 },
  Gaibandha: { lat: 25.33, lon: 89.54 },
  Lalmonirhat: { lat: 25.93, lon: 89.44 },
  Nilphamari: { lat: 25.93, lon: 88.86 },
  Panchagarh: { lat: 26.34, lon: 88.55 },
  Thakurgaon: { lat: 26.03, lon: 88.46 },
  // Mymensingh division
  Mymensingh: { lat: 24.75, lon: 90.41 },
  Jamalpur: { lat: 24.92, lon: 89.95 },
  Netrokona: { lat: 24.87, lon: 90.73 },
  Sherpur: { lat: 25.02, lon: 90.02 },
  // Sylhet division
  Sylhet: { lat: 24.9, lon: 91.87 },
  Moulvibazar: { lat: 24.48, lon: 91.77 },
  Habiganj: { lat: 24.37, lon: 91.41 },
  Sunamganj: { lat: 25.06, lon: 91.41 },
};

export const DISTRICT_COORDS: Record<string, { lat: number; lon: number }> =
  Object.fromEntries(
    BANGLADESH_DISTRICTS.map((d) => [d, DISTRICT_COORDS_RAW[d]]).filter(
      ([, c]) => c !== undefined,
    ),
  );

export const getCoords = (
  name: string,
): { lat: number; lon: number } | null => {
  if (DIVISION_COORDS[name]) return DIVISION_COORDS[name];
  if (DISTRICT_COORDS[name]) return DISTRICT_COORDS[name];
  const district = getDistrictForUpazila(name);
  if (district && DISTRICT_COORDS[district]) return DISTRICT_COORDS[district];
  return null;
};

// ---------------------------------------------------------------------------
// Highway corridor model
// ---------------------------------------------------------------------------

export interface CorridorStop {
  name: string;
  km: number;
}

export interface Corridor {
  id: string;
  from: string;
  fromDiv: string;
  to: string;
  toDiv: string;
  distanceKm: number;
  stops: CorridorStop[];
}

// Real-world highway corridors with junction names + cumulative km from origin.
export const CORRIDORS: Corridor[] = [
  {
    id: "dhk-ctg",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Chattogram",
    toDiv: "Chattogram",
    distanceKm: 260,
    stops: [
      { name: "Dhaka (Sayedabad)", km: 0 },
      { name: "Kanchpur Junction", km: 16 },
      { name: "Daudkandi Bypass", km: 48 },
      { name: "Cumilla (Candina)", km: 95 },
      { name: "Mainamati Bypass", km: 105 },
      { name: "Feni (Muhuri Bypass)", km: 155 },
      { name: "Chattogram (Dampara)", km: 243 },
      { name: "Chattogram (Kadamtali)", km: 260 },
    ],
  },
  {
    id: "dhk-cox",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Cox's Bazar",
    toDiv: "Chattogram",
    distanceKm: 320,
    stops: [
      { name: "Dhaka (Sayedabad)", km: 0 },
      { name: "Kanchpur Junction", km: 16 },
      { name: "Daudkandi Bypass", km: 48 },
      { name: "Cumilla (Candina)", km: 95 },
      { name: "Mainamati Bypass", km: 105 },
      { name: "Feni (Muhuri Bypass)", km: 155 },
      { name: "Chattogram (Dampara)", km: 243 },
      { name: "Chattogram (Kadamtali)", km: 260 },
      { name: "Battali (Chattogram)", km: 270 },
      { name: "Cox's Bazar (Hotel Motel Zone)", km: 320 },
    ],
  },
  {
    id: "ctg-cox",
    from: "Chattogram",
    fromDiv: "Chattogram",
    to: "Cox's Bazar",
    toDiv: "Chattogram",
    distanceKm: 150,
    stops: [
      { name: "Chattogram (Kadamtali)", km: 0 },
      { name: "Battali (Chattogram)", km: 45 },
      { name: "Cox's Bazar (Hotel Motel Zone)", km: 150 },
    ],
  },
  {
    id: "dhk-syl",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Sylhet",
    toDiv: "Sylhet",
    distanceKm: 245,
    stops: [
      { name: "Dhaka (Sayedabad)", km: 0 },
      { name: "Kanchpur Junction", km: 16 },
      { name: "Bhairab Bypass", km: 45 },
      { name: "Postbari (Brahmanbaria)", km: 85 },
      { name: "Haripur (Shaistaganj)", km: 150 },
      { name: "Sylhet (Khadimnagar)", km: 245 },
    ],
  },
  {
    id: "dhk-rjh",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Rajshahi",
    toDiv: "Rajshahi",
    distanceKm: 265,
    stops: [
      { name: "Dhaka (Gabtoli)", km: 0 },
      { name: "Kaliakoir", km: 18 },
      { name: "Bhuapur", km: 52 },
      { name: "Elenga Bus Stand", km: 75 },
      { name: "Hatikumrul", km: 130 },
      { name: "Bonpara Bypass", km: 160 },
      { name: "Natore Bipin Bypass", km: 210 },
      { name: "Rajshahi (Shiroil Terminal)", km: 265 },
    ],
  },
  {
    id: "dhk-khl",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Khulna",
    toDiv: "Khulna",
    distanceKm: 270,
    stops: [
      { name: "Dhaka (Gabtoli)", km: 0 },
      { name: "Bhanga (Faridpur)", km: 85 },
      { name: "Jashore (Kotchadpur)", km: 185 },
      { name: "Khulna (Sonadanga)", km: 270 },
    ],
  },
  {
    id: "dhk-bar",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Barishal",
    toDiv: "Barishal",
    distanceKm: 180,
    stops: [
      { name: "Dhaka (Gabtoli)", km: 0 },
      { name: "Bhanga (Faridpur)", km: 85 },
      { name: "Barishal (Rupatali)", km: 180 },
    ],
  },
  {
    id: "dhk-mym",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Mymensingh",
    toDiv: "Mymensingh",
    distanceKm: 130,
    stops: [
      { name: "Dhaka (Mohakhali)", km: 0 },
      { name: "Tongi Bypass", km: 12 },
      { name: "Joydebpur Bus Stand", km: 22 },
      { name: "Chandra Junction", km: 45 },
      { name: "Mymensingh (Kewatkhali)", km: 130 },
    ],
  },
  {
    id: "dhk-rng",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Rangpur",
    toDiv: "Rangpur",
    distanceKm: 300,
    stops: [
      { name: "Dhaka (Gabtoli)", km: 0 },
      { name: "Kaliakoir", km: 18 },
      { name: "Bhuapur", km: 52 },
      { name: "Elenga Bus Stand", km: 75 },
      { name: "Hatikumrul", km: 130 },
      { name: "Borogola (Bogura)", km: 190 },
      { name: "Rangpur (Central Bus Terminal)", km: 300 },
    ],
  },
  {
    id: "dhk-dinaj",
    from: "Dhaka",
    fromDiv: "Dhaka",
    to: "Dinajpur",
    toDiv: "Rangpur",
    distanceKm: 345,
    stops: [
      { name: "Dhaka (Gabtoli)", km: 0 },
      { name: "Kaliakoir", km: 18 },
      { name: "Bhuapur", km: 52 },
      { name: "Elenga Bus Stand", km: 75 },
      { name: "Hatikumrul", km: 130 },
      { name: "Borogola (Bogura)", km: 190 },
      { name: "Dinajpur (K.N. Bazar)", km: 345 },
    ],
  },
  {
    id: "rjh-rng",
    from: "Rajshahi",
    fromDiv: "Rajshahi",
    to: "Rangpur",
    toDiv: "Rangpur",
    distanceKm: 170,
    stops: [
      { name: "Rajshahi (Shiroil Terminal)", km: 0 },
      { name: "Natore Bipin Bypass", km: 45 },
      { name: "Hatikumrul", km: 75 },
      { name: "Rangpur (Central Bus Terminal)", km: 170 },
    ],
  },
  {
    id: "khl-jesh",
    from: "Khulna",
    fromDiv: "Khulna",
    to: "Jessore",
    toDiv: "Khulna",
    distanceKm: 90,
    stops: [
      { name: "Khulna (Sonadanga)", km: 0 },
      { name: "Jashore (Kotchadpur)", km: 90 },
    ],
  },
];

export interface NormalizedLocation {
  key: string;
  district: string | null;
  division: string | null;
  level: string;
}

export const normalizeLocation = (name: string): NormalizedLocation => {
  const trimmed = name.trim();
  if (BANGLADESH_DIVISIONS.includes(trimmed as never)) {
    return {
      key: trimmed,
      district: null,
      division: trimmed,
      level: "Division",
    };
  }
  if (BANGLADESH_DISTRICTS.includes(trimmed)) {
    return {
      key: trimmed,
      district: trimmed,
      division: getDivisionForDistrict(trimmed),
      level: "District",
    };
  }
  const district = getDistrictForUpazila(trimmed);
  if (district) {
    return {
      key: trimmed,
      district,
      division: getDivisionForDistrict(district),
      level: "Upazila",
    };
  }
  // Terminal or free-text: use the leading city token, e.g. "Dhaka (Gabtoli)" → "Dhaka".
  const cityToken = trimmed.split(" (")[0].trim();
  if (BANGLADESH_DIVISIONS.includes(cityToken as never)) {
    return {
      key: cityToken,
      district: cityToken,
      division: cityToken,
      level: "Terminal",
    };
  }
  if (BANGLADESH_DISTRICTS.includes(cityToken)) {
    return {
      key: cityToken,
      district: cityToken,
      division: getDivisionForDistrict(cityToken),
      level: "Terminal",
    };
  }
  return {
    key: trimmed,
    district: null,
    division: null,
    level: locationLevel(trimmed) ?? "Terminal",
  };
};

const findStopKm = (stops: CorridorStop[], city: string): number | null => {
  for (const stop of stops) {
    const token = stop.name.split(" (")[0].toLowerCase().trim();
    if (token === city.toLowerCase().trim()) return stop.km;
  }
  return null;
};

const scoreLocation = (
  loc: NormalizedLocation,
  city: string,
  division: string,
): number => {
  let score = 0;
  if (loc.key === city) score += 2;
  if (loc.division !== null && loc.division === division) score += 1;
  return score;
};

export const findCorridor = (
  source: string,
  destination: string,
): {
  corridor: Corridor;
  reversed: boolean;
  srcKm: number;
  dstKm: number;
} | null => {
  const src = normalizeLocation(source);
  const dst = normalizeLocation(destination);
  if (src == null || dst == null) return null;
  if (!src.division || !dst.division) return null;

  let best: {
    corridor: Corridor;
    reversed: boolean;
    srcKm: number;
    dstKm: number;
    score: number;
  } | null = null;

  for (const corridor of CORRIDORS) {
    for (const reversed of [false, true] as const) {
      const from = reversed ? corridor.to : corridor.from;
      const fromDiv = reversed ? corridor.toDiv : corridor.fromDiv;
      const to = reversed ? corridor.from : corridor.to;
      const toDiv = reversed ? corridor.fromDiv : corridor.toDiv;

      const score =
        scoreLocation(src, from, fromDiv) + scoreLocation(dst, to, toDiv);
      if (score === 0) continue;

      const srcKm =
        findStopKm(corridor.stops, from) ??
        (reversed ? corridor.distanceKm : 0);
      const dstKm =
        findStopKm(corridor.stops, to) ?? (reversed ? 0 : corridor.distanceKm);

      if (!best || score > best.score)
        best = { corridor, reversed, srcKm, dstKm, score };
    }
  }

  if (!best) return null;
  return {
    corridor: best.corridor,
    reversed: best.reversed,
    srcKm: best.srcKm,
    dstKm: best.dstKm,
  };
};

export interface GeneratedStop {
  stopName: string;
  arrivalMinutes: number;
  departureMinutes: number;
}

export interface RouteStopsResult {
  stops: GeneratedStop[];
  distanceKm: number;
  estimatedMinutes: number;
}

const SPEED_KPH = 60;
const DWELL_MIN = 5;

export const generateRouteStops = (
  source: string,
  destination: string,
  defaults?: { distanceKm?: number; estimatedMinutes?: number },
): RouteStopsResult | null => {
  const found = findCorridor(source, destination);
  if (!found) return null;
  const { corridor, reversed } = found;

  const distanceKm =
    defaults?.distanceKm && defaults.distanceKm > 0
      ? defaults.distanceKm
      : corridor.distanceKm;
  const estimatedMinutes =
    defaults?.estimatedMinutes && defaults.estimatedMinutes > 0
      ? defaults.estimatedMinutes
      : Math.round(distanceKm / (SPEED_KPH / 60));

  const ordered = reversed ? [...corridor.stops].reverse() : corridor.stops;
  const totalSpanKm = Math.abs(found.dstKm - found.srcKm);
  const totalSpan = Math.max(totalSpanKm, 1);

  const inBetween = corridor.stops
    .filter((s) => {
      const distanceFromSource = Math.abs(s.km - found.srcKm);
      return distanceFromSource > 0 && distanceFromSource < totalSpanKm;
    })
    .sort((a, b) => {
      const aDistance = Math.abs(a.km - found.srcKm);
      const bDistance = Math.abs(b.km - found.srcKm);
      return aDistance - bDistance;
    });

  if (inBetween.length === 0) {
    // Fall back to a single midpoint if nothing sits between the endpoints.
    const midKm = (found.srcKm + found.dstKm) / 2;
    const mid = ordered.find((s) => Math.abs(s.km - midKm) < 0.001);
    if (mid) inBetween.push(mid);
  }

  let prevDeparture = 0;
  const intermediateStops: GeneratedStop[] = inBetween.map((stop) => {
    const progressKm = Math.abs(stop.km - found.srcKm);
    const frac = Math.max(0, Math.min(1, progressKm / totalSpan));
    let arrival = Math.max(0, Math.round(frac * estimatedMinutes));
    arrival = Math.max(arrival, prevDeparture);
    arrival = Math.min(arrival, Math.max(estimatedMinutes - 1, 0));
    let departure = arrival + DWELL_MIN;
    if (departure >= estimatedMinutes) departure = estimatedMinutes - 1;
    if (departure <= arrival) departure = arrival;
    prevDeparture = departure;
    return {
      stopName: stop.name,
      arrivalMinutes: arrival,
      departureMinutes: departure,
    };
  });

  return {
    stops: [
      { stopName: source.trim(), arrivalMinutes: 0, departureMinutes: 0 },
      ...intermediateStops,
      {
        stopName: destination.trim(),
        arrivalMinutes: estimatedMinutes,
        departureMinutes: estimatedMinutes,
      },
    ],
    distanceKm,
    estimatedMinutes,
  };
};
