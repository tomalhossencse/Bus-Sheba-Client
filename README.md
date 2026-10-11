# BusSheba

BusSheba is a modern bus booking and operations platform for Bangladesh. The
frontend gives passengers a simple way to discover routes, search trips, select
seats, complete bookings, and manage tickets. It also provides dedicated
workspaces for operators and administrators to manage the transportation
network.

Built with Next.js, React, TypeScript, Tailwind CSS, TanStack Query, and
shadcn/ui-style components.

## Project links

| Resource | Link |
| --- | --- |
| Live product | [bus-sheba.vercel.app](https://bus-sheba.vercel.app) |
| Frontend repository | [tomalhossencse/Bus-Sheba-Client](https://github.com/tomalhossencse/Bus-Sheba-Client) |
| Backend repository | [tomalhossencse/Bus-Sheba](https://github.com/tomalhossencse/Bus-Sheba) |

## Features

### Passenger experience

- Search buses by origin, destination, and travel date
- Browse routes and route details
- View trip schedules, fares, bus information, and seat availability
- Select seats and complete the checkout flow
- View bookings, payments, and electronic tickets
- Display ticket QR codes for boarding
- Register with email verification
- Sign in with email/password or Google
- Reset and change passwords

### Operator workspace

- Apply to become a BusSheba operator
- Verify operator email addresses
- Manage buses and bus status
- Create and manage trips
- View operator bookings and analytics
- Scan ticket QR codes
- Preview tickets and confirm passenger boarding

### Admin workspace

- Review platform analytics
- Manage routes and route stops
- Manage buses, trips, bookings, and operators
- Approve or reject operator applications
- Review operational performance

### Application quality

- Responsive layouts for mobile, tablet, and desktop
- Protected routes with role-based access control
- Shared API error extraction for user-friendly messages
- Optimistic updates for selected dashboard actions
- Loading, empty, error, and not-found states
- Light and dark theme support
- Toast notifications for success and failure feedback

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 16 |
| Language | TypeScript |
| UI | React 19, Tailwind CSS 4, Radix UI, custom UI components |
| Data fetching | TanStack Query |
| Forms | TanStack Form, React Hook Form |
| Validation | Zod |
| HTTP client | ofetch |
| Notifications | Sonner |
| Authentication | Cookie-based API authentication and Google OAuth |
| QR scanning | qr-scanner |
| Code quality | Biome |

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A running BusSheba API server
- Google OAuth credentials for Google sign-in

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/tomalhossencse/Bus-Sheba-Client.git
cd Bus-Sheba-Client
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

For a deployed API, replace the local API URL with the production API base
URL:

```env
NEXT_PUBLIC_API_BASE_URL=https://bus-sheba.vercel.app/api/v1
```

Never commit `.env.local` or expose private credentials in source control.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run Biome checks |
| `npm run format` | Format supported project files with Biome |

## Project structure

```text
src/
├── api/             API request functions grouped by domain
├── app/             Next.js App Router pages and layouts
│   ├── (authRoutes) Authentication pages
│   ├── (publicRoutes) Public booking and route pages
│   └── dashboard/ Role-specific dashboard pages
├── components/      Shared, feature, dashboard, and UI components
├── hooks/           TanStack Query queries and mutations
├── lib/             API client, shared types, utilities, and static data
├── providers/       Query, theme, Google auth, and notification providers
├── routes/          Navigation configuration
├── types/           Shared application types
├── utils/           Formatting and presentation helpers
└── validation/      Zod validation schemas
```

## Authentication and roles

BusSheba supports the following roles:

- `PASSENGER`: Search trips, book seats, manage bookings, and view tickets
- `OPERATOR`: Manage buses, trips, tickets, and operator operations
- `ADMIN`: Manage platform resources and operator applications
- `SUPER_ADMIN`: Elevated administrative access

Authentication state is retrieved from the API and protected routes use
dedicated authentication and role guards. API requests include credentials so
the server can manage the authenticated session.

## API integration

Domain-specific API functions are located in `src/api`. Requests use the
shared client in `src/lib/apiClient.ts`, while response and error handling are
centralized in `src/lib/api.ts`.

The frontend expects the API to provide endpoints for:

- Authentication and user profiles
- Routes and route stops
- Buses and trips
- Bookings and payments
- Tickets and QR verification
- Operator applications
- Admin and operator analytics

The API base URL must include the versioned path, for example
`https://bus-sheba.vercel.app/api/v1`.

## Production build

Build and run the application with:

```bash
npm run build
npm run start
```

Set production environment variables in the hosting provider before building.
For Vercel, configure the variables in the project settings and redeploy after
changing them.

## Deployment notes

- Configure `NEXT_PUBLIC_API_BASE_URL` for the target environment.
- Configure `NEXT_PUBLIC_GOOGLE_CLIENT_ID` and add the deployed domain to the
  Google OAuth authorized JavaScript origins.
- Ensure the API allows requests from the frontend origin.
- Ensure the API's cookie configuration supports the deployed frontend and API
  domains.
- Camera-based QR scanning requires HTTPS in production.

## Development guidelines

- Keep API calls in `src/api` and server-state logic in `src/hooks`.
- Reuse shared UI components from `src/components/ui`.
- Validate user input with the existing Zod schemas.
- Use `extractApiError` for API failures shown to users.
- Preserve role-based access restrictions when adding dashboard pages.
- Run `npm run lint` before opening a pull request.

## Contributing

1. Create a focused branch from the current development branch.
2. Make a small, cohesive change following the existing project patterns.
3. Run the relevant validation commands.
4. Open a pull request with a clear description and screenshots for UI changes.

## License

No open-source license has been declared for this repository yet. Contact the
repository owner before redistributing or using the project outside its
intended environment.
