import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AlertTypeDef } from "@/domain/types";
import type { CloudDashboardData } from "@/features/cloud/api/cloudDashboardApi";
import { useCloudDashboard } from "@/features/cloud/hooks/useCloudDashboard";
import { CloudLayout } from "../components/CloudLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableBody,
  TableHead,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import { capitalize } from "@/utils";
import { AlertSeverityBadge } from "@/components/status/AlertSeverityBadge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddAlertTypeDialog } from "../components/AddAlertTypeDialog";
import { EditAlertTypeDialog } from "../components/EditAlertTypeDialog";
import { DeleteAlertTypeDialog } from "../components/DeleteAlertTypeDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  createAlertType,
  deleteAlertType,
  updateAlertType,
} from "../api/alertTypesApi";

export function CloudAlertTypesPage() {
  const { data, isLoading, error } = useCloudDashboard();
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAlertType, setEditingAlertType] = useState<AlertTypeDef | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAlertType, setDeletingAlertType] =
    useState<AlertTypeDef | null>(null);

  const addMutation = useMutation({
    mutationFn: (input: Parameters<typeof createAlertType>[0]) =>
      createAlertType({
        ...input,
        type: input.type.toLowerCase(),
        defaultSeverity: input.defaultSeverity,
      }),
    onSuccess: (created, variables) => {
      const merged: AlertTypeDef = {
        ...created,
        name: variables.name || created.name,
      };
      queryClient.setQueryData<CloudDashboardData | undefined>(
        ["cloudDashboard"],
        (oldData) =>
          oldData
            ? {
                ...oldData,
                alertTypes: [...oldData.alertTypes, merged],
              }
            : oldData
      );
    },
  });

  const editMutation = useMutation({
    mutationFn: (input: { currentType: string; payload: Partial<AlertTypeDef> }) =>
      updateAlertType(input.currentType, {
        newType: input.payload.type || input.payload.key,
        description: input.payload.description,
        defaultSeverity: input.payload.defaultSeverity,
        category: input.payload.category,
        enabled: input.payload.enabled,
        name: input.payload.name,
      }),
    onSuccess: (updated, variables) => {
      queryClient.setQueryData<CloudDashboardData | undefined>(
        ["cloudDashboard"],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            alertTypes: oldData.alertTypes.map((t) => {
              if ((t.type || t.key) !== variables.currentType) return t;
              return {
                ...t,
                ...updated,
                name: variables.payload.name || updated.name || t.name,
              };
            }),
          };
        }
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAlertType,
    onSuccess: (deletedType) => {
      queryClient.setQueryData<CloudDashboardData | undefined>(
        ["cloudDashboard"],
        (oldData) =>
          oldData
            ? {
                ...oldData,
                alertTypes: oldData.alertTypes.filter(
                  (t) => (t.type || t.key) !== deletedType
                ),
              }
            : oldData
      );
    },
  });

  async function handleAddAlertType(payload: {
    type: string;
    name: string;
    category: AlertTypeDef["category"];
    defaultSeverity: AlertTypeDef["defaultSeverity"];
    description: string;
    enabled: boolean;
  }) {
    await addMutation.mutateAsync({
      type: payload.type,
      description: payload.description || payload.name,
      defaultSeverity: payload.defaultSeverity,
      category: payload.category,
      enabled: payload.enabled,
      name: payload.name,
    });
  }

  async function handleSaveEditedAlertType(updated: AlertTypeDef) {
    const currentType =
      editingAlertType?.type ||
      editingAlertType?.key ||
      updated.type ||
      updated.key;
    if (!currentType) return;
    await editMutation.mutateAsync({
      currentType,
      payload: updated,
    });
  }

  async function handleDeleteAlertType(type: string) {
    if (!type) return;
    await deleteMutation.mutateAsync(type);
  }

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const alertTypes = data.alertTypes as AlertTypeDef[];

  return (
    <CloudLayout>
      <div className="p-6">
        {/* Models table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Predefined alert types
              <Button onClick={() => setIsAddDialogOpen(true)}>
                Add Alert Type
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {alertTypes.length === 0 ? (
              <div className="text-slate-500">
                No alert types configured yet.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Default severity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Enabled</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alertTypes.map((t) => {
                    const name = t.name || capitalize(t.type || t.key || "");
                    const category = t.category
                      ? capitalize(t.category)
                      : "Unknown";
                    const severity = t.defaultSeverity || "INFO";
                    const enabled = t.enabled ?? false;
                    return (
                      <TableRow key={t.id || t.type || t.key}>
                        <TableCell>{name}</TableCell>
                        <TableCell>{category}</TableCell>
                        <TableCell>
                          <AlertSeverityBadge severity={severity} />
                        </TableCell>
                        <TableCell>{t.description || "-"}</TableCell>
                        <TableCell>
                          {enabled ? (
                            <span className="text-emerald-600 font-medium">
                              Enabled
                            </span>
                          ) : (
                            <span className="text-slate-500 font-medium">
                              Disabled
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="flex gap-4 justify-end">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingAlertType(t);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => {
                              setDeletingAlertType(t);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddAlertTypeDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddAlertType}
      />

      <EditAlertTypeDialog
        open={isEditDialogOpen}
        alertType={editingAlertType}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEditedAlertType}
      />

      <DeleteAlertTypeDialog
        open={isDeleteDialogOpen}
        alertType={deletingAlertType}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteAlertType}
      />
    </CloudLayout>
  );
}
