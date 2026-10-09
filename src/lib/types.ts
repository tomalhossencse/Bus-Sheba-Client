import { BANGLADESH_DISTRICTS } from "./locations";

// ==============================
// GENERIC
// ==============================

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "PASSENGER";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "BLOCKED" | "DELETED";
export type AuthProvider = "GOOGLE" | "CREDENTIAL";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string | null;
  imagePublicId: string | null;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  authProvider: AuthProvider;
  createdAt: string;
  updatedAt: string;
}

// ==============================
// OPERATOR
// ==============================

export type OperatorVerificationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface OperatorProfile {
  id: string;
  userId: string;
  companyName: string;
  phone: string;
  address: string | null;
  contactPerson: string | null;
  nidDocument: string | null;
  tradeLicenseDocument: string | null;
  additionalDocuments: Array<{ url: string; publicId: string }>;
  verificationStatus: OperatorVerificationStatus;
  rejectionReason: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  user?: UserProfile;
}

// ==============================
// BUS
// ==============================

export type BusType = "AC" | "NON_AC" | "SLEEPER" | "SEMI_SLEEPER";
export type SeatLayout = "TWO_BY_TWO" | "ONE_BY_TWO" | "TWO_BY_ONE";
export type BusStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface Seat {
  id: string;
  busId: string;
  seatNumber: string;
  row: string;
  col: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IBus {
  id: string;
  operatorId: string;
  name: string;
  registrationNo: string;
  busType: BusType;
  seatLayout: SeatLayout;
  totalSeats: number;
  status: BusStatus;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  operator?: OperatorProfile;
  seats?: Seat[];
  _count?: { trips?: number };
}

// ==============================
// ROUTE & STOPS
// ==============================

export interface RouteStop {
  id: string;
  routeId: string;
  stopName: string;
  stopOrder: number;
  arrivalMinutes: number;
  departureMinutes: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IRoute {
  id: string;
  name: string;
  source: string;
  destination: string;
  distanceKm: number;
  estimatedMinutes: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  stops?: RouteStop[];
  _count?: { trips?: number };
}

// ==============================
// TRIP
// ==============================

export type TripStatus =
  | "SCHEDULED"
  | "BOARDING"
  | "DEPARTED"
  | "COMPLETED"
  | "CANCELLED";

export type TripSeatStatus = "AVAILABLE" | "HELD" | "BOOKED" | "BLOCKED";

export interface TripSeat {
  id: string;
  tripId: string;
  seatId: string;
  status: TripSeatStatus;
  price: number;
  createdAt: string;
  updatedAt: string;
  seat?: Seat;
  bookingSeat?: { bookingId: string; price: number } | null;
}

export interface ITrip {
  id: string;
  busId: string;
  routeId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  fare: number;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  bus?: IBus;
  route?: IRoute;
  tripSeats?: TripSeat[];
  _count?: { bookings?: number; tripSeats?: number };
}

// ==============================
// BOOKING
// ==============================

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "EXPIRED";

export interface BookingPassenger {
  id: string;
  bookingId: string;
  name: string;
  phone: string;
  email: string;
}

export interface BookingSeat {
  id: string;
  bookingId: string;
  tripSeatId: string;
  price: number;
  tripSeat?: TripSeat;
}

export interface IBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  tripId: string;
  fromStopId: string;
  toStopId: string;
  totalAmount: number;
  status: BookingStatus;
  expiresAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  trip?: ITrip;
  fromStop?: {
    id?: string;
    stopName: string;
    stopOrder?: number;
    arrivalMinutes?: number;
    departureMinutes?: number;
  };
  toStop?: {
    id?: string;
    stopName: string;
    stopOrder?: number;
    arrivalMinutes?: number;
    departureMinutes?: number;
  };
  passengers?: BookingPassenger[];
  seats?: Array<{ tripSeat?: TripSeat }>;
  payment?: Payment | null;
  ticket?: ITicket | null;
  user?: Pick<UserProfile, "id" | "name" | "email" | "phone">;
  _count?: { seats?: number };
}

// ==============================
// TICKET
// ==============================

export type TicketStatus = "ACTIVE" | "USED";

export interface ITicket {
  id: string;
  bookingId: string;
  ticketNumber: string;
  qrCode: string | null;
  ticketPdfUrl: string | null;
  status: TicketStatus;
  usedAt: string | null;
  issuedAt: string;
  booking?: IBooking & {
    payment?: Payment | null;
    trip?: ITrip;
    passengers?: BookingPassenger[];
    seats?: Array<{ tripSeat?: TripSeat }>;
    fromStop?: { stopName: string };
    toStop?: { stopName: string };
    user?: Pick<UserProfile, "id" | "name" | "email" | "phone">;
  };
}

export type TicketCheckResponse = IBooking & {
  ticket: ITicket;
};

// ==============================
// PAYMENT
// ==============================

export type PaymentProvider = "SSLCOMMERZ" | "STRIPE" | "BKASH";
export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUND_PENDING"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  trxID: string | null;
  merchantInvoiceNumber: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: IBooking;
}

