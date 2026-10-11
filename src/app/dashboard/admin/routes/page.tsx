"use client";

import { MapIcon, Pencil, Plus, Power, Route } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRoutes, useToggleRouteActive } from "@/hooks";
import type { IRoute } from "@/lib/types";
import { AddRouteDialog } from "./AddRouteDialog";
import { EditRouteDialog } from "./EditRouteDialog";

export default function AdminRoutesPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useRoutes(page);
  const routes = data?.data;
  const toggleActive = useToggleRouteActive();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<IRoute | null>(null);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Routes</h1>
          <p className="text-sm text-muted-foreground">
            Manage bus routes across Bangladesh
          </p>
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4" />
          Add Route
        </Button>
      </div>

      <AddRouteDialog open={addOpen} onOpenChange={setAddOpen} />
      {editing && (
        <EditRouteDialog
          open={!!editing}
          route={editing}
          onOpenChange={(open) => !open && setEditing(null)}
        />
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            Active ({routes?.filter((route) => route.isActive).length || 0})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({routes?.filter((route) => !route.isActive).length || 0})
          </TabsTrigger>
          <TabsTrigger value="all">All ({routes?.length || 0})</TabsTrigger>
        </TabsList>

        {(["active", "inactive", "all"] as const).map((tab) => {
          const filteredRoutes = routes?.filter(
            (route) =>
              tab === "all" ||
              (tab === "active" ? route.isActive : !route.isActive),
          );

          return (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Route</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Destination</TableHead>
                        <TableHead>Stops</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        // use stable keys for loading rows instead of array indices
                        ["skeleton-1", "skeleton-2", "skeleton-3"].map(
                          (key) => (
                            <TableRow key={key}>
                              <TableCell colSpan={8}>
                                <Skeleton className="h-10" />
                              </TableCell>
                            </TableRow>
                          ),
                        )
                      ) : filteredRoutes?.length ? (
                        filteredRoutes.map((route) => (
                          <TableRow key={route.id}>
                            <TableCell className="font-medium">
                              <span className="flex items-center gap-2">
                                <Route className="h-4 w-4 text-primary" />
                                {route.name}
                              </span>
                            </TableCell>
                            <TableCell>{route.source}</TableCell>
                            <TableCell>{route.destination}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {route.stops?.length ?? 0} stops
                              </Badge>
                            </TableCell>
                            <TableCell>{route.distanceKm} km</TableCell>
                            <TableCell>
                              {Math.floor(route.estimatedMinutes / 60)}h{" "}
                              {route.estimatedMinutes % 60}m
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  route.isActive ? "default" : "secondary"
                                }
                              >
                                {route.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title="Edit route"
                                  onClick={() => setEditing(route)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  title={
                                    route.isActive
                                      ? "Deactivate route"
                                      : "Activate route"
                                  }
                                  disabled={toggleActive.isPending}
                                  onClick={() =>
                                    toggleActive.mutate({
                                      id: route.id,
                                      active: !route.isActive,
                                    })
                                  }
                                >
                                  <Power
                                    className={`h-4 w-4 ${route.isActive ? "text-destructive" : "text-muted-foreground"}`}
                                  />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={8}
                            className="py-12 text-center text-muted-foreground"
                          >
                            <MapIcon className="mx-auto mb-2 h-8 w-8" />
                            No routes found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
      {data?.meta && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
