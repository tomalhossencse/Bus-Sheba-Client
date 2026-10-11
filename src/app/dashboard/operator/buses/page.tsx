"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bus, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateBus, useMyBuses, useUpdateBusStatus } from "@/hooks";
import type { BusType, IBus } from "@/lib/types";
import { type CreateBusFormValues, createBusFormSchema } from "@/validation";

const BUS_TYPES: BusType[] = ["AC", "NON_AC", "SLEEPER", "SEMI_SLEEPER"];
const LAYOUTS: IBus["seatLayout"][] = [
  "TWO_BY_TWO",
  "ONE_BY_TWO",
  "TWO_BY_ONE",
];

function typeBadge(type: BusType) {
  const variants: Record<
    BusType,
    "default" | "secondary" | "destructive" | "outline"
  > = {
    AC: "default",
    NON_AC: "secondary",
    SLEEPER: "destructive",
    SEMI_SLEEPER: "outline",
  };
  return variants[type] || "default";
}

export default function OperatorBusesPage() {
  const { data: buses, isLoading } = useMyBuses();
  const createBus = useCreateBus();
  const updateStatus = useUpdateBusStatus();

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateBusFormValues>({
    resolver: zodResolver(createBusFormSchema),
    defaultValues: {
      name: "",
      registrationNo: "",
      busType: "AC",
      seatLayout: "TWO_BY_TWO",
      totalSeats: 0,
    },
  });

  const onSubmit = async (values: CreateBusFormValues) => {
    await createBus.mutateAsync({
      ...values,
      totalSeats: Number(values.totalSeats),
    });
    setOpen(false);
    reset();
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold">My Buses</h1>
          <p className="text-sm text-muted-foreground">Manage your bus fleet</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add Bus
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Bus</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Bus Name</Label>
                <Input
                  {...register("name")}
                  placeholder="Green Line Paribahan"
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Registration No</Label>
                <Input
                  {...register("registrationNo")}
                  placeholder="DHAKA-METRO-11-2345"
                />
                {errors.registrationNo && (
                  <p className="text-xs text-destructive">
                    {errors.registrationNo.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Bus Type</Label>
                  <Controller
                    control={control}
                    name="busType"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {BUS_TYPES.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.busType && (
                    <p className="text-xs text-destructive">
                      {errors.busType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label>Seat Layout</Label>
                  <Controller
                    control={control}
                    name="seatLayout"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LAYOUTS.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l.replace("_", " ")}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.seatLayout && (
                    <p className="text-xs text-destructive">
                      {errors.seatLayout.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Total Seats</Label>
                <Input
                  type="number"
                  {...register("totalSeats", { valueAsNumber: true })}
                  placeholder="40"
                />
                {errors.totalSeats && (
                  <p className="text-xs text-destructive">
                    {errors.totalSeats.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={createBus.isPending}
              >
                {createBus.isPending ? "Adding..." : "Add Bus"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // use stable placeholder ids as keys instead of array index
                ["loading-1", "loading-2", "loading-3"].map((id) => (
                  <TableRow key={id}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : buses?.length ? (
                buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>
                      <p className="flex items-center gap-2 font-medium">
                        <Bus className="h-4 w-4 text-primary" />
                        {bus.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {bus.registrationNo}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadge(bus.busType)}>
                        {bus.busType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{bus.totalSeats}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bus.status === "ACTIVE"
                            ? "default"
                            : bus.status === "MAINTENANCE"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {bus.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={bus.status}
                        onValueChange={(v) =>
                          updateStatus.mutate({
                            id: bus.id,
                            status: v as IBus["status"],
                          })
                        }
                      >
                        <SelectTrigger className="ml-auto h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            [
                              "ACTIVE",
                              "INACTIVE",
                              "MAINTENANCE",
                            ] as IBus["status"][]
                          ).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <Bus className="mx-auto mb-2 h-8 w-8" />
                    No buses yet. Add your first bus!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
