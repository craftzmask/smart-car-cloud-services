import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { OwnerDashboardData, AlertTypeDef } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
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
import { useQueryClient } from "@tanstack/react-query";
import { saveOwnerDashboard } from "@/features/owner/api/ownerDashboardStorage";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AddAlertTypeDialog } from "../components/AddAlertTypeDialog";
import { EditAlertTypeDialog } from "../components/EditAlertTypeDialog";
import { DeleteAlertTypeDialog } from "../components/DeleteAlertTypeDialog";
import { PenLine, Plus, Trash2 } from "lucide-react";

export function CloudAlertTypesPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingAlertType, setEditingAlertType] = useState<AlertTypeDef | null>(
    null
  );

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingAlertType, setDeletingAlertType] =
    useState<AlertTypeDef | null>(null);

  function handleAddAlertType(payload: {
    key: string;
    name: string;
    category: AlertTypeDef["category"];
    defaultSeverity: AlertTypeDef["defaultSeverity"];
    description: string;
    enabled: boolean;
  }) {
    const newType: AlertTypeDef = {
      id: `alert-type-${Date.now()}`,
      key: payload.key,
      name: payload.name,
      category: payload.category,
      defaultSeverity: payload.defaultSeverity,
      description: payload.description,
      enabled: payload.enabled,
    };

    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newData: OwnerDashboardData = {
          ...oldData,
          alertTypes: [...oldData.alertTypes, newType],
        };

        saveOwnerDashboard(newData);

        return newData;
      }
    );
  }

  function handleSaveEditedAlertType(updated: AlertTypeDef) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newAlertTypes = oldData.alertTypes.map((t) =>
          t.id === updated.id ? updated : t
        );

        const newData: OwnerDashboardData = {
          ...oldData,
          alertTypes: newAlertTypes,
        };

        saveOwnerDashboard(newData);

        return newData;
      }
    );
  }

  function handleDeleteAlertType(id: string) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return;

        const newAlertTypes = oldData.alertTypes.filter(
          (type) => type.id !== id
        );

        const newData = {
          ...oldData,
          alertTypes: newAlertTypes,
        };

        saveOwnerDashboard(newData);

        return newData;
      }
    );
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
                <Plus />
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
                  {alertTypes.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell>{t.name}</TableCell>
                      <TableCell>{capitalize(t.category)}</TableCell>
                      <TableCell>
                        <AlertSeverityBadge severity={t.defaultSeverity} />
                      </TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell>
                        {t.enabled ? (
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
                          <PenLine />
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeletingAlertType(t);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 />
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
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
