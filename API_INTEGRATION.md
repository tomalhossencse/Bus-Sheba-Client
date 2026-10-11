# BusSheba API Integration Guide

This document describes how the BusSheba frontend connects to the backend API,
the response contract expected by the application, authentication behavior,
available domain endpoints, and conventions for adding new integrations.

## Configuration

The frontend reads its API base URL from `NEXT_PUBLIC_API_BASE_URL`.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

The value should include the API version prefix. Do not add a trailing slash
unless the backend deployment specifically requires one.

### Environment examples

```env
# Local development
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1

# Production
NEXT_PUBLIC_API_BASE_URL=https://bus-sheba.vercel.app/api/v1
```

`NEXT_PUBLIC_` variables are exposed to browser code. Never place API secrets,
private keys, database credentials, or signing secrets in these variables.

## HTTP client

All domain API modules use the shared client from
`src/lib/apiClient.ts`:

```ts
import apiClient from "@/lib/apiClient";

const response = await apiClient<ApiResponse<User>>("/auth/me");
```

The shared client is created with:

- `baseURL: process.env.NEXT_PUBLIC_API_BASE_URL`
- `credentials: "include"`

Credentials must remain enabled because the backend uses an authenticated
session cookie. The frontend does not manually attach access tokens to each
request.

## Response contract

Successful API responses use the following shape:

```ts
interface ApiResponse<T> {
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
```

Paginated endpoints generally return:

```ts
interface PaginatedData<T> {
  data: T[];
  meta: {
    limit: number;
    page: number;
    total: number;
    totalPages: number;
  };
}
```

For example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Routes fetched successfully",
  "data": {
    "data": [],
    "meta": {
      "limit": 20,
      "page": 1,
      "total": 0,
      "totalPages": 0
    }
  }
}
```

## Error handling

`ofetch` rejects non-successful HTTP responses with a `FetchError`. The shared
`extractApiError` helper in `src/lib/api.ts` should be used whenever an API
error is displayed to a user:

```ts
import { extractApiError } from "@/lib/api";

try {
  await createBooking(payload);
} catch (error: unknown) {
  toast.error(extractApiError(error));
}
```

The helper checks the following sources in order:

1. `response.data.message`
2. Nested `error.message` or `error`
3. An item in `errors`
4. The native error message
5. `"Something went wrong"`

Do not use `error as Error` or access `error.message` directly when the error
may come from an API request. This can hide the backend's useful validation
message.

## Authentication

### Login

```http
POST /auth/login
Content-Type: application/json
```

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

The backend should establish the authenticated session in the response. The
frontend then redirects the user according to the returned role.

### Current user

```http
GET /auth/me
```

Used by route guards, navigation, and dashboard layouts to retrieve the
authenticated user profile.

### Logout

```http
POST /auth/logout
```

### Google authentication

```http
POST /auth/google
Content-Type: application/json
```

```json
{
  "idToken": "google-id-token"
}
```

### Registration and email verification

```http
POST /auth/register
POST /auth/verify-email
```

Registration sends the user's details. Email verification sends the email and
the six-digit OTP.

### Password recovery

```http
POST /auth/forget-password
POST /auth/reset-password
POST /auth/change-password
```

Password reset requests use the email, OTP, and new password. Authenticated
password changes use the email, old password, and new password.

## Endpoint catalogue

All paths below are relative to `NEXT_PUBLIC_API_BASE_URL`.

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/auth/login` | Sign in with email and password |
| `GET` | `/auth/me` | Get the current user |
| `POST` | `/auth/logout` | End the current session |
| `POST` | `/auth/google` | Sign in with a Google ID token |
| `POST` | `/auth/register` | Create a passenger account |
| `POST` | `/auth/verify-email` | Verify a registration OTP |
| `POST` | `/auth/forget-password` | Send a password reset OTP |
| `POST` | `/auth/reset-password` | Reset a password with an OTP |
| `POST` | `/auth/change-password` | Change an existing password |

### Routes and stops

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/route` | List routes |
| `POST` | `/route/add` | Create a route |
| `PUT` | `/route/update/:id` | Update a route |
| `PATCH` | `/route/activate/:id` | Activate a route |
| `PATCH` | `/route/deactivate/:id` | Deactivate a route |
| `GET` | `/route-stop/route/:routeId` | List stops for a route |
| `POST` | `/route-stop/add` | Add a route stop |
| `PUT` | `/route-stop/update/:stopId` | Update a route stop |
| `PATCH` | `/route-stop/deactivate/:stopId` | Deactivate a route stop |

Common route query parameters include `searchTerm`, `page`, and `limit`.

### Buses

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/bus` | List all buses |
| `GET` | `/bus/my-buses` | List the current operator's buses |
| `POST` | `/bus/add` | Create a bus |
| `PUT` | `/bus/update/:id` | Update a bus |
| `PATCH` | `/bus/activate/:id` | Activate a bus |
| `PATCH` | `/bus/deactivate/:id` | Deactivate a bus |
| `PATCH` | `/bus/maintenance/:id` | Set a bus to maintenance |

