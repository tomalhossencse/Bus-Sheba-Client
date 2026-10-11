import { z } from "zod";

const routeStopFormSchema = z
  .object({
    stopId: z.string().optional(),
    stopName: z.string().min(1, "Stop name is required"),
    arrivalMinutes: z.number().min(0, "Minutes cannot be negative"),
    departureMinutes: z.number().min(0, "Minutes cannot be negative"),
  })
  .refine((d) => d.departureMinutes >= d.arrivalMinutes, {
    message: "Departure cannot be earlier than arrival",
    path: ["departureMinutes"],
  });

export const createRouteFormSchema = z
  .object({
    name: z.string().trim().min(3, "Route name must be at least 3 characters"),
    source: z.string().min(1, "Source location is required"),
    destination: z.string().min(1, "Destination location is required"),
    distanceKm: z.coerce.number().min(0.1, "Distance must be greater than 0"),
    estimatedMinutes: z.coerce
      .number()
      .min(1, "Duration must be greater than 0"),
    routeStops: z.array(routeStopFormSchema),
  })
  .superRefine((data, ctx) => {
    if (data.source && data.destination && data.source === data.destination) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Source and destination cannot be the same",
        path: ["destination"],
      });
    }
    for (let i = 1; i < data.routeStops.length; i++) {
      if (
        data.routeStops[i].arrivalMinutes <
        data.routeStops[i - 1].departureMinutes
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Arrival cannot be before previous stop's departure",
          path: ["routeStops", i, "arrivalMinutes"],
        });
      }
    }
    if (data.routeStops.length > 0) {
      if (
        data.routeStops[0].stopName.trim().toLowerCase() !==
        data.source.trim().toLowerCase()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The first stop must be the route source",
          path: ["routeStops", 0, "stopName"],
        });
      }
      const lastIndex = data.routeStops.length - 1;
      if (
        data.routeStops[lastIndex].stopName.trim().toLowerCase() !==
        data.destination.trim().toLowerCase()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "The last stop must be the route destination",
          path: ["routeStops", lastIndex, "stopName"],
        });
      }
    }
  });

export type CreateRouteFormValues = z.input<typeof createRouteFormSchema>;
