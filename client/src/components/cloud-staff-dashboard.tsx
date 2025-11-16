import React from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
  Progress,
  Chip,
  Tabs,
  Tab,
  Table,
  TableColumn,
  TableHeader,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { SystemAlertsPage } from "./system-alerts-page";
import { mockCars } from "../data/mock-data";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface CloudStaffDashboardProps {
  onLogout: () => void;
}

export const CloudStaffDashboard: React.FC<CloudStaffDashboardProps> = ({ onLogout }) => {
  // Add state for view all alerts
  const [showAllAlerts, setShowAllAlerts] = React.useState(false);
  
  // Add state for active tab
  const [activeTab, setActiveTab] = React.useState("overview");
  
  // Sample data for cloud infrastructure
  const serverMetrics = [
    { name: "CPU Usage", value: 42, max: 100, unit: "%", status: "success" },
    { name: "Memory", value: 68, max: 100, unit: "%", status: "warning" },
    { name: "Storage", value: 56, max: 100, unit: "%", status: "success" },
    { name: "Network", value: 35, max: 100, unit: "Gbps", status: "success" }
  ];

  const trafficData = [
    { time: "00:00", value: 42 },
    { time: "04:00", value: 28 },
    { time: "08:00", value: 65 },
    { time: "12:00", value: 87 },
    { time: "16:00", value: 92 },
    { time: "20:00", value: 75 },
    { time: "Now", value: 63 },
  ];

  // Sample data for autonomous fleet
  const fleetMetrics = [
    { name: "Connected Cars", value: 248, change: "+12", status: "success" },
    { name: "Active Sensors", value: 1842, change: "+56", status: "success" },
    { name: "Data Streams", value: 524, change: "-8", status: "warning" },
    { name: "AI Predictions", value: "98.7%", change: "+0.5%", status: "success" }
  ];

  // Sample data for AI models
  const aiModels = [
    { id: "model-001", name: "Traffic Prediction v2.4", status: "active", accuracy: 98.7, lastUpdated: "2 days ago", type: "prediction" },
    { id: "model-002", name: "Object Detection v3.1", status: "active", accuracy: 99.2, lastUpdated: "5 days ago", type: "vision" },
    { id: "model-003", name: "Route Optimization v1.8", status: "training", accuracy: 94.5, lastUpdated: "1 day ago", type: "optimization" },
    { id: "model-004", name: "Weather Impact v2.0", status: "active", accuracy: 91.3, lastUpdated: "1 week ago", type: "prediction" },
    { id: "model-005", name: "Emergency Response v1.5", status: "testing", accuracy: 97.8, lastUpdated: "3 days ago", type: "decision" }
  ];

  // Sample data for connectivity
  const connectivityData = [
    { region: "North America", status: "operational", latency: 24, bandwidth: 95, outages: 0 },
    { region: "Europe", status: "operational", latency: 32, bandwidth: 92, outages: 0 },
    { region: "Asia Pacific", status: "degraded", latency: 48, bandwidth: 78, outages: 2 },
    { region: "South America", status: "operational", latency: 56, bandwidth: 85, outages: 0 },
    { region: "Africa", status: "issues", latency: 72, bandwidth: 65, outages: 5 }
  ];

  // Sample alert configuration data
  const alertConfigs = [
    { id: "cfg-001", name: "Critical System Failure", priority: "high", notifyChannels: ["email", "sms", "push"], autoRemediate: true },
    { id: "cfg-002", name: "Connectivity Loss", priority: "high", notifyChannels: ["email", "sms"], autoRemediate: false },
    { id: "cfg-003", name: "AI Model Drift", priority: "medium", notifyChannels: ["email"], autoRemediate: false },
    { id: "cfg-004", name: "Sensor Malfunction", priority: "medium", notifyChannels: ["email", "push"], autoRemediate: true },
    { id: "cfg-005", name: "Battery Warning", priority: "low", notifyChannels: ["email"], autoRemediate: false }
  ];

  const alertsData = [
    { id: 1, severity: "high", message: "Database server high load", time: "10 mins ago" },
    { id: 2, severity: "medium", message: "API rate limit reached", time: "25 mins ago" },
    { id: 3, severity: "low", message: "Storage usage above 50%", time: "1 hour ago" },
    { id: 4, severity: "low", message: "Routine backup completed", time: "3 hours ago" },
  ];

  const severityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "primary";
      default:
        return "default";
    }
  };

  // Return the SystemAlertsPage if showAllAlerts is true
  if (showAllAlerts) {
    return <SystemAlertsPage onBack={() => setShowAllAlerts(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-content1 border-b border-divider p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Icon icon="lucide:cloud" className="text-warning text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Cloud Staff Dashboard</h1>
              <p className="text-xs text-foreground-500">Autonomous Fleet Management & Monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge content="3" color="danger">
              <Button
                isIconOnly
                variant="light"
                aria-label="Notifications"
              >
                <Icon icon="lucide:bell" />
              </Button>
            </Badge>
            
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                  startContent={
                    <Avatar
                      src="https://img.heroui.chat/image/avatar?w=200&h=200&u=3"
                      name="Cloud Admin"
                      size="sm"
                    />
                  }
                >
                  Cloud Admin
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions">
                <DropdownItem key="profile">My Profile</DropdownItem>
                <DropdownItem key="settings">Settings</DropdownItem>
                <DropdownItem key="help">Help & Support</DropdownItem>
                <DropdownItem 
                  key="logout" 
                  color="danger"
                  onPress={onLogout}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Navigation Tabs */}
        <Tabs 
          aria-label="Dashboard Sections" 
          selectedKey={activeTab} 
          onSelectionChange={setActiveTab as any}
          className="mb-6"
        >
          <Tab key="overview" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:layout-dashboard" />
              <span>Overview</span>
            </div>
          }>
            {/* Server Metrics */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Server Metrics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {serverMetrics.map((metric) => (
                  <Card key={metric.name} className="shadow-sm">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">{metric.name}</h3>
                        <Chip 
                          color={metric.status as "success" | "warning" | "danger"} 
                          variant="flat"
                          size="sm"
                        >
                          {metric.status === "success" ? "Normal" : "Warning"}
                        </Chip>
                      </div>
                      <div className="text-2xl font-semibold mb-2">
                        {metric.value}{metric.unit}
                        <span className="text-xs text-foreground-500 ml-1">/ {metric.max}{metric.unit}</span>
                      </div>
                      <Progress 
                        value={(metric.value / metric.max) * 100} 
                        color={metric.status as "success" | "warning" | "danger"}
                        className="h-1"
                        showValueLabel={false}
                      />
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Autonomous Fleet Metrics */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Autonomous Fleet</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {fleetMetrics.map((metric) => (
                  <Card key={metric.name} className="shadow-sm">
                    <CardBody className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">{metric.name}</h3>
                        <Chip 
                          color={metric.status as "success" | "warning" | "danger"} 
                          variant="flat"
                          size="sm"
                        >
                          {metric.change}
                        </Chip>
                      </div>
                      <div className="text-2xl font-semibold">
                        {metric.value}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Charts - Changed from grid to single column */}
            <div className="mb-6">
              {/* Traffic Chart */}
              <Card>
                <CardHeader className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Network Traffic</h2>
                  <Button
                    variant="flat"
                    size="sm"
                    endContent={<Icon icon="lucide:arrow-right" />}
                  >
                    Details
                  </Button>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData}>
                        <defs>
                          <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--heroui-warning))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--heroui-warning))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                          domain={[0, 100]} 
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 12 }}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Usage']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--heroui-warning))" 
                          strokeWidth={2}
                          fill="url(#trafficGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
            
            {/* System Alerts */}
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">System Alerts</h2>
                <Button
                  variant="flat"
                  size="sm"
                  endContent={<Icon icon="lucide:arrow-right" />}
                  onPress={() => setShowAllAlerts(true)}
                >
                  View All
                </Button>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {alertsData.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-medium border-l-4 border-${severityColor(alert.severity)} bg-content2/50 flex items-center justify-between`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${severityColor(alert.severity)}/10 flex items-center justify-center`}>
                          <Icon 
                            icon={alert.severity === "high" ? "lucide:alert-triangle" : 
                                  alert.severity === "medium" ? "lucide:alert-circle" : "lucide:info"} 
                            className={`text-${severityColor(alert.severity)}`} 
                          />
                        </div>
                        <div>
                          <div className="font-medium">{alert.message}</div>
                          <div className="text-xs text-foreground-500">{alert.time}</div>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label="View alert details"
                      >
                        <Icon icon="lucide:chevron-right" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </Tab>
          
          {/* AI Models Tab */}
          <Tab key="ai-models" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:brain" />
              <span>AI Models</span>
            </div>
          }>
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">AI Service Models</h2>
                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    size="sm"
                    startContent={<Icon icon="lucide:filter" />}
                  >
                    Filter
                  </Button>
                  <Button
                    color="primary"
                    size="sm"
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    Deploy New Model
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table 
                  aria-label="AI Models table"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>MODEL</TableColumn>
                    <TableColumn>TYPE</TableColumn>
                    <TableColumn>ACCURACY</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>LAST UPDATED</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {aiModels.map((model) => (
                      <TableRow key={model.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                              <Icon 
                                icon={
                                  model.type === "vision" ? "lucide:eye" : 
                                  model.type === "prediction" ? "lucide:trending-up" : 
                                  model.type === "optimization" ? "lucide:settings" : 
                                  "lucide:cpu"
                                } 
                                className="text-secondary" 
                              />
                            </div>
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-foreground-500">ID: {model.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{model.type}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={model.accuracy} 
                              color={
                                model.accuracy > 95 ? "success" : 
                                model.accuracy > 90 ? "warning" : 
                                "danger"
                              }
                              size="sm"
                              className="max-w-[80px]"
                            />
                            <span>{model.accuracy}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={
                              model.status === "active" ? "success" : 
                              model.status === "training" ? "primary" : 
                              "warning"
                            } 
                            variant="flat"
                            size="sm"
                          >
                            {model.status}
                          </Chip>
                        </TableCell>
                        <TableCell>{model.lastUpdated}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="View model details"
                            >
                              <Icon icon="lucide:eye" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="Edit model"
                            >
                              <Icon icon="lucide:edit" />
                            </Button>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  aria-label="More options"
                                >
                                  <Icon icon="lucide:more-vertical" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Model actions">
                                <DropdownItem startContent={<Icon icon="lucide:refresh-cw" />}>
                                  Retrain Model
                                </DropdownItem>
                                <DropdownItem startContent={<Icon icon="lucide:download" />}>
                                  Export Model
                                </DropdownItem>
                                <DropdownItem startContent={<Icon icon="lucide:bar-chart" />}>
                                  View Performance
                                </DropdownItem>
                                <DropdownItem 
                                  startContent={<Icon icon="lucide:trash-2" />}
                                  className="text-danger"
                                >
                                  Delete Model
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Model Performance</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        {name: 'Jan', v1: 92, v2: 88, v3: 90},
                        {name: 'Feb', v1: 93, v2: 89, v3: 91},
                        {name: 'Mar', v1: 94, v2: 90, v3: 92},
                        {name: 'Apr', v1: 95, v2: 92, v3: 93},
                        {name: 'May', v1: 97, v2: 93, v3: 94},
                        {name: 'Jun', v1: 98, v2: 95, v3: 95},
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          domain={[85, 100]} 
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Accuracy']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="v1" name="Object Detection" stroke="hsl(var(--heroui-primary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="v2" name="Traffic Prediction" stroke="hsl(var(--heroui-secondary))" strokeWidth={2} />
                        <Line type="monotone" dataKey="v3" name="Route Optimization" stroke="hsl(var(--heroui-success))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Model Usage</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        {name: 'Object Detection', value: 842},
                        {name: 'Traffic Prediction', value: 621},
                        {name: 'Route Optimization', value: 453},
                        {name: 'Weather Impact', value: 287},
                        {name: 'Emergency Response', value: 124},
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false}
                          tickLine={false}
                          tick={{fontSize: 10}}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `${value}K`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}K`, 'Requests/hour']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--heroui-secondary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
          
          {/* Connectivity Tab */}
          <Tab key="connectivity" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:wifi" />
              <span>Connectivity</span>
            </div>
          }>
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Global Connectivity Status</h2>
                <Button
                  variant="flat"
                  size="sm"
                  startContent={<Icon icon="lucide:refresh-cw" />}
                >
                  Refresh
                </Button>
              </CardHeader>
              <CardBody>
                <Table 
                  aria-label="Connectivity status table"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>REGION</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>LATENCY</TableColumn>
                    <TableColumn>BANDWIDTH</TableColumn>
                    <TableColumn>OUTAGES (24H)</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {connectivityData.map((region) => (
                      <TableRow key={region.region}>
                        <TableCell>
                          <div className="font-medium">{region.region}</div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={
                              region.status === "operational" ? "success" : 
                              region.status === "degraded" ? "warning" : 
                              "danger"
                            } 
                            variant="flat"
                            size="sm"
                          >
                            {region.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{region.latency} ms</span>
                            {region.latency > 50 && (
                              <Icon icon="lucide:alert-triangle" className="text-warning text-sm" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={region.bandwidth} 
                              color={
                                region.bandwidth > 90 ? "success" : 
                                region.bandwidth > 70 ? "warning" : 
                                "danger"
                              }
                              size="sm"
                              className="max-w-[80px]"
                            />
                            <span>{region.bandwidth}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {region.outages > 0 ? (
                            <Chip 
                              color={
                                region.outages > 3 ? "danger" : 
                                "warning"
                              } 
                              variant="flat"
                              size="sm"
                            >
                              {region.outages}
                            </Chip>
                          ) : (
                            <Chip 
                              color="success" 
                              variant="flat"
                              size="sm"
                            >
                              None
                            </Chip>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="View details"
                            >
                              <Icon icon="lucide:eye" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="Run diagnostics"
                            >
                              <Icon icon="lucide:activity" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color={region.status !== "operational" ? "warning" : "default"}
                              aria-label="Reset connections"
                            >
                              <Icon icon="lucide:refresh-cw" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Connection Types</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: '5G', value: 65 },
                            { name: '4G/LTE', value: 25 },
                            { name: 'Satellite', value: 8 },
                            { name: 'Other', value: 2 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { color: "hsl(var(--heroui-primary))" },
                            { color: "hsl(var(--heroui-secondary))" },
                            { color: "hsl(var(--heroui-success))" },
                            { color: "hsl(var(--heroui-warning))" }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Connections']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Data Transfer</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        {time: '00:00', upload: 1.2, download: 2.8},
                        {time: '04:00', upload: 0.8, download: 1.5},
                        {time: '08:00', upload: 2.1, download: 3.2},
                        {time: '12:00', upload: 2.8, download: 4.5},
                        {time: '16:00', upload: 3.2, download: 5.1},
                        {time: '20:00', upload: 2.5, download: 4.2},
                        {time: 'Now', upload: 1.8, download: 3.7},
                      ]}>
                        <defs>
                          <linearGradient id="uploadGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--heroui-secondary))" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="hsl(var(--heroui-secondary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                        <XAxis 
                          dataKey="time" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => `${value} TB`}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value} TB`, 'Data']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="upload" 
                          name="Upload" 
                          stroke="hsl(var(--heroui-primary))" 
                          strokeWidth={2}
                          fill="url(#uploadGradient)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="download" 
                          name="Download" 
                          stroke="hsl(var(--heroui-secondary))" 
                          strokeWidth={2}
                          fill="url(#downloadGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
          
          {/* Alert Configuration Tab */}
          <Tab key="alerts" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:bell" />
              <span>Alert Config</span>
            </div>
          }>
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Alert Configurations</h2>
                <Button
                  color="primary"
                  size="sm"
                  startContent={<Icon icon="lucide:plus" />}
                >
                  New Alert Config
                </Button>
              </CardHeader>
              <CardBody>
                <Table 
                  aria-label="Alert configurations table"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>ALERT NAME</TableColumn>
                    <TableColumn>PRIORITY</TableColumn>
                    <TableColumn>NOTIFICATION CHANNELS</TableColumn>
                    <TableColumn>AUTO-REMEDIATE</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {alertConfigs.map((config) => (
                      <TableRow key={config.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full bg-${severityColor(config.priority)}/10 flex items-center justify-center`}>
                              <Icon 
                                icon={
                                  config.priority === "high" ? "lucide:alert-triangle" : 
                                  config.priority === "medium" ? "lucide:alert-circle" : 
                                  "lucide:info"
                                } 
                                className={`text-${severityColor(config.priority)}`} 
                              />
                            </div>
                            <div>
                              <div className="font-medium">{config.name}</div>
                              <div className="text-xs text-foreground-500">ID: {config.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={severityColor(config.priority)} 
                            variant="flat"
                            size="sm"
                          >
                            {config.priority}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {config.notifyChannels.includes("email") && (
                              <Chip size="sm" variant="flat">
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:mail" className="text-xs" />
                                  <span>Email</span>
                                </div>
                              </Chip>
                            )}
                            {config.notifyChannels.includes("sms") && (
                              <Chip size="sm" variant="flat">
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:message-square" className="text-xs" />
                                  <span>SMS</span>
                                </div>
                              </Chip>
                            )}
                            {config.notifyChannels.includes("push") && (
                              <Chip size="sm" variant="flat">
                                <div className="flex items-center gap-1">
                                  <Icon icon="lucide:bell" className="text-xs" />
                                  <span>Push</span>
                                </div>
                              </Chip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={config.autoRemediate ? "success" : "default"} 
                            variant="flat"
                            size="sm"
                          >
                            {config.autoRemediate ? "Enabled" : "Disabled"}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="Edit configuration"
                            >
                              <Icon icon="lucide:edit" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="Test alert"
                            >
                              <Icon icon="lucide:zap" />
                            </Button>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  aria-label="More options"
                                >
                                  <Icon icon="lucide:more-vertical" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Alert config actions">
                                <DropdownItem startContent={<Icon icon="lucide:copy" />}>
                                  Duplicate
                                </DropdownItem>
                                <DropdownItem startContent={<Icon icon="lucide:pause" />}>
                                  Disable
                                </DropdownItem>
                                <DropdownItem startContent={<Icon icon="lucide:history" />}>
                                  View History
                                </DropdownItem>
                                <DropdownItem 
                                  startContent={<Icon icon="lucide:trash-2" />}
                                  className="text-danger"
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Alert Distribution</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'High', value: 15 },
                            { name: 'Medium', value: 35 },
                            { name: 'Low', value: 50 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell key="cell-0" fill="hsl(var(--heroui-danger))" />
                          <Cell key="cell-1" fill="hsl(var(--heroui-warning))" />
                          <Cell key="cell-2" fill="hsl(var(--heroui-primary))" />
                        </Pie>
                        <Legend />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Alerts']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Alert Trends</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        {day: 'Mon', high: 5, medium: 12, low: 18},
                        {day: 'Tue', high: 7, medium: 10, low: 15},
                        {day: 'Wed', high: 3, medium: 8, low: 12},
                        {day: 'Thu', high: 4, medium: 9, low: 14},
                        {day: 'Fri', high: 6, medium: 11, low: 16},
                        {day: 'Sat', high: 2, medium: 7, low: 10},
                        {day: 'Sun', high: 1, medium: 5, low: 8},
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                        <XAxis 
                          dataKey="day" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}`, 'Alerts']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="high" name="High Priority" stroke="hsl(var(--heroui-danger))" strokeWidth={2} />
                        <Line type="monotone" dataKey="medium" name="Medium Priority" stroke="hsl(var(--heroui-warning))" strokeWidth={2} />
                        <Line type="monotone" dataKey="low" name="Low Priority" stroke="hsl(var(--heroui-primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
          
          {/* Fleet Management Tab */}
          <Tab key="fleet" title={
            <div className="flex items-center gap-2">
              <Icon icon="lucide:car" />
              <span>Fleet</span>
            </div>
          }>
            <Card className="mb-6">
              <CardHeader className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Autonomous Fleet Status</h2>
                <div className="flex gap-2">
                  <Button
                    variant="flat"
                    size="sm"
                    startContent={<Icon icon="lucide:filter" />}
                  >
                    Filter
                  </Button>
                  <Button
                    variant="flat"
                    size="sm"
                    startContent={<Icon icon="lucide:map" />}
                  >
                    Map View
                  </Button>
                </div>
              </CardHeader>
              <CardBody>
                <Table 
                  aria-label="Fleet status table"
                  removeWrapper
                >
                  <TableHeader>
                    <TableColumn>VEHICLE</TableColumn>
                    <TableColumn>STATUS</TableColumn>
                    <TableColumn>BATTERY</TableColumn>
                    <TableColumn>LOCATION</TableColumn>
                    <TableColumn>LAST UPDATED</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {mockCars.map((car) => (
                      <TableRow key={car.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img 
                                src={car.image} 
                                alt={car.model}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{car.model}</div>
                              <div className="text-xs text-foreground-500">ID: {car.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            color={
                              car.status === "online" ? "success" : 
                              car.status === "maintenance" ? "warning" : 
                              "danger"
                            } 
                            variant="flat"
                            size="sm"
                          >
                            {car.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={car.battery} 
                              color={
                                car.battery > 50 ? "success" : 
                                car.battery > 20 ? "warning" : 
                                "danger"
                              }
                              size="sm"
                              className="max-w-[80px]"
                            />
                            <span>{car.battery}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Icon icon="lucide:map-pin" className="text-primary text-sm" />
                            <span>{car.location.address.split(',')[0]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span>Just now</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="View details"
                            >
                              <Icon icon="lucide:eye" />
                            </Button>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              aria-label="Remote control"
                            >
                              <Icon icon="lucide:gamepad-2" />
                            </Button>
                            <Dropdown>
                              <DropdownTrigger>
                                <Button
                                  isIconOnly
                                  variant="light"
                                  size="sm"
                                  aria-label="More options"
                                >
                                  <Icon icon="lucide:more-vertical" />
                                </Button>
                              </DropdownTrigger>
                              <DropdownMenu aria-label="Vehicle actions">
                                <DropdownItem startContent={<Icon icon="lucide:refresh-cw" />}>
                                  Restart Systems
                                </DropdownItem>
                                <DropdownItem startContent={<Icon icon="lucide:zap" />}>
                                  Force Update
                                </DropdownItem>
                                <DropdownItem startContent={<Icon icon="lucide:shield" />}>
                                  Security Scan
                                </DropdownItem>
                                <DropdownItem 
                                  startContent={<Icon icon="lucide:power" />}
                                  className="text-danger"
                                >
                                  Emergency Shutdown
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Fleet Distribution</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Tesla Model S', value: 35 },
                            { name: 'BMW i4', value: 25 },
                            { name: 'Rivian R1T', value: 20 },
                            { name: 'Others', value: 20 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell key="cell-0" fill="hsl(var(--heroui-primary))" />
                          <Cell key="cell-1" fill="hsl(var(--heroui-secondary))" />
                          <Cell key="cell-2" fill="hsl(var(--heroui-success))" />
                          <Cell key="cell-3" fill="hsl(var(--heroui-warning))" />
                        </Pie>
                        <Legend />
                        <Tooltip 
                          formatter={(value) => [`${value}%`, 'Fleet']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
              
              <Card>
                <CardHeader>
                  <h2 className="text-lg font-semibold">Fleet Status</h2>
                </CardHeader>
                <CardBody>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        {status: 'Online', value: 187},
                        {status: 'Offline', value: 32},
                        {status: 'Maintenance', value: 18},
                        {status: 'Charging', value: 11},
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                        <XAxis 
                          dataKey="status" 
                          axisLine={false}
                          tickLine={false}
                        />
                        <YAxis 
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip 
                          formatter={(value) => [`${value}`, 'Vehicles']}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--heroui-content1))',
                            borderColor: 'hsl(var(--heroui-divider))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          <Cell fill="hsl(var(--heroui-success))" />
                          <Cell fill="hsl(var(--heroui-danger))" />
                          <Cell fill="hsl(var(--heroui-warning))" />
                          <Cell fill="hsl(var(--heroui-primary))" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>
      </main>
    </div>
  );
};