// ==============================
// ANALYTICS
// ==============================

export interface AdminStats {
  summary: {
    totalUsers: number;
    totalOperators: number;
    totalBuses: number;
    totalRoutes: number;
    totalTrips: number;
    totalBookings: number;
    activeBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    totalPaidPayments: number;
    totalRefunded: number;
    totalRefundedPayments: number;
  };
  bookingsByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  bookingsByDay: Array<{ date: string; count: number; totalAmount: number }>;
  topRoutes: Array<{
    bookings: number;
    tripId: string;
    routeName: string;
    source: string;
    destination: string;
  }>;
  recentTrips: ITrip[];
}

export interface OperatorStats {
  operator: { id: string; name: string; companyName: string };
  summary: {
    totalBuses: number;
    totalTrips: number;
    totalBookings: number;
    activeBookings: number;
    cancelledBookings: number;
    totalRevenue: number;
    totalPaidPayments: number;
    totalRefunded: number;
    totalRefundedPayments: number;
    totalSeats: number;
    bookedSeats: number;
    occupancyRate: number;
  };
  bookingsByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  bookingsByDay: Array<{ date: string; count: number; totalAmount: number }>;
  topRoutes: Array<{
    bookings: number;
    tripId: string;
    routeName: string;
    source: string;
    destination: string;
  }>;
  recentTrips: ITrip[];
}

export interface PassengerStats {
  summary: {
    totalBookings: number;
    activeBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    totalRefunded: number;
    totalTripsTaken: number;
  };
  bookingsByStatus: Array<{
    status: string;
    count: number;
    totalAmount: number;
  }>;
  bookingsByDay: Array<{ date: string; count: number; totalAmount: number }>;
  upcomingTrips: IBooking[];
  pastTrips: { count: number; items: IBooking[] };
}

// ==============================
// STATIC DATA
// ==============================

export const DIVISIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
] as const;

export const DIVISION_DISTRICT_MAP = {
  Dhaka: ["Dhaka", "Gazipur", "Narayanganj", "Tangail", "Narsingdi"],
  Chattogram: ["Chattogram", "Cumilla", "Cox's Bazar", "Feni", "Noakhali"],
  Rajshahi: ["Rajshahi", "Bogura", "Pabna", "Sirajganj", "Natore"],
  Khulna: ["Khulna", "Jashore", "Kushtia", "Satkhira", "Bagerhat"],
  Barishal: ["Barishal", "Bhola", "Patuakhali", "Pirojpur"],
  Sylhet: ["Sylhet", "Habiganj", "Moulvibazar", "Sunamganj"],
  Rangpur: ["Rangpur", "Dinajpur", "Nilphamari", "Kurigram", "Thakurgaon"],
  Mymensingh: ["Mymensingh", "Jamalpur", "Sherpur", "Netrokona"],
} as const;

export const BUS_TYPES: BusType[] = ["AC", "NON_AC", "SLEEPER", "SEMI_SLEEPER"];

export const POPULAR_ROUTES = [
  {
    origin: "Dhaka",
    destination: "Chattogram",
    duration: "5 hrs",
    price: "500-1000",
  },
  {
    origin: "Dhaka",
    destination: "Sylhet",
    duration: "6 hrs",
    price: "700-1200",
  },
  {
    origin: "Dhaka",
    destination: "Rajshahi",
    duration: "4 hrs",
    price: "400-800",
  },
  {
    origin: "Dhaka",
    destination: "Khulna",
    duration: "5-6 hrs",
    price: "500-1000",
  },
  {
    origin: "Chattogram",
    destination: "Cox's Bazar",
    duration: "4 hrs",
    price: "400-700",
  },
  {
    origin: "Dhaka",
    destination: "Cox's Bazar",
    duration: "8-9 hrs",
    price: "900-1600",
  },
  {
    origin: "Dhaka",
    destination: "Barishal",
    duration: "4-5 hrs",
    price: "400-900",
  },
  {
    origin: "Dhaka",
    destination: "Rangpur",
    duration: "6-7 hrs",
    price: "700-1200",
  },
] as const;

export const DISTRICTS: readonly string[] = BANGLADESH_DISTRICTS;
