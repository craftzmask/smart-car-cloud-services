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
  Input
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Alert, Car } from "../data/mock-data";

interface NotificationsPageProps {
  alerts: Alert[];
  cars: Car[];
  onViewAlertDetail: (alert: Alert) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ 
  alerts, 
  cars,
  onViewAlertDetail,
  onMarkAllAsRead
}) => {
  const [filter, setFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedTab, setSelectedTab] = React.useState("all");
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>(["security", "battery", "location", "maintenance", "system"]);
  
  // Get car by ID
  const getCarById = (carId: string) => {
    return cars.find(car => car.id === carId);
  };
  
  // Filter alerts based on selected filter, tab, search query and selected types
  const filteredAlerts = React.useMemo(() => {
    let filtered = [...alerts];
    
    // Filter by severity
    if (filter !== "all") {
      filtered = filtered.filter(alert => alert.severity === filter);
    }
    
    // Filter by tab (read status)
    if (selectedTab === "unread") {
      filtered = filtered.filter(alert => !alert.read);
    } else if (selectedTab === "read") {
      filtered = filtered.filter(alert => alert.read);
    }
    
    // Filter by alert type
    filtered = filtered.filter(alert => selectedTypes.includes(alert.type.toLowerCase()));
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(alert => 
        alert.message.toLowerCase().includes(query) || 
        alert.details.toLowerCase().includes(query) ||
        alert.type.toLowerCase().includes(query) ||
        getCarById(alert.carId)?.model.toLowerCase().includes(query)
      );
    }
    
    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, filter, selectedTab, searchQuery, selectedTypes, cars]);

  const alertTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "security":
        return "lucide:shield-alert";
      case "battery":
        return "lucide:battery-low";
      case "location":
        return "lucide:map-pin";
      case "maintenance":
        return "lucide:wrench";
      case "system":
        return "lucide:cpu";
      default:
        return "lucide:bell";
    }
  };

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

  // Count unread notifications
  const unreadCount = alerts.filter(alert => !alert.read).length;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Notifications</h1>
          <p className="text-foreground-500">
            View and manage all your vehicle alerts and notifications
          </p>
        </div>
        
        <div className="flex gap-2 self-end">
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:check-circle" />}
            onPress={onMarkAllAsRead}
          >
            Mark All as Read
          </Button>
          <Button
            variant="flat"
            color="danger"
            startContent={<Icon icon="lucide:trash-2" />}
          >
            Clear All
          </Button>
        </div>
      </div>
      
      {/* Changed from horizontal grid to vertical stack */}
      <div className="space-y-6">
        {/* Filters section - now horizontal */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Filters</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:flex-1">
                <h3 className="text-sm font-medium mb-2">Status</h3>
                <Tabs 
                  aria-label="Notification status" 
                  selectedKey={selectedTab} 
                  onSelectionChange={setSelectedTab as any}
                  className="w-full"
                  variant="light"
                >
                  <Tab 
                    key="all" 
                    title={
                      <div className="flex items-center gap-2">
                        <span>All</span>
                        <Badge content={alerts.length} size="sm" />
                      </div>
                    }
                  />
                  <Tab 
                    key="unread" 
                    title={
                      <div className="flex items-center gap-2">
                        <span>Unread</span>
                        <Badge content={unreadCount} size="sm" color="danger" />
                      </div>
                    }
                  />
                  <Tab 
                    key="read" 
                    title={
                      <div className="flex items-center gap-2">
                        <span>Read</span>
                        <Badge content={alerts.length - unreadCount} size="sm" color="default" />
                      </div>
                    }
                  />
                </Tabs>
              </div>
              
              <div className="lg:flex-1">
                <h3 className="text-sm font-medium mb-2">Priority</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={filter === "all" ? "flat" : "light"}
                    color={filter === "all" ? "default" : "default"}
                    onPress={() => setFilter("all")}
                  >
                    All Priorities
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === "high" ? "flat" : "light"}
                    color={filter === "high" ? "danger" : "default"}
                    startContent={<div className="w-2 h-2 rounded-full bg-danger"></div>}
                    onPress={() => setFilter("high")}
                  >
                    High Priority
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === "medium" ? "flat" : "light"}
                    color={filter === "medium" ? "warning" : "default"}
                    startContent={<div className="w-2 h-2 rounded-full bg-warning"></div>}
                    onPress={() => setFilter("medium")}
                  >
                    Medium Priority
                  </Button>
                  <Button
                    size="sm"
                    variant={filter === "low" ? "flat" : "light"}
                    color={filter === "low" ? "primary" : "default"}
                    startContent={<div className="w-2 h-2 rounded-full bg-primary"></div>}
                    onPress={() => setFilter("low")}
                  >
                    Low Priority
                  </Button>
                </div>
              </div>
              
              <div className="lg:flex-1">
                <h3 className="text-sm font-medium mb-2">Alert Types</h3>
                <div className="flex flex-wrap gap-2">
                  <Checkbox 
                    isSelected={selectedTypes.includes("security")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedTypes(prev => [...prev, "security"]);
                      } else {
                        setSelectedTypes(prev => prev.filter(type => type !== "security"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:shield-alert" className="text-danger" />
                      <span>Security</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedTypes.includes("battery")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedTypes(prev => [...prev, "battery"]);
                      } else {
                        setSelectedTypes(prev => prev.filter(type => type !== "battery"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:battery-low" className="text-warning" />
                      <span>Battery</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedTypes.includes("location")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedTypes(prev => [...prev, "location"]);
                      } else {
                        setSelectedTypes(prev => prev.filter(type => type !== "location"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:map-pin" className="text-primary" />
                      <span>Location</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedTypes.includes("maintenance")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedTypes(prev => [...prev, "maintenance"]);
                      } else {
                        setSelectedTypes(prev => prev.filter(type => type !== "maintenance"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:wrench" className="text-secondary" />
                      <span>Maintenance</span>
                    </div>
                  </Checkbox>
                  
                  <Checkbox 
                    isSelected={selectedTypes.includes("system")}
                    onValueChange={(isSelected) => {
                      if (isSelected) {
                        setSelectedTypes(prev => [...prev, "system"]);
                      } else {
                        setSelectedTypes(prev => prev.filter(type => type !== "system"));
                      }
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:cpu" className="text-default-500" />
                      <span>System</span>
                    </div>
                  </Checkbox>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Notifications list - now full width */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">
              {selectedTab === "unread" ? "Unread Notifications" : 
               selectedTab === "read" ? "Read Notifications" : "All Notifications"}
            </h2>
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              startContent={<Icon icon="lucide:search" />}
              className="w-full max-w-xs"
            />
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                    <Icon icon="lucide:check" className="text-success text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium">No notifications found</h3>
                  <p className="text-foreground-500 mt-2">
                    {searchQuery 
                      ? "Try adjusting your search or filters" 
                      : selectedTab === "unread" 
                        ? "You're all caught up!" 
                        : "No notifications match your current filters"}
                  </p>
                </div>
              ) : (
                filteredAlerts.map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-medium border-l-4 border-${severityColor(alert.severity)} bg-content2/50 flex items-center justify-between cursor-pointer hover:bg-content2/80 transition-colors`}
                    onClick={() => onViewAlertDetail(alert)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-${severityColor(alert.severity)}/10 flex items-center justify-center`}>
                        <Icon 
                          icon={alertTypeIcon(alert.type)} 
                          className={`text-${severityColor(alert.severity)} text-xl`} 
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{alert.message}</h3>
                          {!alert.read && (
                            <Badge color="danger" size="sm" variant="flat">New</Badge>
                          )}
                        </div>
                        <div className="text-sm text-foreground-500 mt-1">{alert.details}</div>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-foreground-500">
                            <Icon icon="lucide:car" className="text-xs" />
                            <span>{getCarById(alert.carId)?.model}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-foreground-500">
                            <Icon icon="lucide:tag" className="text-xs" />
                            <span>{alert.type}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-foreground-500">
                            <Icon icon="lucide:clock" className="text-xs" />
                            <span>{formatAlertTime(alert.timestamp)}</span>
                          </div>
                          <Chip 
                            color={severityColor(alert.severity)} 
                            variant="flat"
                            size="sm"
                          >
                            {alert.severity}
                          </Chip>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label={alert.read ? "Mark as unread" : "Mark as read"}
                      >
                        <Icon icon={alert.read ? "lucide:eye-off" : "lucide:check"} />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label="Delete notification"
                        className="text-danger"
                      >
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};