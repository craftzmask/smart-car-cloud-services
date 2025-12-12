import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { AiModel } from "@/domain/types";
import type { CloudDashboardData } from "@/features/cloud/api/cloudDashboardApi";
import { useCloudDashboard } from "@/features/cloud/hooks/useCloudDashboard";
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
import { Button } from "@/components/ui/button";
import { AddModelDialog } from "../components/AddModelDialog";
import { EditModelDialog } from "../components/EditModelDialog";
import { DeleteModelDialog } from "../components/DeleteModelDialog";
import { Link, useNavigate } from "react-router";
import {
  Activity,
  BarChart3,
  CheckCircle,
  Code,
  Cpu,
  PenLine,
  Trash2,
} from "lucide-react";
import { createAiModel } from "../api/aiModelsApi";

export function CloudModelsPage() {
  const { data, isLoading, error } = useCloudDashboard();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
    (async () => {
      try {
        const created = await createAiModel({
          name: payload.name,
          type: payload.type,
          version: payload.version,
          status: payload.status,
        });
        queryClient.setQueryData<CloudDashboardData | undefined>(
          ["cloudDashboard"],
          (oldData) =>
            oldData
              ? {
                  ...oldData,
                  aiModels: [...oldData.aiModels, created],
                }
              : oldData
        );
      } catch (err) {
        console.error("Failed to create model", err);
      }
    })();
  }

  function handleSaveEditedModel(updated: AiModel) {
    queryClient.setQueryData<CloudDashboardData | undefined>(
      ["cloudDashboard"],
      (oldData) => {
        if (!oldData) return oldData;

        const newModels = oldData.aiModels.map((model) =>
          model.id === updated.id ? updated : model
        );
        const newData: CloudDashboardData = {
          ...oldData,
          aiModels: newModels,
        };

        return newData;
      }
    );
  }

  function handleDeleteModel(modelId: string) {
    queryClient.setQueryData<CloudDashboardData | undefined>(
      ["cloudDashboard"],
      (oldData) => {
        if (!oldData) return oldData;

        const newModels = oldData.aiModels.filter(
          (model) => model.id !== modelId
        );

        const newData: CloudDashboardData = {
          ...oldData,
          aiModels: newModels,
        };

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
      trend: "+12%",
    },
    {
      label: "Training Jobs",
      value: models.filter((model) => model.status === "TRAINING").length,
      icon: Activity,
      color: "text-orange-600",
      trend: "+1",
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
      value: "1.2M",
      icon: CheckCircle,
      color: "text-purple-600",
      trend: "+45K",
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
