"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowDown,
  ArrowUp,
  Map as MapIcon,
  Plus,
  Sparkles,
  Trash2,
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
import { useUpdateRoute } from "@/hooks";
import {
  useCreateRouteStop,
  useDeleteRouteStop,
  useUpdateRouteStop,
} from "@/hooks/routeStop.hook";
import { findCorridor, generateRouteStops } from "@/lib/routeStops";
import type { IRoute } from "@/lib/types";
import {
  type CreateRouteFormValues,
  createRouteFormSchema,
} from "@/validation";

interface EditRouteDialogProps {
  open: boolean;
  route: IRoute;
  onOpenChange: (open: boolean) => void;
}

const defaultStop = (
  prevDeparture = 0,
): {
  stopId?: string;
  stopName: string;
  arrivalMinutes: number;
  departureMinutes: number;
} => ({
  stopName: "",
  arrivalMinutes: prevDeparture,
  departureMinutes: prevDeparture + 5,
});

export function EditRouteDialog({
  open,
  route,
  onOpenChange,
}: EditRouteDialogProps) {
  const updateRoute = useUpdateRoute();
  const createStop = useCreateRouteStop();
  const updateStop = useUpdateRouteStop();
  const deleteStop = useDeleteRouteStop();
  const [nameCustom, setNameCustom] = useState(true);
  const [savingStops, setSavingStops] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const existingStops =
    route.stops
      ?.filter((s) => !s.isDeleted)
      .sort((a, b) => a.stopOrder - b.stopOrder) ?? [];

  const normalizedStops = existingStops.map((s, index) => ({
    stopId: s.id,
    stopName:
      index === 0
        ? route.source
        : index === existingStops.length - 1
          ? route.destination
          : s.stopName,
    arrivalMinutes: s.arrivalMinutes,
    departureMinutes: s.departureMinutes,
  }));

  const form = useForm<CreateRouteFormValues>({
    resolver: zodResolver(createRouteFormSchema),
    defaultValues: {
      name: route.name,
      source: route.source,
      destination: route.destination,
      distanceKm: route.distanceKm,
      estimatedMinutes: route.estimatedMinutes,
      routeStops: normalizedStops,
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
  const autoName =
    source && destination ? `${source} - ${destination}` : route.name;

  useEffect(() => {
    const stops = form.getValues("routeStops");
    if (stops.length > 0) {
      form.setValue("routeStops.0.stopName", source, { shouldValidate: false });
      form.setValue(`routeStops.${stops.length - 1}.stopName`, destination, {
        shouldValidate: false,
      });
    }
  }, [source, destination, form]);

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
  };

  useEffect(() => {
    form.reset({
      name: route.name,
      source: route.source,
      destination: route.destination,
      distanceKm: route.distanceKm,
      estimatedMinutes: route.estimatedMinutes,
      routeStops: normalizedStops,
    });
    setNameCustom(true);
  }, [route, form, normalizedStops]);

  const handleOpenChange = (next: boolean) => {
    if (!next) form.reset();
    onOpenChange(next);
  };

  const onSubmit = async (values: CreateRouteFormValues) => {
    await updateRoute.mutateAsync({
      id: route.id,
      payload: {
        name: values.name.trim(),
        source: values.source.trim(),
        destination: values.destination.trim(),
        distanceKm: Number(values.distanceKm),
        estimatedMinutes: Number(values.estimatedMinutes),
      },
    });

    const stopsToSave =
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

    setSavingStops(true);
    try {
      for (let i = 0; i < stopsToSave.length; i++) {
        const stop = {
          ...stopsToSave[i],
          stopName:
            i === 0
              ? values.source.trim()
              : i === stopsToSave.length - 1
                ? values.destination.trim()
                : stopsToSave[i].stopName,
        };
        const existing = stop.stopId
          ? existingStops.find((s) => s.id === stop.stopId)
          : undefined;
        const changed =
          !existing ||
          existing.stopName !== stop.stopName ||
          existing.arrivalMinutes !== stop.arrivalMinutes ||
          existing.departureMinutes !== stop.departureMinutes ||
          existingStops.findIndex((s) => s.id === stop.stopId) !== i;

        if (!existing && !stop.stopId) {
          await createStop.mutateAsync({
            routeId: route.id,
            stopName: stop.stopName,
            stopOrder: i + 1,
            arrivalMinutes: Number(stop.arrivalMinutes),
            departureMinutes: Number(stop.departureMinutes),
          });
        } else if (existing && changed) {
          await updateStop.mutateAsync({
            stopId: stop.stopId!,
            stopName: stop.stopName,
            stopOrder: i + 1,
            arrivalMinutes: Number(stop.arrivalMinutes),
            departureMinutes: Number(stop.departureMinutes),
          });
        }
      }

      const keptIds = new Set(stopsToSave.map((s) => s.stopId).filter(Boolean));
      for (const s of existingStops) {
        if (!keptIds.has(s.id)) {
          await deleteStop.mutateAsync(s.id);
        }
      }
    } finally {
      setSavingStops(false);
    }

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-5">
          <DialogTitle>Edit Route</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="max-h-[calc(92vh-76px)] space-y-4 overflow-y-auto px-6 py-5"
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
              {showMap ? "Hide map" : "Open map & auto-fill stops"}
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
                No stops added — source and destination are always used
                automatically.
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateRoute.isPending || savingStops}
            >
              {updateRoute.isPending || savingStops
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
