// import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
// import { Button } from "./components/ui/button";

// export default function App() {
//   return (
//     <div>
//       <Card>
//         <CardHeader>
//           <CardTitle>Smart Car Cloud</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Fontend skeleton is ready</p>
//           <Button>Test Button</Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import React, { useState } from "react";
import {
  Upload,
  Play,
  Pause,
  Settings,
  Activity,
  Database,
  Code,
  BarChart3,
  CheckCircle,
  Clock,
  Cpu,
  TrendingUp,
  Download,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "./components/shared/UploadFile";
import SimpleMap from "./components/shared/Map";

const MLModuleManager = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  // Mock data
  const models = [
    {
      id: 1,
      name: "Audio Anomaly Detector v2.1",
      type: "CNN-LSTM",
      status: "deployed",
      accuracy: 94.2,
      lastTrained: "2024-11-20",
      version: "2.1.0",
      inputShape: "[128, 128, 1]",
    },
    {
      id: 2,
      name: "Emergency Sound Classifier",
      type: "Random Forest",
      status: "training",
      accuracy: 89.7,
      lastTrained: "2024-11-25",
      version: "1.5.2",
      inputShape: "[40, 100]",
    },
    {
      id: 3,
      name: "Vehicle Health Predictor",
      type: "XGBoost",
      status: "idle",
      accuracy: 91.3,
      lastTrained: "2024-11-15",
      version: "3.0.1",
      inputShape: "[13]",
    },
  ];

  const trainingJobs = [
    {
      id: 1,
      model: "Audio Anomaly Detector v2.1",
      progress: 75,
      epoch: "15/20",
      eta: "12 min",
    },
    {
      id: 2,
      model: "Emergency Sound Classifier",
      progress: 45,
      epoch: "9/20",
      eta: "28 min",
    },
  ];

  const metrics = [
    {
      label: "Active Models",
      value: "3",
      icon: Cpu,
      color: "text-blue-600",
      trend: "+12%",
    },
    {
      label: "Training Jobs",
      value: "2",
      icon: Activity,
      color: "text-orange-600",
      trend: "+1",
    },
    {
      label: "Avg Accuracy",
      value: "91.7%",
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

  const getStatusVariant = (status) => {
    const variants = {
      deployed: "default",
      training: "secondary",
      idle: "outline",
      failed: "destructive",
    };
    return variants[status] || "outline";
  };

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="w-200 p-6 flex justify-center">
        <FileUpload
          title="Upload audio files"
          description="Supported: WAV, MP3, FLAC - Max ~10MB recommended"
          onUpload={async (file) => {
            console.log("Start upload:", file);
            await new Promise((res) => setTimeout(res, 2000));
            console.log("Finished upload");
          }}
        />
      </div>
      {/* Header */}
      <div className="border-b">
        <div className="flex h-16 items-center px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight">
              ML Module Manager
            </h1>
            <p className="text-sm text-muted-foreground">
              Framework-Independent Machine Learning Platform
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" />
              Import Model
            </Button>
            <Button className="gap-2">
              <Code className="h-4 w-4" />
              Create New Model
            </Button>
          </div>
        </div>
      </div>

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
                  <TrendingUp className="h-3 w-3" />
                  {metric.trend} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 pt-6">
        <Tabs defaultValue="models" className="space-y-4">
          <TabsList className="grid w-full max-w-2xl grid-cols-5">
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="training">Training</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Models Tab */}
          <TabsContent value="models">
            <Card>
              <CardHeader>
                <CardTitle>Registered Models</CardTitle>
                <CardDescription>
                  Manage and monitor all your machine learning models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Model Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Accuracy</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Last Trained</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {models.map((model) => (
                      <TableRow
                        key={model.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedModel(model)}
                      >
                        <TableCell className="font-medium">
                          {model.name}
                        </TableCell>
                        <TableCell>{model.type}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(model.status)}>
                            {model.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-green-600">
                            {model.accuracy}%
                          </span>
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            v{model.version}
                          </code>
                        </TableCell>
                        <TableCell>{model.lastTrained}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Play className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Training Jobs</CardTitle>
                <CardDescription>
                  Monitor and manage ongoing model training
                </CardDescription>
                <CardAction>
                  <Button>Start New Training</Button>
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainingJobs.map((job) => (
                  <div key={job.id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{job.model}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Epoch {job.epoch} • ETA: {job.eta}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Pause className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{job.progress}%</span>
                      </div>
                      <Progress value={job.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Training Configuration</CardTitle>
                <CardDescription>
                  Configure parameters for model training
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="model-type">Model Type</Label>
                    <Select defaultValue="cnn-lstm">
                      <SelectTrigger id="model-type">
                        <SelectValue placeholder="Select model type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cnn-lstm">CNN-LSTM</SelectItem>
                        <SelectItem value="random-forest">
                          Random Forest
                        </SelectItem>
                        <SelectItem value="xgboost">XGBoost</SelectItem>
                        <SelectItem value="svm">SVM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataset">Training Dataset</Label>
                    <Select defaultValue="audio-v3">
                      <SelectTrigger id="dataset">
                        <SelectValue placeholder="Select dataset" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio-v3">
                          Audio Anomaly Dataset v3
                        </SelectItem>
                        <SelectItem value="emergency">
                          Emergency Sounds Dataset
                        </SelectItem>
                        <SelectItem value="vehicle">
                          Vehicle Health Dataset
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="epochs">Epochs</Label>
                    <Input id="epochs" type="number" defaultValue="20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch-size">Batch Size</Label>
                    <Input id="batch-size" type="number" defaultValue="32" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="learning-rate">Learning Rate</Label>
                    <Input
                      id="learning-rate"
                      type="number"
                      step="0.0001"
                      defaultValue="0.001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="validation-split">Validation Split</Label>
                    <Input
                      id="validation-split"
                      type="number"
                      step="0.05"
                      defaultValue="0.2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Production
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">Active Models</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Staging</CardTitle>
                  <Clock className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1</div>
                  <p className="text-xs text-muted-foreground">
                    Testing Models
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Archived
                  </CardTitle>
                  <Database className="h-4 w-4 text-gray-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">Old Versions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Deployment Pipeline</CardTitle>
                <CardDescription>
                  Manage model deployments across environments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {models
                  .filter((m) => m.status === "deployed")
                  .map((model) => (
                    <div key={model.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{model.name}</h4>
                          <p className="text-sm text-muted-foreground font-mono">
                            Endpoint: /api/v1/predict/{model.id}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Rollback
                          </Button>
                          <Button variant="destructive" size="sm">
                            Undeploy
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Tab */}
          <TabsContent value="monitoring" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Prediction Latency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 rounded border bg-muted/50 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Line Chart: Avg 45ms, P95 120ms
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Model Accuracy Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 rounded border bg-muted/50 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Line Chart: 91.7% → 94.2%
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Real-time Metrics</CardTitle>
                <CardDescription>
                  Monitor model performance in production
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-sm text-muted-foreground">
                      Requests/min
                    </p>
                    <p className="text-2xl font-bold mt-1">342</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-sm text-muted-foreground">Avg Latency</p>
                    <p className="text-2xl font-bold mt-1">45ms</p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-sm text-muted-foreground">Error Rate</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      0.2%
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 text-center">
                    <p className="text-sm text-muted-foreground">CPU Usage</p>
                    <p className="text-2xl font-bold mt-1">34%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Configuration</CardTitle>
                <CardDescription>
                  Configure alerts for performance thresholds
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="accuracy-alert">Accuracy Drop Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Trigger when accuracy drops below 85%
                    </p>
                  </div>
                  <Switch id="accuracy-alert" defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <Label htmlFor="latency-alert">High Latency Alert</Label>
                    <p className="text-sm text-muted-foreground">
                      Trigger when latency exceeds 200ms
                    </p>
                  </div>
                  <Switch id="latency-alert" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
                <CardDescription>
                  RESTful API for model management and inference
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Core Endpoints</h3>
                  <div className="space-y-3">
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">POST</Badge>
                        <code className="text-sm font-mono">
                          /api/v1/models/train
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Train a new machine learning model
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge>GET</Badge>
                        <code className="text-sm font-mono">
                          /api/v1/models
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        List all registered models
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="secondary">POST</Badge>
                        <code className="text-sm font-mono">
                          /api/v1/predict/:modelId
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Make predictions using a deployed model
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">PUT</Badge>
                        <code className="text-sm font-mono">
                          /api/v1/models/:id/deploy
                        </code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Deploy a trained model to production
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Example Request</h3>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-4 font-mono text-sm text-slate-50 overflow-x-auto">
                    <pre>{`curl -X POST https://api.example.com/v1/predict/1 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "input": {
      "audio_features": [0.23, 0.45, ...],
      "metadata": {
        "vehicle_id": "AV-001",
        "timestamp": "2024-11-28T10:30:00Z"
      }
    }
  }'`}</pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Example Response</h3>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Download className="h-3 w-3" />
                      Copy
                    </Button>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-4 font-mono text-sm text-slate-50 overflow-x-auto">
                    <pre>{`{
  "prediction": {
    "class": "emergency_siren",
    "confidence": 0.94,
    "probability_distribution": {
      "emergency_siren": 0.94,
      "normal": 0.04,
      "warning": 0.02
    }
  },
  "model_info": {
    "model_id": 1,
    "version": "2.1.0",
    "latency_ms": 42
  }
}`}</pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Model Detail Dialog */}
      <Dialog
        open={!!selectedModel}
        onOpenChange={() => setSelectedModel(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedModel?.name}</DialogTitle>
            <DialogDescription>
              Detailed information and actions for this model
            </DialogDescription>
          </DialogHeader>
          {selectedModel && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Model Type</p>
                  <p className="font-semibold">{selectedModel.type}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={getStatusVariant(selectedModel.status)}>
                    {selectedModel.status}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="font-semibold text-green-600">
                    {selectedModel.accuracy}%
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Version</p>
                  <p className="font-semibold">{selectedModel.version}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Input Shape</p>
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedModel.inputShape}
                  </code>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Last Trained</p>
                  <p className="font-semibold">{selectedModel.lastTrained}</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3">Model Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full">Retrain Model</Button>
                  <Button variant="secondary" className="w-full">
                    Test Predictions
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Model
                  </Button>
                  <Button variant="outline" className="w-full">
                    View Metrics
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MLModuleManager;