Bus creation expects a name, registration number, bus type, seat layout, and
total seat count.

### Trips

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/trip/search` | Search trips |
| `GET` | `/trip` | List trips |
| `GET` | `/trip/my-trips` | List the current operator's trips |
| `GET` | `/trip/:id` | Get trip details |
| `GET` | `/trip/:id/seats` | Get seats for a trip |
| `GET` | `/trip/:id/available-seats` | Get available seats |
| `POST` | `/trip/create` | Create a trip |
| `PUT` | `/trip/update/:id` | Update a trip |
| `PATCH` | `/trip/cancel/:id` | Cancel a trip |
| `PATCH` | `/trip/status/:id` | Update trip status |

Trip search supports `source`, `destination`, and `date`. List endpoints may
also accept `page`, `limit`, and `status`.

### Bookings and payments

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/booking` | List bookings for administrative users |
| `POST` | `/booking/create` | Create a booking |
| `GET` | `/booking/my` | List the current passenger's bookings |
| `GET` | `/booking/:id` | Get booking details |
| `POST` | `/payment/create` | Start payment for a booking |
| `GET` | `/payment/my` | List the current passenger's payments |

Booking creation expects:

```json
{
  "tripId": "trip-id",
  "fromStopId": "stop-id",
  "toStopId": "stop-id",
  "tripSeatIds": ["trip-seat-id"],
  "passengers": [
    {
      "name": "Passenger Name",
      "phone": "01XXXXXXXXX",
      "email": "passenger@example.com"
    }
  ]
}
```

Payment creation returns a payment URL and booking ID:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment initialized",
  "data": {
    "paymentUrl": "https://payment-provider.example/checkout",
    "bookingId": "booking-id"
  }
}
```

### Tickets

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/tickets/verify/:ticketNumber` | Verify or check a ticket |
| `GET` | `/tickets/operator/:ticketNumber` | Preview a ticket for an operator |
| `GET` | `/tickets/verify/:ticketNumber` | Mark or confirm ticket boarding |

Ticket numbers should be URL encoded before being placed in a path. The
frontend's ticket API functions perform this encoding automatically.

### Operators

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/operator/apply` | Submit an operator application |
| `POST` | `/operator/verify-email` | Verify an operator email OTP |
| `GET` | `/operator` | List operator applications |
| `PATCH` | `/operator/approve` | Approve or reject an operator |

Operator applications use `multipart/form-data` and include:

- A JSON `data` field containing user and operator details
- `nidDocument`
- `tradeLicenseDocument`
- Optional `additionalDocuments` files

The frontend intentionally lets the browser set the multipart boundary. Do not
manually set the `Content-Type` header when sending `FormData`.

### Analytics

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/analytics/admin` | Admin dashboard statistics |
| `GET` | `/analytics/operator` | Operator dashboard statistics |
| `GET` | `/analytics/passenger` | Passenger dashboard statistics |

## Adding a new API integration

1. Add a domain function in the appropriate file under `src/api`.
2. Reuse `apiClient` rather than calling `fetch` directly.
3. Add or reuse a response type from `src/lib/types.ts` or `src/types`.
4. Add a TanStack Query hook under `src/hooks` for queries and mutations.
5. Use the existing query key conventions in `src/hooks/auth.hook.ts`.
6. Display failures with `extractApiError`.
7. Invalidate affected queries after successful mutations.
8. Add loading, error, and empty states to the consuming page.

Example:

```ts
import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "@/types";

export interface Example {
  id: string;
}

export function getExample(): Promise<ApiResponse<Example[]>> {
  return apiClient<ApiResponse<Example[]>>("/example");
}
```

## CORS and cookies

Because requests use `credentials: "include"`, the backend must:

- Allow the frontend origin explicitly in CORS configuration
- Allow credentials
- Configure cookie `SameSite`, `Secure`, and domain attributes correctly
- Use HTTPS in production

Typical production issues include a correct API response being returned while
the browser silently omits the session cookie. Check browser Network and
Application panels when authentication appears to work in API tools but not in
the frontend.

## Local troubleshooting

### Requests target the wrong server

Check `.env.local`, confirm `NEXT_PUBLIC_API_BASE_URL`, and restart the
development server after changing environment variables.

### Authentication is lost after login

Confirm that the API allows credentialed CORS requests and that the cookie is
being set for the frontend environment.

### The UI shows a generic error

Confirm that the backend returns a `message` field and that the caller uses
`extractApiError(error)` instead of accessing `error.message` directly.

### File uploads fail

Confirm that the request uses `FormData`, that required files are present, and
that the backend accepts the exact multipart field names documented above.
