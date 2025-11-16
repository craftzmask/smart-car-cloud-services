import React from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  Button, 
  Table, 
  TableHeader, 
  TableColumn, 
  TableBody, 
  TableRow, 
  TableCell,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { mockDevices, mockCars } from "../data/mock-data";

interface IoTStaffDashboardProps {
  onLogout: () => void;
}

export const IoTStaffDashboard: React.FC<IoTStaffDashboardProps> = ({ onLogout }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Add state for modals
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = React.useState(false);
  const [isViewDeviceModalOpen, setIsViewDeviceModalOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<any>(null);
  
  // Add state for devices list so we can update it
  const [devices, setDevices] = React.useState(mockDevices);
  
  // Add state for form inputs
  const [newDevice, setNewDevice] = React.useState({
    name: "",
    type: "camera",
    carId: "",
    location: "",
    status: "offline"
  });
  
  // Use our local devices state instead of mockDevices
  const allDevices = devices;
  
  // System health metrics
  const systemMetrics = [
    { name: "Device Uptime", value: 98.7, target: 99.9, unit: "%", status: "warning" },
    { name: "Signal Strength", value: 87.2, target: 85, unit: "%", status: "success" },
    { name: "Data Transfer", value: 2.4, target: 5, unit: "TB", status: "success" },
    { name: "Error Rate", value: 0.5, target: 1, unit: "%", status: "success" }
  ];

  const deviceTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "camera":
        return "lucide:video";
      case "audio":
        return "lucide:mic";
      case "sensor":
        return "lucide:activity";
      case "gps":
        return "lucide:map-pin";
      default:
        return "lucide:cpu";
    }
  };

  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "online":
        return "success";
      case "offline":
        return "danger";
      case "standby":
        return "warning";
      default:
        return "default";
    }
  };

  // Handle opening device detail modal
  const handleViewDevice = (device: any) => {
    setSelectedDevice(device);
    setIsViewDeviceModalOpen(true);
  };
  
  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewDevice(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle add device form submission
  const handleAddDevice = () => {
    // Validate required fields
    if (!newDevice.name || !newDevice.carId || !newDevice.location) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Generate a unique ID for the new device
    const newDeviceId = `dev-${Date.now().toString(36)}`;
    
    // Create the new device object
    const deviceToAdd = {
      id: newDeviceId,
      carId: newDevice.carId,
      name: newDevice.name,
      type: newDevice.type,
      status: newDevice.status,
      location: newDevice.location,
      lastActive: new Date().toISOString()
    };
    
    // Add the new device to our local state
    setDevices(prevDevices => [...prevDevices, deviceToAdd]);
    
    // Show success message
    alert(`Device "${newDevice.name}" added successfully!`);
    
    // In a real app, this would send data to backend
    console.log("Adding new device:", deviceToAdd);
    
    // Close modal and reset form
    setIsAddDeviceModalOpen(false);
    setNewDevice({
      name: "",
      type: "camera",
      carId: "",
      location: "",
      status: "offline"
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-content1 border-b border-divider p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
              <Icon icon="lucide:cpu" className="text-secondary text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">IoT Staff Dashboard</h1>
              <p className="text-xs text-foreground-500">Device management and monitoring</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge content="5" color="danger">
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
                      src="https://img.heroui.chat/image/avatar?w=200&h=200&u=2"
                      name="IoT Admin"
                      size="sm"
                    />
                  }
                >
                  IoT Admin
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
        {/* System Health */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">System Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric) => (
              <Card key={metric.name} className="shadow-sm">
                <CardBody className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-medium">{metric.name}</h3>
                    <Chip 
                      color={metric.status as "success" | "warning" | "danger"} 
                      variant="flat"
                      size="sm"
                    >
                      {metric.status === "success" ? "Good" : "Attention"}
                    </Chip>
                  </div>
                  <div className="text-2xl font-semibold mb-2">
                    {metric.value}{metric.unit}
                    <span className="text-xs text-foreground-500 ml-1">/ {metric.target}{metric.unit}</span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.target) * 100} 
                    color={metric.status as "success" | "warning" | "danger"}
                    className="h-1"
                    showValueLabel={false}
                  />
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Device Management */}
        <Card className="mb-6">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Device Management</h2>
            <div className="flex gap-2">
              <Button
                color="secondary"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => setIsAddDeviceModalOpen(true)}
              >
                Add Device
              </Button>
              <Button
                variant="flat"
                startContent={<Icon icon="lucide:download" />}
              >
                Export
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <Table 
              aria-label="Device management table"
              removeWrapper
            >
              <TableHeader>
                <TableColumn>DEVICE</TableColumn>
                <TableColumn>CAR</TableColumn>
                <TableColumn>TYPE</TableColumn>
                <TableColumn>LOCATION</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>LAST ACTIVE</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {allDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <Icon icon={deviceTypeIcon(device.type)} className="text-secondary" />
                        </div>
                        <div>
                          <div className="font-medium">{device.name}</div>
                          <div className="text-xs text-foreground-500">ID: {device.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{device.carId}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>{device.location}</TableCell>
                    <TableCell>
                      <Chip 
                        color={statusColor(device.status)} 
                        variant="flat"
                        size="sm"
                      >
                        {device.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{new Date(device.lastActive).toLocaleDateString()}</span>
                        <span className="text-xs text-foreground-500">
                          {new Date(device.lastActive).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          aria-label="Configure device"
                        >
                          <Icon icon="lucide:settings" />
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          aria-label="Restart device"
                        >
                          <Icon icon="lucide:refresh-cw" />
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
                          <DropdownMenu aria-label="Device actions">
                            <DropdownItem 
                              startContent={<Icon icon="lucide:eye" />}
                              onPress={() => handleViewDevice(device)}
                            >
                              View Details
                            </DropdownItem>
                            <DropdownItem startContent={<Icon icon="lucide:edit" />}>
                              Edit Device
                            </DropdownItem>
                            <DropdownItem startContent={<Icon icon="lucide:history" />}>
                              View Logs
                            </DropdownItem>
                            <DropdownItem 
                              startContent={<Icon icon="lucide:trash-2" />}
                              className="text-danger"
                            >
                              Remove Device
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
        
        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: "lucide:refresh-cw", label: "Restart All Devices", color: "bg-primary/10 text-primary" },
              { icon: "lucide:download", label: "Update Firmware", color: "bg-secondary/10 text-secondary" },
              { icon: "lucide:shield", label: "Security Scan", color: "bg-success/10 text-success" },
              { icon: "lucide:activity", label: "System Diagnostics", color: "bg-warning/10 text-warning" }
            ].map((action) => (
              <Button
                key={action.label}
                className="h-24 flex-col"
                variant="flat"
              >
                <div className={`w-10 h-10 rounded-full ${action.color} flex items-center justify-center mb-2`}>
                  <Icon icon={action.icon} />
                </div>
                <span>{action.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </main>
      
      {/* Add Device Modal */}
      <Modal 
        isOpen={isAddDeviceModalOpen} 
        onOpenChange={setIsAddDeviceModalOpen}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:plus-circle" className="text-secondary" />
                  <span>Add New Device</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <Input
                    label="Device Name"
                    placeholder="Enter device name"
                    value={newDevice.name}
                    onValueChange={(value) => handleInputChange("name", value)}
                  />
                  
                  <Select
                    label="Device Type"
                    placeholder="Select device type"
                    selectedKeys={[newDevice.type]}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  >
                    <SelectItem key="camera" value="camera" startContent={<Icon icon="lucide:video" />}>
                      Camera
                    </SelectItem>
                    <SelectItem key="audio" value="audio" startContent={<Icon icon="lucide:mic" />}>
                      Audio
                    </SelectItem>
                    <SelectItem key="sensor" value="sensor" startContent={<Icon icon="lucide:activity" />}>
                      Sensor
                    </SelectItem>
                    <SelectItem key="gps" value="gps" startContent={<Icon icon="lucide:map-pin" />}>
                      GPS
                    </SelectItem>
                  </Select>
                  
                  <Select
                    label="Assign to Car"
                    placeholder="Select car"
                    selectedKeys={newDevice.carId ? [newDevice.carId] : []}
                    onChange={(e) => handleInputChange("carId", e.target.value)}
                  >
                    {mockCars.map(car => (
                      <SelectItem key={car.id} value={car.id}>
                        {car.model}
                      </SelectItem>
                    ))}
                  </Select>
                  
                  <Input
                    label="Location"
                    placeholder="Device location (e.g., Front Bumper)"
                    value={newDevice.location}
                    onValueChange={(value) => handleInputChange("location", value)}
                  />
                  
                  <Select
                    label="Initial Status"
                    placeholder="Select status"
                    selectedKeys={[newDevice.status]}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <SelectItem key="online" value="online" startContent={<Icon icon="lucide:check-circle" className="text-success" />}>
                      Online
                    </SelectItem>
                    <SelectItem key="offline" value="offline" startContent={<Icon icon="lucide:x-circle" className="text-danger" />}>
                      Offline
                    </SelectItem>
                    <SelectItem key="standby" value="standby" startContent={<Icon icon="lucide:pause-circle" className="text-warning" />}>
                      Standby
                    </SelectItem>
                  </Select>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancel
                </Button>
                <Button 
                  color="secondary" 
                  onPress={handleAddDevice}
                  isDisabled={!newDevice.name || !newDevice.carId || !newDevice.location}
                >
                  Add Device
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
      {/* View Device Detail Modal */}
      <Modal 
        isOpen={isViewDeviceModalOpen} 
        onOpenChange={setIsViewDeviceModalOpen}
        size="md"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {selectedDevice && (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                        <Icon icon={deviceTypeIcon(selectedDevice.type)} className="text-secondary" />
                      </div>
                      <span>{selectedDevice.name}</span>
                    </div>
                  </ModalHeader>
                  <ModalBody>
                    <div className="space-y-4">
                      <Card className="shadow-none border border-divider">
                        <CardBody className="p-4">
                          <div className="grid grid-cols-2 gap-y-3">
                            <div>
                              <p className="text-sm text-foreground-500">Device ID</p>
                              <p className="font-medium">{selectedDevice.id}</p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-500">Type</p>
                              <p className="font-medium">{selectedDevice.type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-500">Car ID</p>
                              <p className="font-medium">{selectedDevice.carId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-500">Location</p>
                              <p className="font-medium">{selectedDevice.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-500">Status</p>
                              <Chip 
                                color={statusColor(selectedDevice.status)} 
                                variant="flat"
                                size="sm"
                              >
                                {selectedDevice.status}
                              </Chip>
                            </div>
                            <div>
                              <p className="text-sm text-foreground-500">Last Active</p>
                              <p className="font-medium">{new Date(selectedDevice.lastActive).toLocaleString()}</p>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Device Health</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Battery Level</span>
                              <span>78%</span>
                            </div>
                            <Progress 
                              value={78} 
                              color="success"
                              className="h-1"
                              showValueLabel={false}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Signal Strength</span>
                              <span>92%</span>
                            </div>
                            <Progress 
                              value={92} 
                              color="success"
                              className="h-1"
                              showValueLabel={false}
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Storage</span>
                              <span>45%</span>
                            </div>
                            <Progress 
                              value={45} 
                              color="warning"
                              className="h-1"
                              showValueLabel={false}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          {[
                            { action: "Status Change", details: "Device went online", time: "2 hours ago" },
                            { action: "Firmware Update", details: "Updated to v2.3.4", time: "Yesterday" },
                            { action: "Maintenance", details: "Routine check completed", time: "3 days ago" }
                          ].map((activity, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-content2/50 rounded-medium">
                              <div>
                                <p className="text-sm font-medium">{activity.action}</p>
                                <p className="text-xs text-foreground-500">{activity.details}</p>
                              </div>
                              <p className="text-xs text-foreground-500">{activity.time}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button 
                      variant="flat" 
                      color="danger"
                      startContent={<Icon icon="lucide:power" />}
                    >
                      Restart Device
                    </Button>
                    <Button 
                      color="secondary"
                      startContent={<Icon icon="lucide:settings" />}
                    >
                      Configure
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