import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { OwnerDashboardData, AiModel } from "@/domain/types";
import { useOwnerDashboard } from "@/features/owner/hooks/useOwnerDashboard";
import { CloudLayout } from "../components/CloudLayout";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { saveOwnerDashboard } from "@/features/owner/api/ownerDashboardStorage";
import { Button } from "@/components/ui/button";
import { AddModelDialog } from "../components/AddModelDialog";
import { EditModelDialog } from "../components/EditModelDialog";
import { DeleteModelDialog } from "../components/DeleteModelDialog";
import { toast } from "sonner";
import { Link } from "react-router";
import {
  Activity,
  BarChart3,
  CheckCircle,
  Code,
  Cpu,
  PenLine,
  Trash2,
} from "lucide-react";

export function CloudModelsPage() {
  const ownerId = "u-owner-1";
  const { data, isLoading, error } = useOwnerDashboard(ownerId);
  const queryClient = useQueryClient();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<AiModel | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingModel, setDeletingModel] = useState<AiModel | null>(null);

  function handleAddModel(payload: {
    name: string;
    type: string;
    version: string;
    status: AiModel["status"];
  }) {
    toast.promise<{ name: string }>(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: payload.name }), 2000)
        ),
      {
        loading: "Loading...",
        success: (data) => {
          const newModel: AiModel = {
            id: `model-${Date.now()}`,
            name: payload.name,
            type: payload.type,
            version: payload.version,
            status: payload.status,
            updatedAt: new Date().toISOString(),
            accuracy: 0, // e.g. 94.2
            deploymentStage: "STAGING",
          };

          queryClient.setQueryData<OwnerDashboardData | undefined>(
            ["ownerDashboard", ownerId],
            (oldData) => {
              if (!oldData) return oldData;
              const newData: OwnerDashboardData = {
                ...oldData,
                aiModels: [...oldData.aiModels, newModel],
              };
              saveOwnerDashboard(newData);
              return newData;
            }
          );

          return `${data.name} has been created`;
        },
        error: "Error",
      }
    );
  }

  function handleSaveEditedModel(updated: AiModel) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newModels = oldData.aiModels.map((model) =>
          model.id === updated.id ? updated : model
        );
        const newData: OwnerDashboardData = {
          ...oldData,
          aiModels: newModels,
        };

        saveOwnerDashboard(newData);
        return newData;
      }
    );
  }

  function handleDeleteModel(modelId: string) {
    queryClient.setQueryData<OwnerDashboardData | undefined>(
      ["ownerDashboard", ownerId],
      (oldData) => {
        if (!oldData) return oldData;

        const newModels = oldData.aiModels.filter(
          (model) => model.id !== modelId
        );

        const newData: OwnerDashboardData = {
          ...oldData,
          aiModels: newModels,
        };

        saveOwnerDashboard(newData);
        return newData;
      }
    );
  }

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const models = data.aiModels as AiModel[];

  const metrics = [
    {
      label: "Active Models",
      value: models.filter((model) => model.status === "RUNNING").length,
      icon: Cpu,
      color: "text-blue-600",
      trend: "+1",
    },
    {
      label: "Training Jobs",
      value: models.filter((model) => model.status === "TRAINING").length,
      icon: Activity,
      color: "text-orange-600",
      trend: "0",
    },
    {
      label: "Avg Accuracy",
      value: `${
        models.length === 0
          ? 0
          : (
              models.reduce((total, model) => total + model.accuracy, 0) /
              models.length
            ).toFixed(1)
      }%`,
      icon: BarChart3,
      color: "text-green-600",
      trend: "+2.3%",
    },
    {
      label: "Total Predictions",
      value: "253",
      icon: CheckCircle,
      color: "text-purple-600",
      trend: "+45",
    },
  ];

  return (
    <CloudLayout>
      {/* Models table */}

      {/* Metrics Dashboard */}
      <div className="border-b bg-muted/40 px-6 py-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>{metric.label}</CardTitle>
                <metric.icon className={`${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  {metric.trend} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Registered Models</CardTitle>
            <CardDescription>
              Manage and monitor all your machine learning models
            </CardDescription>
            <CardAction>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Code />
                Create New Model
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {models.length === 0 ? (
              <div className="text-slate-500">No AI models configured yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Trained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell className="hover:underline">
                        <Link to={`/cloud/models/${model.id}`}>
                          {model.name}
                        </Link>
                      </TableCell>
                      <TableCell>{model.type}</TableCell>
                      <TableCell
                        className={
                          model.status === "RUNNING"
                            ? "text-emerald-600 font-medium"
                            : model.status === "TRAINING"
                            ? "text-amber-600 font-medium"
                            : "text-slate-500 font-medium"
                        }
                      >
                        {model.status}
                      </TableCell>
                      <TableCell className="text-emerald-600 font-medium">
                        {model.accuracy.toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {model.version}
                        </code>
                      </TableCell>
                      <TableCell>{formatDate(model.updatedAt)}</TableCell>
                      <TableCell className="flex items-center gap-4 justify-end">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingModel(model);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <PenLine />
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            setDeletingModel(model);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 />
                          Delete
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

      <AddModelDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSave={handleAddModel}
      />

      <EditModelDialog
        open={isEditDialogOpen}
        model={editingModel}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleSaveEditedModel}
      />

      <DeleteModelDialog
        open={isDeleteDialogOpen}
        model={deletingModel}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteModel}
      />
    </CloudLayout>
  );
}
