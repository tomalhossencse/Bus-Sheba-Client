"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft, Calendar, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationPicker } from "../dashboard/LocationPicker";

const searchSchema = z.object({
  origin: z.string().optional(),
  destination: z.string().optional(),
  date: z.string().optional(),
  passengers: z.string().default("1"),
});

type SearchForm = z.input<typeof searchSchema>;

export function BusSearchBar() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SearchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: { origin: "", destination: "", date: "", passengers: "1" },
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setValue("date", today);
  }, [setValue]);

  const origin = watch("origin");
  const destination = watch("destination");

  const onSwap = () => {
    setValue("origin", destination, { shouldValidate: true });
    setValue("destination", origin, { shouldValidate: true });
  };

  const onSubmit = (data: SearchForm) => {
    const params = new URLSearchParams();
    if (data.origin) params.set("origin", data.origin);
    if (data.destination) params.set("destination", data.destination);
    if (data.date) params.set("date", data.date);
    if (data.passengers) params.set("passengers", data.passengers);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border bg-card/95 p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md sm:p-6"
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        {/* Origin */}
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            From
          </Label>
          <Controller
            control={control}
            name="origin"
            render={({ field }) => (
              <LocationPicker
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Dhaka"
                levels={["Terminal", "Upazila", "District", "Division"]}
              />
            )}
          />
        </div>

        {/* Swap */}
        <div className="hidden lg:flex lg:flex-col lg:justify-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-11 w-11"
            onClick={onSwap}
            title="Swap"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* Destination */}
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            To
          </Label>
          <Controller
            control={control}
            name="destination"
            render={({ field }) => (
              <LocationPicker
                value={field.value || ""}
                onChange={field.onChange}
                placeholder="Chattogram"
                levels={["Terminal", "Upazila", "District", "Division"]}
              />
            )}
          />
        </div>

        {/* Date */}
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Travel Date
          </Label>
          <Controller
            control={control}
            name="date"
            render={({ field }) => (
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="date" {...field} className="h-11 pl-9" />
              </div>
            )}
          />
        </div>

        {/* Passengers */}
        <div className="flex-1 space-y-1.5">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Passengers
          </Label>
          <Controller
            control={control}
            name="passengers"
            render={({ field }) => (
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="h-11 pl-9">
                    <SelectValue placeholder="Passengers" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={String(num)}>
                        {num} Passenger{num > 1 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />
        </div>

        {/* Search */}
        <Button type="submit" size="lg" className="h-11 px-6 lg:self-end">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-destructive">
        {errors.origin && <span>{errors.origin.message}</span>}
        {errors.destination && <span>{errors.destination.message}</span>}
      </div>
    </form>
  );
}
