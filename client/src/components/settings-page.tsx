import React from "react";
import { 
  Tabs, 
  Tab, 
  Card, 
  CardBody, 
  CardHeader, 
  Input, 
  Button, 
  Switch, 
  Divider,
  Avatar,
  Select,
  SelectItem
} from "@heroui/react";
import { Icon } from "@iconify/react";

interface SettingsPageProps {
  onLogout: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [selectedTab, setSelectedTab] = React.useState("account");
  const [name, setName] = React.useState("John Doe");
  const [email, setEmail] = React.useState("john.doe@example.com");
  const [phone, setPhone] = React.useState("+1 (555) 123-4567");
  const [language, setLanguage] = React.useState("english");
  const [timezone, setTimezone] = React.useState("america_new_york");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);
  const [alertNotifications, setAlertNotifications] = React.useState(true);
  const [maintenanceNotifications, setMaintenanceNotifications] = React.useState(true);
  const [batteryNotifications, setBatteryNotifications] = React.useState(true);
  const [securityNotifications, setSecurityNotifications] = React.useState(true);
  const [updateNotifications, setUpdateNotifications] = React.useState(false);
  
  // Display settings
  const [darkMode, setDarkMode] = React.useState(false);
  const [compactMode, setCompactMode] = React.useState(false);
  const [showBatteryPercentage, setShowBatteryPercentage] = React.useState(true);
  const [showRange, setShowRange] = React.useState(true);
  const [temperatureUnit, setTemperatureUnit] = React.useState("fahrenheit");
  const [distanceUnit, setDistanceUnit] = React.useState("miles");
  
  // Privacy settings
  const [locationSharing, setLocationSharing] = React.useState(true);
  const [dataCollection, setDataCollection] = React.useState(true);
  const [crashReporting, setCrashReporting] = React.useState(true);
  
  // Connected devices settings
  const [autoConnect, setAutoConnect] = React.useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = React.useState(true);
  const [wifiEnabled, setWifiEnabled] = React.useState(true);
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      <Tabs 
        aria-label="Settings Tabs" 
        selectedKey={selectedTab} 
        onSelectionChange={setSelectedTab as any}
        className="mb-6"
      >
        <Tab key="account" title="Account">
          <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                <p className="text-sm text-foreground-500">Update your account details and personal information</p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex flex-col items-center gap-3">
                    <Avatar
                      src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                      className="w-24 h-24"
                      name="John Doe"
                    />
                    <Button 
                      size="sm" 
                      variant="flat"
                      startContent={<Icon icon="lucide:upload" />}
                    >
                      Change Photo
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <Input
                      label="Full Name"
                      value={name}
                      onValueChange={setName}
                    />
                    <Input
                      label="Email Address"
                      value={email}
                      onValueChange={setEmail}
                      type="email"
                    />
                    <Input
                      label="Phone Number"
                      value={phone}
                      onValueChange={setPhone}
                      type="tel"
                    />
                  </div>
                </div>
                
                <Divider />
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Regional Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Language"
                      selectedKeys={[language]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        if (selected) setLanguage(selected.toString());
                      }}
                    >
                      <SelectItem key="english" value="english">English</SelectItem>
                      <SelectItem key="spanish" value="spanish">Spanish</SelectItem>
                      <SelectItem key="french" value="french">French</SelectItem>
                      <SelectItem key="german" value="german">German</SelectItem>
                      <SelectItem key="chinese" value="chinese">Chinese</SelectItem>
                    </Select>
                    
                    <Select
                      label="Time Zone"
                      selectedKeys={[timezone]}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0];
                        if (selected) setTimezone(selected.toString());
                      }}
                    >
                      <SelectItem key="america_new_york" value="america_new_york">America/New York (UTC-5)</SelectItem>
                      <SelectItem key="america_los_angeles" value="america_los_angeles">America/Los Angeles (UTC-8)</SelectItem>
                      <SelectItem key="america_chicago" value="america_chicago">America/Chicago (UTC-6)</SelectItem>
                      <SelectItem key="europe_london" value="europe_london">Europe/London (UTC+0)</SelectItem>
                      <SelectItem key="europe_paris" value="europe_paris">Europe/Paris (UTC+1)</SelectItem>
                      <SelectItem key="asia_tokyo" value="asia_tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="flat">Cancel</Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">Security</h2>
                <p className="text-sm text-foreground-500">Manage your password and security settings</p>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Change Password</h3>
                  <Input
                    label="Current Password"
                    type="password"
                    placeholder="Enter your current password"
                  />
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter your new password"
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    placeholder="Confirm your new password"
                  />
                </div>
                
                <Divider />
                
                <div className="space-y-4">
                  <h3 className="text-md font-medium">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Enable Two-Factor Authentication</p>
                      <p className="text-sm text-foreground-500">Add an extra layer of security to your account</p>
                    </div>
                    <Switch isSelected={false} />
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="flat">Cancel</Button>
                  <Button color="primary">Save Changes</Button>
                </div>
              </CardBody>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-danger">Danger Zone</h2>
                <p className="text-sm text-foreground-500">Irreversible and destructive actions</p>
              </CardHeader>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete Account</p>
                    <p className="text-sm text-foreground-500">Permanently delete your account and all associated data</p>
                  </div>
                  <Button color="danger" variant="flat" onPress={onLogout}>Delete Account</Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
        
        <Tab key="notifications" title="Notifications">
          <Card>
            <CardHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              <p className="text-sm text-foreground-500">Manage how you receive notifications</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Notification Channels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-foreground-500">Receive notifications via email</p>
                    </div>
                    <Switch 
                      isSelected={emailNotifications} 
                      onValueChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-foreground-500">Receive notifications on your device</p>
                    </div>
                    <Switch 
                      isSelected={pushNotifications} 
                      onValueChange={setPushNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">SMS Notifications</p>
                      <p className="text-sm text-foreground-500">Receive notifications via text message</p>
                    </div>
                    <Switch 
                      isSelected={smsNotifications} 
                      onValueChange={setSmsNotifications} 
                    />
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium">Notification Types</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center">
                        <Icon icon="lucide:bell" className="text-danger" />
                      </div>
                      <div>
                        <p className="font-medium">Alert Notifications</p>
                        <p className="text-sm text-foreground-500">Security and emergency alerts</p>
                      </div>
                    </div>
                    <Switch 
                      isSelected={alertNotifications} 
                      onValueChange={setAlertNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                        <Icon icon="lucide:wrench" className="text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">Maintenance Notifications</p>
                        <p className="text-sm text-foreground-500">Service reminders and maintenance alerts</p>
                      </div>
                    </div>
                    <Switch 
                      isSelected={maintenanceNotifications} 
                      onValueChange={setMaintenanceNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Icon icon="lucide:battery" className="text-success" />
                      </div>
                      <div>
                        <p className="font-medium">Battery Notifications</p>
                        <p className="text-sm text-foreground-500">Battery level and charging status</p>
                      </div>
                    </div>
                    <Switch 
                      isSelected={batteryNotifications} 
                      onValueChange={setBatteryNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon icon="lucide:shield" className="text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Security Notifications</p>
                        <p className="text-sm text-foreground-500">Unauthorized access and security events</p>
                      </div>
                    </div>
                    <Switch 
                      isSelected={securityNotifications} 
                      onValueChange={setSecurityNotifications} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-default/10 flex items-center justify-center">
                        <Icon icon="lucide:download" className="text-default-500" />
                      </div>
                      <div>
                        <p className="font-medium">Software Update Notifications</p>
                        <p className="text-sm text-foreground-500">New features and system updates</p>
                      </div>
                    </div>
                    <Switch 
                      isSelected={updateNotifications} 
                      onValueChange={setUpdateNotifications} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="flat">Reset to Default</Button>
                <Button color="primary">Save Changes</Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="display" title="Display">
          <Card>
            <CardHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Display Settings</h2>
              <p className="text-sm text-foreground-500">Customize your dashboard appearance</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Theme</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dark Mode</p>
                      <p className="text-sm text-foreground-500">Enable dark theme for the dashboard</p>
                    </div>
                    <Switch 
                      isSelected={darkMode} 
                      onValueChange={setDarkMode} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compact Mode</p>
                      <p className="text-sm text-foreground-500">Reduce spacing for more content</p>
                    </div>
                    <Switch 
                      isSelected={compactMode} 
                      onValueChange={setCompactMode} 
                    />
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium">Dashboard Elements</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Battery Percentage</p>
                      <p className="text-sm text-foreground-500">Display battery percentage on dashboard</p>
                    </div>
                    <Switch 
                      isSelected={showBatteryPercentage} 
                      onValueChange={setShowBatteryPercentage} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Range</p>
                      <p className="text-sm text-foreground-500">Display estimated range on dashboard</p>
                    </div>
                    <Switch 
                      isSelected={showRange} 
                      onValueChange={setShowRange} 
                    />
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium">Units</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Temperature Unit"
                    selectedKeys={[temperatureUnit]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      if (selected) setTemperatureUnit(selected.toString());
                    }}
                  >
                    <SelectItem key="fahrenheit" value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    <SelectItem key="celsius" value="celsius">Celsius (°C)</SelectItem>
                  </Select>
                  
                  <Select
                    label="Distance Unit"
                    selectedKeys={[distanceUnit]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0];
                      if (selected) setDistanceUnit(selected.toString());
                    }}
                  >
                    <SelectItem key="miles" value="miles">Miles</SelectItem>
                    <SelectItem key="kilometers" value="kilometers">Kilometers</SelectItem>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="flat">Reset to Default</Button>
                <Button color="primary">Save Changes</Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="privacy" title="Privacy & Security">
          <Card>
            <CardHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Privacy & Security Settings</h2>
              <p className="text-sm text-foreground-500">Manage your data and privacy preferences</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Data Sharing</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Location Sharing</p>
                      <p className="text-sm text-foreground-500">Share your vehicle's location data</p>
                    </div>
                    <Switch 
                      isSelected={locationSharing} 
                      onValueChange={setLocationSharing} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Usage Data Collection</p>
                      <p className="text-sm text-foreground-500">Allow collection of anonymous usage data to improve services</p>
                    </div>
                    <Switch 
                      isSelected={dataCollection} 
                      onValueChange={setDataCollection} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Crash Reporting</p>
                      <p className="text-sm text-foreground-500">Send crash reports to help improve stability</p>
                    </div>
                    <Switch 
                      isSelected={crashReporting} 
                      onValueChange={setCrashReporting} 
                    />
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <h3 className="text-md font-medium">Privacy Controls</h3>
                <div className="space-y-3">
                  <Button
                    variant="flat"
                    startContent={<Icon icon="lucide:download" />}
                    fullWidth
                    className="justify-start"
                  >
                    Download My Data
                  </Button>
                  
                  <Button
                    variant="flat"
                    startContent={<Icon icon="lucide:trash-2" />}
                    fullWidth
                    className="justify-start"
                  >
                    Delete My Data
                  </Button>
                  
                  <Button
                    variant="flat"
                    startContent={<Icon icon="lucide:file-text" />}
                    fullWidth
                    className="justify-start"
                  >
                    View Privacy Policy
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="flat">Reset to Default</Button>
                <Button color="primary">Save Changes</Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
        
        <Tab key="devices" title="Connected Devices">
          <Card>
            <CardHeader className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold">Connected Devices</h2>
              <p className="text-sm text-foreground-500">Manage devices connected to your vehicles</p>
            </CardHeader>
            <CardBody className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-md font-medium">Connection Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-Connect Devices</p>
                      <p className="text-sm text-foreground-500">Automatically connect to previously paired devices</p>
                    </div>
                    <Switch 
                      isSelected={autoConnect} 
                      onValueChange={setAutoConnect} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Bluetooth</p>
                      <p className="text-sm text-foreground-500">Enable Bluetooth connectivity</p>
                    </div>
                    <Switch 
                      isSelected={bluetoothEnabled} 
                      onValueChange={setBluetoothEnabled} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Wi-Fi</p>
                      <p className="text-sm text-foreground-500">Enable Wi-Fi connectivity</p>
                    </div>
                    <Switch 
                      isSelected={wifiEnabled} 
                      onValueChange={setWifiEnabled} 
                    />
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium">Paired Devices</h3>
                  <Button 
                    size="sm" 
                    variant="flat"
                    color="primary"
                    startContent={<Icon icon="lucide:plus" />}
                  >
                    Add Device
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {[
                    { name: "iPhone 15 Pro", type: "Phone", lastConnected: "Today, 10:23 AM" },
                    { name: "MacBook Pro", type: "Computer", lastConnected: "Yesterday, 3:45 PM" },
                    { name: "Apple Watch", type: "Wearable", lastConnected: "Jul 15, 2023" }
                  ].map((device, index) => (
                    <div key={index} className="p-3 bg-content2/50 rounded-medium flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon 
                            icon={
                              device.type === "Phone" ? "lucide:smartphone" : 
                              device.type === "Computer" ? "lucide:laptop" : "lucide:watch"
                            } 
                            className="text-primary" 
                          />
                        </div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-xs text-foreground-500">
                            {device.type} • Last connected: {device.lastConnected}
                          </p>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        aria-label="Remove device"
                      >
                        <Icon icon="lucide:trash-2" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="flat">Refresh</Button>
                <Button color="primary">Save Changes</Button>
              </div>
            </CardBody>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};