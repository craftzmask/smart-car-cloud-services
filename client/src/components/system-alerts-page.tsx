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
  Chip,
  Badge,
  Tabs,
  Tab,
  Checkbox,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface SystemAlert {
  id: number;
  severity: "high" | "medium" | "low";
  message: string;
  details?: string;
  time: string;
  timestamp: string;
  source: string;
  status: "new" | "acknowledged" | "resolved";
  category: string;
}

interface SystemAlertsPageProps {
  onBack: () => void;
}

export const SystemAlertsPage: React.FC<SystemAlertsPageProps> = ({ onBack }) => {
  // Sample data for system alerts
  const [alerts, setAlerts] = React.useState<SystemAlert[]>([
    { 
      id: 1, 
      severity: "high", 
      message: "Database server high load", 
      details: "CPU usage exceeded 90% for more than 5 minutes. This might affect system performance and response times. Consider scaling up resources or optimizing database queries.",
      time: "10 mins ago", 
      timestamp: "2024-06-15T10:30:00Z",
      source: "Database Server",
      status: "new",
      category: "performance"
    },
    { 
      id: 2, 
      severity: "medium", 
      message: "API rate limit reached", 
      details: "The external API rate limit has been reached. Some requests might be delayed or rejected. The system will automatically retry with exponential backoff.",
      time: "25 mins ago", 
      timestamp: "2024-06-15T10:15:00Z",
      source: "API Gateway",
      status: "acknowledged",
      category: "api"
    },
    { 
      id: 3, 
      severity: "low", 
      message: "Storage usage above 50%", 
      details: "Storage usage has exceeded 50% of the allocated capacity. Consider cleaning up unused data or increasing storage capacity before it reaches critical levels.",
      time: "1 hour ago", 
      timestamp: "2024-06-15T09:30:00Z",
      source: "Storage Service",
      status: "new",
      category: "storage"
    },
    { 
      id: 4, 
      severity: "low", 
      message: "Routine backup completed", 
      details: "The scheduled system backup has completed successfully. All data has been backed up to the secure storage location.",
      time: "3 hours ago", 
      timestamp: "2024-06-15T07:30:00Z",
      source: "Backup Service",
      status: "resolved",
      category: "maintenance"
    },
    { 
      id: 5, 
      severity: "high", 
      message: "Security vulnerability detected", 
      details: "A potential security vulnerability has been detected in one of the system components. Immediate attention is required to patch the affected component.",
      time: "4 hours ago", 
      timestamp: "2024-06-15T06:30:00Z",
      source: "Security Scanner",
      status: "acknowledged",
      category: "security"
    },
    { 
      id: 6, 
      severity: "medium", 
      message: "Network latency increased", 
      details: "Network latency between services has increased above normal thresholds. This might affect system response times and user experience.",
      time: "5 hours ago", 
      timestamp: "2024-06-15T05:30:00Z",
      source: "Network Monitor",
      status: "new",
      category: "network"
    },
    { 
      id: 7, 
      severity: "medium", 
      message: "Certificate expiring soon", 
      details: "SSL certificate for the main domain will expire in 15 days. Please renew the certificate to avoid service disruption.",
      time: "6 hours ago", 
      timestamp: "2024-06-15T04:30:00Z",
      source: "Certificate Manager",
      status: "acknowledged",
      category: "security"
    },
    { 
      id: 8, 
      severity: "high", 
      message: "Authentication service errors", 
      details: "Multiple failed attempts to connect to the authentication service. Users might experience login issues or be unable to access the system.",
      time: "8 hours ago", 
      timestamp: "2024-06-15T02:30:00Z",
      source: "Auth Service",
      status: "resolved",
      category: "auth"
    }
  ]);

  // Filter states
  const [severityFilter, setSeverityFilter] = React.useState<string>("all");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([
    "performance", "api", "storage", "maintenance", "security", "network", "auth"
  ]);
  
  // Alert detail modal state
  const [selectedAlert, setSelectedAlert] = React.useState<SystemAlert | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  
  // View type (table or card)
  const [viewType, setViewType] = React.useState<"table" | "card">("table");

  // Filter alerts based on selected filters
  const filteredAlerts = React.useMemo(() => {
    let filtered = [...alerts];
    
    // Filter by severity
    if (severityFilter !== "all") {
      filtered = filtered.filter(alert => alert.severity === severityFilter);
    }
    
    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(alert => alert.status === statusFilter);
    }
    
    // Filter by categories
    filtered = filtered.filter(alert => selectedCategories.includes(alert.category));
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.message.toLowerCase().includes(query) || 
        (alert.details && alert.details.toLowerCase().includes(query)) ||
        alert.source.toLowerCase().includes(query) ||
        alert.category.toLowerCase().includes(query)
      );
    }
    
    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, severityFilter, statusFilter, selectedCategories, searchQuery]);

  // Handle opening alert detail modal
  const handleViewAlertDetail = (alert: SystemAlert) => {
    setSelectedAlert(alert);
    setIsDetailModalOpen(true);
  };
  
  // Handle marking an alert as acknowledged
  const handleAcknowledge = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: "acknowledged" } : alert
    ));
  };
  
  // Handle marking an alert as resolved
  const handleResolve = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, status: "resolved" } : alert
    ));
  };
  
  // Handle deleting an alert
  const handleDelete = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };
  
  // Get color based on severity
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
  
  // Get color based on status
  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "danger";
      case "acknowledged":
        return "warning";
      case "resolved":
        return "success";
      default:
        return "default";
    }
  };
  
  // Get icon based on category
  const categoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "performance":
        return "lucide:activity";
      case "api":
        return "lucide:code";
      case "storage":
        return "lucide:database";
      case "maintenance":
        return "lucide:tool";
      case "security":
        return "lucide:shield";
      case "network":
        return "lucide:wifi";
      case "auth":
        return "lucide:lock";
      default:
        return "lucide:alert-circle";
    }
  };

  // Count alerts by status
  const newAlertsCount = alerts.filter(alert => alert.status === "new").length;
  const acknowledgedAlertsCount = alerts.filter(alert => alert.status === "acknowledged").length;
  const resolvedAlertsCount = alerts.filter(alert => alert.status === "resolved").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-content1 border-b border-divider p-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <Button
            variant="light"
            isIconOnly
            className="mr-4"
            onPress={onBack}
          >
            <Icon icon="lucide:arrow-left" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold">System Alerts</h1>
            <p className="text-xs text-foreground-500">View and manage all system alerts</p>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                  <Icon icon="lucide:alert-triangle" className="text-danger" />
                </div>
                <div>
                  <p className="text-sm text-foreground-500">New Alerts</p>
                  <h3 className="text-2xl font-semibold">{newAlertsCount}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                  <Icon icon="lucide:eye" className="text-warning" />
                </div>
                <div>
                  <p className="text-sm text-foreground-500">Acknowledged</p>
                  <h3 className="text-2xl font-semibold">{acknowledgedAlertsCount}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <Icon icon="lucide:check-circle" className="text-success" />
                </div>
                <div>
                  <p className="text-sm text-foreground-500">Resolved</p>
                  <h3 className="text-2xl font-semibold">{resolvedAlertsCount}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Filters</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:flex-1">
                <h3 className="text-sm font-medium mb-2">Severity</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={severityFilter === "all" ? "flat" : "light"}
                    color={severityFilter === "all" ? "default" : "default"}
                    onPress={() => setSeverityFilter("all")}
                  >
                    All Severities
                  </Button>
                  <Button
                    size="sm"
                    variant={severityFilter === "high" ? "flat" : "light"}
                    color={severityFilter === "high" ? "danger" : "default"}
                    startContent={<div className="w-2 h-2 rounded-full bg-danger"></div>}
                    onPress={() => setSeverityFilter("high")}
                  >
                    High
                  </Button>
                  <Button
                    size="sm"
                    variant={severityFilter === "medium" ? "flat" : "light"}
                    color={severityFilter === "medium" ? "warning" : "default"}
                    startContent={<div className="w-2 h-2 rounded-full bg-warning"></div>}
                    onPress={() => setSeverityFilter("medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    size="sm"
                    variant={severityFilter === "low" ? "flat" : "light"}
                    color={severityFilter === "low" ? "primary" : "default"}
                    startContent={<div className="w-2 h-2 rounded-full bg-primary"></div>}
                    onPress={() => setSeverityFilter("low")}
                  >
                    Low
                  </Button>
                </div>
              </div>
              
              <div className="lg:flex-1">
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={statusFilter === "all" ? "flat" : "light"}
                    color={statusFilter === "all" ? "default" : "default"}
                    onPress={() => setStatusFilter("all")}
                  >
                    All Statuses
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "new" ? "flat" : "light"}
                    color={statusFilter === "new" ? "danger" : "default"}
                    startContent={<Icon icon="lucide:alert-circle" className="text-danger text-sm" />}
                    onPress={() => setStatusFilter("new")}
                  >
                    New
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "acknowledged" ? "flat" : "light"}
                    color={statusFilter === "acknowledged" ? "warning" : "default"}
                    startContent={<Icon icon="lucide:eye" className="text-warning text-sm" />}
                    onPress={() => setStatusFilter("acknowledged")}
                  >
                    Acknowledged
                  </Button>
                  <Button
                    size="sm"
                    variant={statusFilter === "resolved" ? "flat" : "light"}
                    color={statusFilter === "resolved" ? "success" : "default"}
                    startContent={<Icon icon="lucide:check-circle" className="text-success text-sm" />}
                    onPress={() => setStatusFilter("resolved")}
                  >
                    Resolved
                  </Button>
                </div>
              </div>
              
              <div className="lg:flex-1">
                <h3 className="text-sm font-medium mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  <Checkbox 
                    isSelected={selectedCategories.includes("performance")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedCategories(prev => [...prev, "performance"]);
                      } else {
                        setSelectedCategories(prev => prev.filter(cat => cat !== "performance"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:activity" className="text-primary" />
                      <span>Performance</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedCategories.includes("security")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedCategories(prev => [...prev, "security"]);
                      } else {
                        setSelectedCategories(prev => prev.filter(cat => cat !== "security"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:shield" className="text-danger" />
                      <span>Security</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedCategories.includes("storage")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedCategories(prev => [...prev, "storage"]);
                      } else {
                        setSelectedCategories(prev => prev.filter(cat => cat !== "storage"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:database" className="text-warning" />
                      <span>Storage</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedCategories.includes("network")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedCategories(prev => [...prev, "network"]);
                      } else {
                        setSelectedCategories(prev => prev.filter(cat => cat !== "network"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:wifi" className="text-secondary" />
                      <span>Network</span>
                    </div>
                  </Checkbox>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Alerts List */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">System Alerts</h2>
            <div className="flex gap-2">
              <Input
                placeholder="Search alerts..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                startContent={<Icon icon="lucide:search" />}
                className="w-full max-w-xs"
              />
            </div>
          </CardHeader>
          <CardBody>
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                  <Icon icon="lucide:check" className="text-success text-2xl" />
                </div>
                <h3 className="text-lg font-medium">No alerts found</h3>
                <p className="text-foreground-500 mt-2">
                  {searchQuery 
                    ? "Try adjusting your search or filters" 
                    : "All systems are running smoothly"}
                </p>
              </div>
            ) : (
              <Table 
                aria-label="System alerts table"
                removeWrapper
              >
                <TableHeader>
                  <TableColumn>ALERT</TableColumn>
                  <TableColumn>SOURCE</TableColumn>
                  <TableColumn>SEVERITY</TableColumn>
                  <TableColumn>STATUS</TableColumn>
                  <TableColumn>TIME</TableColumn>
                  <TableColumn>ACTIONS</TableColumn>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full bg-${severityColor(alert.severity)}/10 flex items-center justify-center`}>
                            <Icon 
                              icon={categoryIcon(alert.category)} 
                              className={`text-${severityColor(alert.severity)}`} 
                            />
                          </div>
                          <div>
                            <div className="font-medium">{alert.message}</div>
                            <div className="text-xs text-foreground-500">
                              {alert.details && alert.details.substring(0, 60)}
                              {alert.details && alert.details.length > 60 ? "..." : ""}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{alert.source}</TableCell>
                      <TableCell>
                        <Chip 
                          color={severityColor(alert.severity)} 
                          variant="flat"
                          size="sm"
                        >
                          {alert.severity}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          color={statusColor(alert.status)} 
                          variant="flat"
                          size="sm"
                        >
                          {alert.status}
                        </Chip>
                      </TableCell>
                      <TableCell>{alert.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            aria-label="View alert details"
                            onPress={() => handleViewAlertDetail(alert)}
                          >
                            <Icon icon="lucide:eye" />
                          </Button>
                          {alert.status === "new" && (
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color="warning"
                              aria-label="Acknowledge alert"
                              onPress={() => handleAcknowledge(alert.id)}
                            >
                              <Icon icon="lucide:check" />
                            </Button>
                          )}
                          {(alert.status === "new" || alert.status === "acknowledged") && (
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              color="success"
                              aria-label="Resolve alert"
                              onPress={() => handleResolve(alert.id)}
                            >
                              <Icon icon="lucide:check-circle" />
                            </Button>
                          )}
                          <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            color="danger"
                            aria-label="Delete alert"
                            onPress={() => handleDelete(alert.id)}
                          >
                            <Icon icon="lucide:trash-2" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </main>
      
      {/* Alert Detail Modal */}
      <Modal isOpen={isDetailModalOpen} onOpenChange={setIsDetailModalOpen} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              {selectedAlert && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full bg-${severityColor(selectedAlert.severity)}/10 flex items-center justify-center`}>
                        <Icon 
                          icon={categoryIcon(selectedAlert.category)} 
                          className={`text-${severityColor(selectedAlert.severity)}`} 
                        />
                      </div>
                      <span>{selectedAlert.message}</span>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="p-3 bg-content2/50 rounded-medium">
                        <h4 className="text-sm font-medium mb-2">Alert Information</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-xs text-foreground-500">Source</p>
                            <p className="text-sm font-medium">{selectedAlert.source}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-500">Category</p>
                            <p className="text-sm font-medium capitalize">{selectedAlert.category}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-500">Severity</p>
                            <Chip 
                              color={severityColor(selectedAlert.severity)} 
                              variant="flat"
                              size="sm"
                            >
                              {selectedAlert.severity}
                            </Chip>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-500">Status</p>
                            <Chip 
                              color={statusColor(selectedAlert.status)} 
                              variant="flat"
                              size="sm"
                            >
                              {selectedAlert.status}
                            </Chip>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-500">Time</p>
                            <p className="text-sm">{selectedAlert.time}</p>
                          </div>
                          <div>
                            <p className="text-xs text-foreground-500">Date</p>
                            <p className="text-sm">{new Date(selectedAlert.timestamp).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Details</h4>
                        <p className="text-sm p-3 bg-content2/50 rounded-medium">
                          {selectedAlert.details || "No additional details available."}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-1">Recommended Action</h4>
                        <p className="text-sm p-3 bg-content2/50 rounded-medium">
                          {selectedAlert.severity === "high" 
                            ? "Immediate attention required. Investigate and resolve this issue as soon as possible to prevent service disruption."
                            : selectedAlert.severity === "medium"
                              ? "Monitor the situation and take action if the condition persists or worsens."
                              : "No immediate action required. This is for informational purposes."
                          }
                        </p>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    {selectedAlert.status === "new" && (
                      <Button 
                        variant="flat" 
                        color="warning"
                        startContent={<Icon icon="lucide:check" />}
                        onPress={() => {
                          handleAcknowledge(selectedAlert.id);
                          onClose();
                        }}
                      >
                        Acknowledge
                      </Button>
                    )}
                    {(selectedAlert.status === "new" || selectedAlert.status === "acknowledged") && (
                      <Button 
                        variant="flat" 
                        color="success"
                        startContent={<Icon icon="lucide:check-circle" />}
                        onPress={() => {
                          handleResolve(selectedAlert.id);
                          onClose();
                        }}
                      >
                        Resolve
                      </Button>
                    )}
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