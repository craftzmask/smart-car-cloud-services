import React from "react";
import { Card, CardBody, CardHeader, Button, Progress, Chip, Badge, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Car, Alert } from "../data/mock-data";
import { CarMap } from "./car-map";
import { SubscriptionPlan } from "./subscription-plan";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

interface DashboardOverviewProps {
  cars: Car[];
  alerts: Alert[];
  onSelectCar: (id: string) => void;
  onNavigateToSubscription: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ cars, alerts, onSelectCar, onNavigateToSubscription }) => {
  // Add state for alert car filter
  const [alertCarFilter, setAlertCarFilter] = React.useState<string>("all");
  
  // Add state for alert detail modal
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);
  const [isAlertDetailOpen, setIsAlertDetailOpen] = React.useState(false);
  
  // Function to handle opening alert detail modal
  const handleViewAlertDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertDetailOpen(true);
  };
  
  // Find car by ID for the selected alert
  const getCarForAlert = (carId: string) => {
    return cars.find(car => car.id === carId) || null;
  };

  // Get recent alerts with car filtering
  const filteredRecentAlerts = React.useMemo(() => {
    let filtered = [...alerts];
    
    // Filter by car if not "all"
    if (alertCarFilter !== "all") {
      filtered = filtered.filter(alert => alert.carId === alertCarFilter);
    }
    
    // Sort by timestamp and take the 5 most recent
    return filtered
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [alerts, alertCarFilter]);

  // Calculate fleet statistics
  const totalCars = cars.length;
  const onlineCars = cars.filter(car => car.status === "online").length;
  const offlineCars = cars.filter(car => car.status === "offline").length;
  const maintenanceCars = cars.filter(car => car.status === "maintenance").length;
  
  // Calculate average battery level
  const avgBattery = Math.round(
    cars.reduce((sum, car) => sum + car.battery, 0) / totalCars
  );

  // Data for status pie chart
  const statusData = [
    { name: "Online", value: onlineCars, color: "#17c964" },
    { name: "Offline", value: offlineCars, color: "#f31260" },
    { name: "Maintenance", value: maintenanceCars, color: "#f5a524" }
  ];

  // Format alert time
  const formatAlertTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.round(diffMs / 60000);
    const diffHours = Math.round(diffMs / 3600000);
    const diffDays = Math.round(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Alert severity color
  const severityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "primary";
      default: return "default";
    }
  };

  // Alert type icon
  const alertTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "security": return "lucide:shield-alert";
      case "battery": return "lucide:battery-low";
      case "location": return "lucide:map-pin";
      case "maintenance": return "lucide:wrench";
      case "system": return "lucide:cpu";
      default: return "lucide:bell";
    }
  };

  // Sample data for usage trends
  const usageData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 59 },
    { month: "Mar", value: 80 },
    { month: "Apr", value: 81 },
    { month: "May", value: 56 },
    { month: "Jun", value: 55 },
    { month: "Jul", value: 40 }
  ];

  return (
    <div className="space-y-6">
      {/* Fleet Overview - Changed to horizontal layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Total Vehicles</p>
                <h3 className="text-2xl font-semibold">{totalCars}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon icon="lucide:car" className="text-primary text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Online Vehicles</p>
                <h3 className="text-2xl font-semibold">{onlineCars}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <Icon icon="lucide:wifi" className="text-success text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Avg. Battery</p>
                <h3 className="text-2xl font-semibold">{avgBattery}%</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Icon icon="lucide:battery" className="text-warning text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Active Alerts</p>
                <h3 className="text-2xl font-semibold">{alerts.filter(a => !a.read).length}</h3>
              </div>
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                <Icon icon="lucide:bell" className="text-danger text-xl" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
      
      {/* Fleet Status and Subscription - Changed to vertical layout */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Fleet Status</h2>
            <Button
              variant="flat"
              color="primary"
              size="sm"
              endContent={<Icon icon="lucide:arrow-right" />}
            >
              View Details
            </Button>
          </CardHeader>
          <CardBody>
            {/* Charts - Changed to vertical layout */}
            <div className="grid grid-cols-1 gap-6">
              {/* Status Distribution */}
              <div>
                <h3 className="text-sm font-medium mb-2">Status Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip 
                        formatter={(value) => [`${value} vehicles`, 'Count']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--heroui-content1))',
                          borderColor: 'hsl(var(--heroui-divider))',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Usage Trends */}
              <div>
                <h3 className="text-sm font-medium mb-2">Usage Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageData}>
                      <defs>
                        <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
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
                        stroke="hsl(var(--heroui-primary))" 
                        strokeWidth={2}
                        fill="url(#usageGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            {/* Vehicle List */}
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">Vehicle Overview</h3>
              <div className="space-y-3">
                {cars.map((car) => (
                  <div 
                    key={car.id} 
                    className="p-3 bg-content2/50 rounded-medium flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon icon="lucide:car" className="text-primary text-xl" />
                      </div>
                      <div>
                        <h4 className="font-medium">{car.model}</h4>
                        <div className="flex items-center gap-2 text-xs text-foreground-500">
                          <Badge 
                            color={car.status === "online" ? "success" : "warning"}
                            variant="flat"
                            size="sm"
                          >
                            {car.status}
                          </Badge>
                          <span>•</span>
                          <span>Battery: {car.battery}%</span>
                          <span>•</span>
                          <span>Range: {car.range} mi</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="flat"
                      color="primary"
                      size="sm"
                      onPress={() => onSelectCar(car.id)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Subscription Plan */}
        <div>
          <SubscriptionPlan 
            car={cars[0]} 
            onManage={onNavigateToSubscription}
          />
        </div>
      </div>
      
      {/* Map and Alerts - Changed to vertical layout */}
      <div className="grid grid-cols-1 gap-6">
        <div>
          <CarMap car={cars[0]} allCars={cars} defaultView="all" showControls={false} />
        </div>
        
        <div>
          <Card>
            <CardHeader className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Recent Alerts</h2>
                {alerts.some(alert => !alert.read) && (
                  <Badge color="danger" content={alerts.filter(alert => !alert.read).length} />
                )}
              </div>
              <div className="flex gap-2">
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      variant="flat"
                      size="sm"
                      endContent={<Icon icon="lucide:chevron-down" />}
                    >
                      {alertCarFilter === "all" 
                        ? "All Cars" 
                        : cars.find(c => c.id === alertCarFilter)?.model || "All Cars"}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    aria-label="Car filter options"
                    onAction={(key) => setAlertCarFilter(key as string)}
                    selectedKeys={[alertCarFilter]}
                    selectionMode="single"
                  >
                    <DropdownItem key="all">All Cars</DropdownItem>
                    {cars.map(car => (
                      <DropdownItem key={car.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full overflow-hidden">
                            <Icon icon="lucide:car" className="text-primary text-xl" />
                          </div>
                          <span>{car.model}</span>
                        </div>
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </div>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {filteredRecentAlerts.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                      <Icon icon="lucide:check" className="text-success text-xl" />
                    </div>
                    <h3 className="font-medium">All Clear!</h3>
                    <p className="text-sm text-foreground-500">No alerts to display</p>
                  </div>
                ) : (
                  filteredRecentAlerts.map((alert) => (
                    <div 
                      key={alert.id} 
                      className={`p-3 rounded-medium border-l-4 border-${severityColor(alert.severity)} bg-content2/50 flex items-center justify-between cursor-pointer hover:bg-content2/80 transition-colors`}
                      onClick={() => handleViewAlertDetail(alert)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full bg-${severityColor(alert.severity)}/10 flex items-center justify-center`}>
                          <Icon 
                            icon={alertTypeIcon(alert.type)} 
                            className={`text-${severityColor(alert.severity)}`} 
                          />
                        </div>
                        <div>
                          <div className="font-medium flex items-center gap-2">
                            {alert.message}
                            {!alert.read && (
                              <Badge color="danger" size="sm" variant="flat">New</Badge>
                            )}
                          </div>
                          <div className="text-xs text-foreground-500 flex items-center gap-2">
                            <span>{alert.type}</span>
                            <span>•</span>
                            <span>{formatAlertTime(alert.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label="View alert details"
                        onPress={(e) => {
                          e.stopPropagation();
                          handleViewAlertDetail(alert);
                        }}
                      >
                        <Icon icon="lucide:chevron-right" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Alert Detail Modal */}
      <Modal isOpen={isAlertDetailOpen} onOpenChange={setIsAlertDetailOpen} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              {selectedAlert && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${severityColor(selectedAlert.severity)}/10 flex items-center justify-center`}>
                        <Icon 
                          icon={alertTypeIcon(selectedAlert.type)} 
                          className={`text-${severityColor(selectedAlert.severity)}`} 
                        />
                      </div>
                      <span>{selectedAlert.message}</span>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-4">
                      {/* Car Information */}
                      {getCarForAlert(selectedAlert.carId) && (
                        <div className="p-3 bg-content2/50 rounded-medium">
                          <div className="flex items-center gap-3">
                            {/* Replace image with car icon */}
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Icon icon="lucide:car" className="text-primary text-xl" />
                            </div>
                            <div>
                              <p className="font-medium">{getCarForAlert(selectedAlert.carId)?.model}</p>
                              <div className="flex items-center gap-2 text-xs text-foreground-500">
                                <Badge 
                                  color={getCarForAlert(selectedAlert.carId)?.status === "online" ? "success" : "warning"}
                                  variant="flat"
                                  size="sm"
                                >
                                  {getCarForAlert(selectedAlert.carId)?.status}
                                </Badge>
                                <span>•</span>
                                <span>Battery: {getCarForAlert(selectedAlert.carId)?.battery}%</span>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="flat"
                              color="primary"
                              className="ml-auto"
                              onPress={() => {
                                onClose();
                                onSelectCar(selectedAlert.carId);
                              }}
                            >
                              View Car
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Alert Type</span>
                          <Chip 
                            color="default" 
                            variant="flat"
                            size="sm"
                          >
                            {selectedAlert.type}
                          </Chip>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Severity</span>
                          <Chip 
                            color={severityColor(selectedAlert.severity)} 
                            variant="flat"
                            size="sm"
                          >
                            {selectedAlert.severity}
                          </Chip>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Time</span>
                          <span className="text-sm">
                            {new Date(selectedAlert.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Status</span>
                          <Chip 
                            color={selectedAlert.read ? "success" : "danger"} 
                            variant="flat"
                            size="sm"
                          >
                            {selectedAlert.read ? "Read" : "Unread"}
                          </Chip>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Details</h4>
                        <p className="text-sm p-3 bg-content2/50 rounded-medium">
                          {selectedAlert.details}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recommended Action</h4>
                        <p className="text-sm p-3 bg-content2/50 rounded-medium">
                          {selectedAlert.severity === "high" 
                            ? "Immediate attention required. Please check your vehicle as soon as possible."
                            : selectedAlert.severity === "medium"
                              ? "Monitor the situation and take action if the condition persists."
                              : "No immediate action required. This is for informational purposes."
                          }
                        </p>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button 
                      variant="flat" 
                      color="danger"
                      startContent={<Icon icon="lucide:bell-off" />}
                    >
                      Mute Similar Alerts
                    </Button>
                    <Button 
                      color="primary"
                      onPress={onClose}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};