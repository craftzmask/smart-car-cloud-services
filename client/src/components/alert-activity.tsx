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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Badge,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
  CheckboxGroup
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Alert } from "../data/mock-data";

interface AlertActivityProps {
  alerts: Alert[];
  showAll?: boolean;
  hideActionButtons?: boolean;
}

export const AlertActivity: React.FC<AlertActivityProps> = ({ alerts, showAll = false, hideActionButtons = false }) => {
  const [filter, setFilter] = React.useState<string>("all");
  const [isConfigOpen, setIsConfigOpen] = React.useState(false);
  const [alertPreferences, setAlertPreferences] = React.useState<string[]>([
    "emergency", "safety", "security", "passenger", "animal"
  ]);
  
  // Add state for alert detail modal
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  
  // Function to open alert detail modal
  const handleViewAlertDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsDetailModalOpen(true);
  };
  
  // Filter alerts based on selected filter and alert preferences
  const filteredAlerts = React.useMemo(() => {
    let filtered = alerts;
    
    // Filter by severity
    if (filter !== "all") {
      filtered = filtered.filter(alert => alert.severity === filter);
    }
    
    // Filter by alert type preferences
    filtered = filtered.filter(alert => alertPreferences.includes(alert.type.toLowerCase()));
    
    return filtered;
  }, [alerts, filter, alertPreferences]);

  const alertTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "emergency":
        return "lucide:alert-triangle";
      case "safety":
        return "lucide:shield";
      case "security":
        return "lucide:shield-alert";
      case "passenger":
        return "lucide:users";
      case "animal":
        return "lucide:paw";
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

  const handleSavePreferences = () => {
    // In a real app, this would save to backend/localStorage
    setIsConfigOpen(false);
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Alert Activity</h2>
          {!showAll && alerts.some(alert => !alert.read) && (
            <Badge color="danger" content={alerts.filter(alert => !alert.read).length} />
          )}
        </div>
        <div className="flex gap-2">
          {!hideActionButtons && (
            <>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    variant="flat"
                    size="sm"
                    endContent={<Icon icon="lucide:chevron-down" />}
                  >
                    {filter === "all" ? "All Alerts" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Alert filter options"
                  onAction={(key) => setFilter(key as string)}
                  selectedKeys={[filter]}
                  selectionMode="single"
                >
                  <DropdownItem key="all">All Alerts</DropdownItem>
                  <DropdownItem key="high">High Priority</DropdownItem>
                  <DropdownItem key="medium">Medium Priority</DropdownItem>
                  <DropdownItem key="low">Low Priority</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              
              <Button
                variant="flat"
                size="sm"
                startContent={<Icon icon="lucide:bell-ring" />}
                onPress={() => setIsConfigOpen(true)}
              >
                Configure
              </Button>
              
              {!showAll && (
                <Button
                  variant="flat"
                  size="sm"
                  endContent={<Icon icon="lucide:arrow-right" />}
                >
                  View All
                </Button>
              )}
            </>
          )}
          {hideActionButtons && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  variant="flat"
                  size="sm"
                  endContent={<Icon icon="lucide:chevron-down" />}
                >
                  {filter === "all" ? "All Alerts" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Priority`}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Alert filter options"
                onAction={(key) => setFilter(key as string)}
                selectedKeys={[filter]}
                selectionMode="single"
              >
                <DropdownItem key="all">All Alerts</DropdownItem>
                <DropdownItem key="high">High Priority</DropdownItem>
                <DropdownItem key="medium">Medium Priority</DropdownItem>
                <DropdownItem key="low">Low Priority</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </CardHeader>
      <CardBody>
        {showAll ? (
          <Table 
            aria-label="Alert activity table"
            removeWrapper
          >
            <TableHeader>
              <TableColumn>ALERT</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>SEVERITY</TableColumn>
              <TableColumn>TIME</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No alerts found">
              {filteredAlerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>
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
                        <div className="text-xs text-foreground-500">{alert.details}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <Chip 
                      color={severityColor(alert.severity)} 
                      variant="flat"
                      size="sm"
                    >
                      {alert.severity}
                    </Chip>
                  </TableCell>
                  <TableCell>{formatAlertTime(alert.timestamp)}</TableCell>
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
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label="Mark as read"
                      >
                        <Icon icon={alert.read ? "lucide:check-circle" : "lucide:circle"} />
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
                        <DropdownMenu aria-label="Alert actions">
                          <DropdownItem startContent={<Icon icon="lucide:bell-off" />}>
                            Mute Similar Alerts
                          </DropdownItem>
                          <DropdownItem startContent={<Icon icon="lucide:share" />}>
                            Share Alert
                          </DropdownItem>
                          <DropdownItem 
                            startContent={<Icon icon="lucide:trash-2" />}
                            className="text-danger"
                          >
                            Delete Alert
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                  <Icon icon="lucide:check" className="text-success text-xl" />
                </div>
                <h3 className="font-medium">All Clear!</h3>
                <p className="text-sm text-foreground-500">No alerts to display</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
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
        )}
      </CardBody>
      
      {/* Alert Configuration Modal */}
      <Modal isOpen={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Alert Preferences
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-foreground-500 mb-4">
              Select which types of alerts you want to receive for your vehicle.
            </p>
            
            <CheckboxGroup
              label="Alert Types"
              value={alertPreferences}
              onValueChange={setAlertPreferences as any}
            >
              <Checkbox value="emergency">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:alert-triangle" className="text-danger" />
                  <span>Emergency Alerts</span>
                </div>
              </Checkbox>
              <Checkbox value="safety">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:shield" className="text-warning" />
                  <span>Safety Alerts</span>
                </div>
              </Checkbox>
              <Checkbox value="security">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:shield-alert" className="text-primary" />
                  <span>Security Alerts</span>
                </div>
              </Checkbox>
              <Checkbox value="passenger">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:users" className="text-secondary" />
                  <span>Passenger Alerts</span>
                </div>
              </Checkbox>
              <Checkbox value="animal">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:dog" className="text-default-500" />
                  <span>Animal Detection</span>
                </div>
              </Checkbox>
            </CheckboxGroup>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Notification Methods</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:mail" />
                    <span>Email</span>
                  </div>
                  <Checkbox isSelected defaultSelected />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:message-square" />
                    <span>SMS</span>
                  </div>
                  <Checkbox isSelected />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleSavePreferences}>
              Save Preferences
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
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
                          icon={alertTypeIcon(selectedAlert.type)} 
                          className={`text-${severityColor(selectedAlert.severity)}`} 
                        />
                      </div>
                      <span>{selectedAlert.message}</span>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-4">
                      <div className="p-3 bg-content2/50 rounded-medium">
                        <h4 className="text-sm font-medium mb-2">
                          <Icon icon="lucide:car" className="text-primary" />
                        </h4>
                        
                        {/* Car Information - Updated to show only car icon */}
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon icon="lucide:car" className="text-primary text-xl" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span>{selectedAlert.type}</span>
                            <span>•</span>
                            <span>{formatAlertTime(selectedAlert.timestamp)}</span>
                          </div>
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
    </Card>
  );
};