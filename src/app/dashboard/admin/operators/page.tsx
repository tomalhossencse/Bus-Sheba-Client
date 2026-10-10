"use client";

import { Check, ExternalLink, FileText, Users, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useApproveOperator, useGetAllOperators } from "@/hooks";
import { formatDateTime } from "@/utils";

export default function AdminOperatorsPage() {
  const { data: operators, isLoading } = useGetAllOperators();

  const { mutate: approveOperator, isPending } = useApproveOperator();
  const [rejectingOperator, setRejectingOperator] = useState<{
    id: string;
    companyName: string;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const getStatusVariant = (
    status: string,
  ): React.ComponentProps<typeof Badge>["variant"] => {
    switch (status) {
      case "APPROVED":
        return "default";
      case "REJECTED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const openRejectDialog = (operator: { id: string; companyName: string }) => {
    setRejectReason("");
    setRejectingOperator(operator);
  };

  const rejectOperator = () => {
    const reason = rejectReason.trim();
    if (!rejectingOperator || !reason) return;

    approveOperator(
      {
        operatorId: rejectingOperator.id,
        status: "REJECTED",
        rejectReason: reason,
      },
      {
        onSuccess: () => setRejectingOperator(null),
      },
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Operators</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage operator applications
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Applied</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_) => (
                  <TableRow key={Math.random()}>
                    <TableCell colSpan={5}>
                      <Skeleton className="h-10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : operators?.data?.data?.length ? (
                operators?.data.data?.map((op) => (
                  <TableRow key={op.id}>
                    <TableCell>
                      <p className="font-medium">{op.companyName}</p>
                      <p className="text-xs text-muted-foreground">
                        Phone: {op.phone || "—"}
                      </p>
                      {op.rejectionReason && (
                        <p className="mt-1 max-w-xs text-xs text-destructive">
                          Reason: {op.rejectionReason}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{op.user?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {op.user?.email}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(op.verificationStatus)}>
                        {op.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(op.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="mb-2 flex justify-end gap-2">
                        {op.nidDocument && (
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            title="View NID document"
                          >
                            <a
                              href={op.nidDocument}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <FileText className="h-4 w-4" />
                              NID
                            </a>
                          </Button>
                        )}
                        {op.tradeLicenseDocument && (
                          <Button
                            size="sm"
                            variant="ghost"
                            asChild
                            title="View trade license"
                          >
                            <a
                              href={op.tradeLicenseDocument}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              License
                            </a>
                          </Button>
                        )}
                      </div>
                      {op.verificationStatus === "PENDING" && (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-emerald-600"
                            disabled={isPending}
                            onClick={() =>
                              approveOperator({
                                operatorId: op.id,
                                status: "APPROVED",
                              })
                            }
                          >
                            <Check className="h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                            disabled={isPending}
                            onClick={() =>
                              openRejectDialog({
                                id: op.id,
                                companyName: op.companyName,
                              })
                            }
                          >
                            <X className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center text-muted-foreground"
                  >
                    <Users className="mx-auto mb-2 h-8 w-8" />
                    No operators found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(rejectingOperator)}
        onOpenChange={(open) => !open && setRejectingOperator(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject operator application</DialogTitle>
            <DialogDescription>
              Provide a clear reason for rejecting{" "}
              {rejectingOperator?.companyName}. The operator can use this
              feedback to correct the application.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Rejection reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              placeholder="Explain what needs to be corrected..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectingOperator(null)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={rejectOperator}
              disabled={!rejectReason.trim() || isPending}
            >
              {isPending ? "Rejecting..." : "Reject application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
