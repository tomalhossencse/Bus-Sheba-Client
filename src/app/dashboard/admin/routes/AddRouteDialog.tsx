"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  ArrowUp,
  Map as MapIcon,
  Plus,
  Sparkles,
  Trash2,
  Wand2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { BangladeshMap } from "@/components/dashboard/BangladeshMap";
import { LocationPicker } from "@/components/dashboard/LocationPicker";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateRoute } from "@/hooks";
import { findCorridor, generateRouteStops } from "@/lib/routeStops";
import {
  type CreateRouteFormValues,
  createRouteFormSchema,
} from "@/validation";

interface AddRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const defaultStop = (
  prevDeparture = 0,
): { stopName: string; arrivalMinutes: number; departureMinutes: number } => ({
  stopName: "",
  arrivalMinutes: prevDeparture,
  departureMinutes: prevDeparture + 5,
});

export function AddRouteDialog({ open, onOpenChange }: AddRouteDialogProps) {
  const createRoute = useCreateRoute();
  const [nameCustom, setNameCustom] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const form = useForm<CreateRouteFormValues>({
    resolver: zodResolver(createRouteFormSchema),
    defaultValues: {
      name: "",
      source: "",
      destination: "",
      distanceKm: 0,
      estimatedMinutes: 0,
      routeStops: [],
    },
  });

  const { fields, append, remove, move, replace } = useFieldArray({
    control: form.control,
    name: "routeStops",
  });

  const source = form.watch("source");
  const destination = form.watch("destination");
  const distanceKm = form.watch("distanceKm");
  const estimatedMinutes = form.watch("estimatedMinutes");

  const autoName = source && destination ? `${source} - ${destination}` : "";
  const canGenerate = Boolean(source && destination);

  useEffect(() => {
    if (!nameCustom && autoName)
      form.setValue("name", autoName, { shouldValidate: true });
  }, [autoName, nameCustom, form]);

  useEffect(() => {
    const stops = form.getValues("routeStops");
    if (stops.length > 0) {
      form.setValue("routeStops.0.stopName", source, { shouldValidate: false });
      form.setValue(`routeStops.${stops.length - 1}.stopName`, destination, {
        shouldValidate: false,
      });
    }
  }, [source, destination, form]);

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      form.reset({
        name: "",
        source: "",
        destination: "",
        distanceKm: 0,
        estimatedMinutes: 0,
        routeStops: [],
      });
      setNameCustom(false);
    }
    onOpenChange(next);
  };

  const handleMapPick = (name: string) => {
    if (!form.getValues("source")) {
      form.setValue("source", name, { shouldValidate: true });
    } else if (!form.getValues("destination")) {
      form.setValue("destination", name, { shouldValidate: true });
    } else {
      form.setValue("destination", name, { shouldValidate: true });
    }
  };

  const handleGenerate = () => {
    const { source: src, destination: dst } = form.getValues();
    if (!src || !dst) return;

    const result = generateRouteStops(src, dst, {
      distanceKm: Number(distanceKm),
      estimatedMinutes: Number(estimatedMinutes),
    });
    if (!result) {
      const corridor = findCorridor(src, dst);
      form.setValue("distanceKm", corridor?.corridor.distanceKm ?? 0, {
        shouldValidate: true,
      });
      return;
    }

    form.setValue("distanceKm", result.distanceKm, { shouldValidate: true });
    form.setValue("estimatedMinutes", result.estimatedMinutes, {
      shouldValidate: true,
    });

    if (result.stops.length > 0) {
      replace(result.stops);
    }
    if (!nameCustom && autoName) {
      form.setValue("name", autoName, { shouldValidate: true });
    }
  };

  const onSubmit = async (values: CreateRouteFormValues) => {
    const inputStops =
      values.routeStops.length >= 2
        ? values.routeStops
        : [
            { stopName: values.source, arrivalMinutes: 0, departureMinutes: 0 },
            {
              stopName: values.destination,
              arrivalMinutes: Number(values.estimatedMinutes),
              departureMinutes: Number(values.estimatedMinutes),
            },
          ];
    await createRoute.mutateAsync({
      name: values.name.trim(),
      source: values.source.trim(),
      destination: values.destination.trim(),
      distanceKm: Number(values.distanceKm),
      estimatedMinutes: Number(values.estimatedMinutes),
      routeStops: inputStops.map((s, index, stops) => ({
        stopName:
          index === 0
            ? values.source.trim()
            : index === stops.length - 1
              ? values.destination.trim()
              : s.stopName,
        arrivalMinutes: Number(s.arrivalMinutes),
        departureMinutes: Number(s.departureMinutes),
      })),
    });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>Add New Route</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(92vh-76px)] space-y-4 overflow-y-auto px-6 py-5"
          id="route-form"
        >
          <div className="rounded-md border border-dashed p-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 text-muted-foreground"
              onClick={() => setShowMap((v) => !v)}
            >
              <MapIcon className="h-4 w-4" />
              {showMap ? "Hide map" : "Pick source & destination on the map"}
            </Button>
            {showMap && (
              <BangladeshMap
                source={source}
                destination={destination}
                onPick={handleMapPick}
                className="mt-2"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label>Route Name</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 gap-1 text-xs text-muted-foreground"
                disabled={!source || !destination}
                onClick={() => {
                  setNameCustom(false);
                  form.setValue("name", autoName, { shouldValidate: true });
                }}
              >
                <Sparkles className="h-3 w-3" />
                {autoName || "Auto from locations"}
              </Button>
            </div>
            <Input
              {...form.register("name")}
              placeholder="Dhaka - Chattogram"
              onChange={(e) => {
                setNameCustom(e.target.value.length > 0);
                form.setValue("name", e.target.value, { shouldValidate: true });
              }}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Controller
                control={form.control}
                name="source"
                render={({ field }) => (
                  <LocationPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Dhaka"
                    levels={["Terminal", "Upazila", "District"]}
                  />
                )}
              />
              {form.formState.errors.source && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.source.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Destination</Label>
              <Controller
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <LocationPicker
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Chattogram"
                    levels={["Terminal", "Upazila", "District"]}
                  />
                )}
              />
              {form.formState.errors.destination && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.destination.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="w-full"
            disabled={!canGenerate}
            onClick={handleGenerate}
          >
            <Wand2 className="h-4 w-4" />
            Auto-fill real stops & times
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Distance (km)</Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                {...form.register("distanceKm")}
                placeholder="250"
              />
              {form.formState.errors.distanceKm && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.distanceKm.message}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Est. Minutes</Label>
              <Input
                type="number"
                min={0}
                {...form.register("estimatedMinutes")}
                placeholder="390"
              />
              {form.formState.errors.estimatedMinutes && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.estimatedMinutes.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Route Stops</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  const stops = form.getValues("routeStops");
                  const last = stops[stops.length - 1];
                  append(defaultStop(last?.departureMinutes ?? 0));
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                Add Stop
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Stops are saved in order. Times are minutes from departure.
            </p>

            {fields.length === 0 && (
              <div className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                No stops added — pick source & destination then hit{" "}
                <span className="font-medium">
                  Auto-fill real stops & times
                </span>
                .
              </div>
            )}

            {fields.map((field, index) => (
              <div key={field.id} className="space-y-2 rounded-md border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Stop {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => move(index, 1)}
                      disabled={index === fields.length - 1}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive"
                      onClick={() => remove(index)}
                      disabled={index === 0 || index === fields.length - 1}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <Controller
                  control={form.control}
                  name={`routeStops.${index}.stopName`}
                  render={({ field: f }) => (
                    <LocationPicker
                      value={f.value}
                      onChange={f.onChange}
                      disabled={index === 0 || index === fields.length - 1}
                      placeholder="Dhaka (Gabtoli), Chandra Junction, etc."
                      levels={["Terminal", "Upazila", "District"]}
                    />
                  )}
                />
                {form.formState.errors.routeStops?.[index]?.stopName && (
                  <p className="text-xs text-destructive">
                    {
                      form.formState.errors.routeStops?.[index]?.stopName
                        ?.message
                    }
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Arrives (min)</Label>
                    <Input
                      type="number"
                      min={0}
                      {...form.register(`routeStops.${index}.arrivalMinutes`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Departs (min)</Label>
                    <Input
                      type="number"
                      min={0}
                      {...form.register(
                        `routeStops.${index}.departureMinutes`,
                        { valueAsNumber: true },
                      )}
                    />
                  </div>
                </div>
                {form.formState.errors.routeStops?.[index]
                  ?.departureMinutes && (
                  <p className="text-xs text-destructive">
                    {
                      form.formState.errors.routeStops?.[index]
                        ?.departureMinutes?.message
                    }
                  </p>
                )}
                {form.formState.errors.routeStops?.[index]?.arrivalMinutes && (
                  <p className="text-xs text-destructive">
                    {
                      form.formState.errors.routeStops?.[index]?.arrivalMinutes
                        ?.message
                    }
                  </p>
                )}
              </div>
            ))}
          </div>

          {form.formState.errors.destination && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {form.formState.errors.destination.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={createRoute.isPending}
          >
            {createRoute.isPending ? "Adding..." : "Add Route"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
