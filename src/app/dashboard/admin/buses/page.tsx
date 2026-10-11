"use client";

import { Bus } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useBuses } from "@/hooks";
import type { BusType } from "@/lib/types";

function typeBadge(type: BusType) {
  const variants: Record<BusType, "default" | "secondary" | "outline"> = {
    AC: "default",
    NON_AC: "secondary",
    SLEEPER: "default",
    SEMI_SLEEPER: "outline",
  };
  return variants[type] || "default";
}

export default function AdminBusesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useBuses(page);
  const buses = data?.data;
  const skeletonKeys = useMemo(
    () => Array.from({ length: 4 }, () => crypto.randomUUID()),
    [],
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Buses</h1>
        <p className="text-sm text-muted-foreground">
          All buses registered on the platform
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bus</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                skeletonKeys.map((key) => (
                  <TableRow key={key}>
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
                    <TableCell className="text-sm">
                      {bus.operator?.companyName || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={typeBadge(bus.busType)}>
                        {bus.busType.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{bus.totalSeats}</span>
                      <span className="ml-1 text-xs text-muted-foreground">
                        seats
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          bus.status === "ACTIVE"
                            ? "default"
                            : bus.status === "MAINTENANCE"
                              ? "outline"
                              : "secondary"
                        }
                      >
                        {bus.status}
                      </Badge>
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
                    No buses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {data?.meta && data.meta.totalPages > 1 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs text-muted-foreground">
            Showing page {data.meta.page} of {data.meta.totalPages} (
            {data.meta.total} total buses)
          </p>
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
