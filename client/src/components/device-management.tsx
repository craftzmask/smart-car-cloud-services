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
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  Progress
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { Car, mockDevices } from "../data/mock-data";

interface DeviceManagementProps {
  car: Car;
}

export const DeviceManagement: React.FC<DeviceManagementProps> = ({ car }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  
  // Add state for add device modal
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = React.useState(false);
  
  // Add state for view device detail modal
  const [isViewDeviceModalOpen, setIsViewDeviceModalOpen] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState<any>(null);
  
  // Add state for devices list so we can update it
  const [devices, setDevices] = React.useState(mockDevices.filter(device => device.carId === car.id));
  
  // Add state for new device form
  const [newDevice, setNewDevice] = React.useState({
    name: "",
    type: "camera",
    location: "",
    status: "offline"
  });
  
  // Update filtered devices to use our local state
  const filteredDevices = devices
    .filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setNewDevice(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle opening device detail modal
  const handleViewDevice = (device: any) => {
    setSelectedDevice(device);
    setIsViewDeviceModalOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold">Device Management</h2>
          <p className="text-sm text-foreground-500">
            Manage connected devices for {car.model}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search devices..."
            startContent={<Icon icon="lucide:search" />}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="w-full sm:w-64"
          />
        </div>
      </CardHeader>
      <CardBody>
        <Table 
          aria-label="Device management table"
          removeWrapper
        >
          <TableHeader>
            <TableColumn>DEVICE</TableColumn>
            <TableColumn>TYPE</TableColumn>
            <TableColumn>LOCATION</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>LAST ACTIVE</TableColumn>
            <TableColumn>DETAILS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No devices found for this car">
            {filteredDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon icon={deviceTypeIcon(device.type)} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{device.name}</div>
                      <div className="text-xs text-foreground-500">ID: {device.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </TableCell>
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
                  <Button
                    variant="light"
                    size="sm"
                    color="primary"
                    endContent={<Icon icon="lucide:chevron-right" />}
                    onPress={() => handleViewDevice(device)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>

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
                  <Icon icon="lucide:plus-circle" className="text-primary" />
                  <span>Add New Device to {car.model}</span>
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
                  color="primary" 
                  onPress={handleAddDevice}
                  isDisabled={!newDevice.name || !newDevice.location}
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
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon icon={deviceTypeIcon(selectedDevice.type)} className="text-primary" />
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
                              <p className="text-sm text-foreground-500">Car Model</p>
                              <p className="font-medium">{car.model}</p>
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
                      color="primary"
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
    </Card>
  );
};