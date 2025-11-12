import React, { useState } from "react";
import {
  Bell,
  Car,
  Wifi,
  Camera,
  Mic,
  AlertTriangle,
  Settings,
  Database,
  BarChart3,
  Users,
  Shield,
  Volume2,
  Activity,
  Signal,
  CheckCircle,
  XCircle,
  Power,
  Zap,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";

const AutoCarMonitoringSystem = () => {
  const [userRole, setUserRole] = useState("cloud-staff");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedCar, setSelectedCar] = useState(null);
  const [showAddCarModal, setShowAddCarModal] = useState(false);
  const [showAlertDetailModal, setShowAlertDetailModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const cars = [
    {
      id: "CAR001",
      owner: "John Smith",
      model: "Tesla Model S",
      vin: "5YJ3E1EA6KF123456",
      status: "active",
      alerts: 2,
      devices: 4,
      subscription: "Premium",
    },
    {
      id: "CAR002",
      owner: "Sarah Johnson",
      model: "Waymo One",
      vin: "5YJ3E1EA7KF789012",
      status: "active",
      alerts: 0,
      devices: 5,
      subscription: "Enterprise",
    },
    {
      id: "CAR003",
      owner: "Mike Chen",
      model: "Cruise AV",
      vin: "5YJ3E1EA8KF345678",
      status: "warning",
      alerts: 5,
      devices: 3,
      subscription: "Basic",
    },
    {
      id: "CAR004",
      owner: "Emma Davis",
      model: "Tesla Model X",
      vin: "5YJ3E1EA9KF901234",
      status: "active",
      alerts: 1,
      devices: 4,
      subscription: "Premium",
    },
  ];

  const alerts = [
    {
      id: 1,
      carId: "CAR001",
      type: "Emergency",
      sound: "Siren Detected",
      time: "2 min ago",
      severity: "high",
      location: "Exterior",
    },
    {
      id: 2,
      carId: "CAR001",
      type: "Safety",
      sound: "Horn Alert",
      time: "15 min ago",
      severity: "medium",
      location: "Exterior",
    },
    {
      id: 3,
      carId: "CAR003",
      type: "Security",
      sound: "Glass Breaking",
      time: "1 hour ago",
      severity: "high",
      location: "Interior",
    },
    {
      id: 4,
      carId: "CAR003",
      type: "Passenger",
      sound: "Crying Detected",
      time: "2 hours ago",
      severity: "medium",
      location: "Interior Rear",
    },
    {
      id: 5,
      carId: "CAR004",
      type: "Animal",
      sound: "Dog Barking",
      time: "3 hours ago",
      severity: "low",
      location: "Interior",
    },
  ];

  const iotDevices = [
    {
      id: "DEV001",
      carId: "CAR001",
      type: "Microphone",
      location: "Interior Front",
      status: "online",
      wifi: "Connected",
      signalStrength: 85,
      lastSeen: "1 min ago",
    },
    {
      id: "DEV002",
      carId: "CAR001",
      type: "Microphone",
      location: "Interior Rear",
      status: "online",
      wifi: "Connected",
      signalStrength: 92,
      lastSeen: "1 min ago",
    },
    {
      id: "DEV003",
      carId: "CAR001",
      type: "Camera",
      location: "Dashboard",
      status: "online",
      wifi: "Connected",
      signalStrength: 78,
      lastSeen: "2 min ago",
    },
    {
      id: "DEV004",
      carId: "CAR001",
      type: "Microphone",
      location: "Exterior",
      status: "offline",
      wifi: "Disconnected",
      signalStrength: 0,
      lastSeen: "2 hours ago",
    },
    {
      id: "DEV005",
      carId: "CAR002",
      type: "Microphone",
      location: "Interior Front",
      status: "online",
      wifi: "Connected",
      signalStrength: 88,
      lastSeen: "30 sec ago",
    },
  ];

  const soundTypes = [
    "Emergency Sirens",
    "Horn Alerts",
    "Crash Sounds",
    "Glass Breaking",
    "Tire Screeching",
    "Engine Malfunction",
    "Passenger Distress",
    "Crying/Screaming",
    "Animal Sounds",
    "Abnormal Vibrations",
  ];

  const CloudDashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cars</p>
              <p className="text-3xl font-bold text-blue-600">{cars.length}</p>
            </div>
            <Car className="text-blue-600" size={40} />
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Alerts</p>
              <p className="text-3xl font-bold text-red-600">8</p>
            </div>
            <AlertTriangle className="text-red-600" size={40} />
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">IoT Devices</p>
              <p className="text-3xl font-bold text-green-600">16</p>
            </div>
            <Wifi className="text-green-600" size={40} />
          </div>
        </div>

        <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">System Health</p>
              <p className="text-3xl font-bold text-purple-600">94%</p>
            </div>
            <Activity className="text-purple-600" size={40} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="mr-2 text-orange-500" size={20} />
            Recent Alerts
          </h3>
          <div className="space-y-3">
            {alerts.slice(0, 5).map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{alert.sound}</p>
                  <p className="text-sm text-gray-600">
                    {alert.carId} - {alert.time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : alert.severity === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {alert.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="mr-2 text-blue-500" size={20} />
            Alert Distribution
          </h3>
          <div className="space-y-4">
            {["Emergency", "Safety", "Security", "Passenger", "Animal"].map(
              (type, idx) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">{type}</span>
                    <span className="text-sm font-medium">
                      {[3, 5, 2, 4, 2][idx]}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${[60, 80, 40, 70, 35][idx]}%` }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const CloudCarManagementView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Connected Vehicles Management</h3>
        <button
          onClick={() => setShowAddCarModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add New Vehicle
        </button>
      </div>

      <div className="space-y-4">
        {cars.map((car) => (
          <div
            key={car.id}
            className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Car className="text-blue-600 mr-4" size={40} />
                <div>
                  <h4 className="text-xl font-bold">{car.model}</h4>
                  <p className="text-gray-600">
                    {car.id} - Owner: {car.owner}
                  </p>
                  <p className="text-sm text-gray-500">VIN: {car.vin}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                  <Edit size={18} />
                </button>
                <button className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Status</p>
                <p
                  className={`font-medium ${
                    car.status === "active"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {car.status.toUpperCase()}
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Devices</p>
                <p className="font-medium">{car.devices} installed</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Subscription</p>
                <p className="font-medium">{car.subscription}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <p className="text-sm text-gray-600">Alerts Today</p>
                <p className="font-medium">{car.alerts}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100">
                View Full Details
              </button>
              <button className="flex-1 bg-purple-50 text-purple-600 py-2 rounded hover:bg-purple-100">
                Manage AI Models
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded hover:bg-gray-200">
                Configure Alerts
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddCarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add New Vehicle to System</h3>
              <button
                onClick={() => setShowAddCarModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Owner Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Owner Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Vehicle Model
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Tesla Model 3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  VIN Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="5YJ3E1EA..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  License Plate
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border rounded"
                  placeholder="CAL-123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Subscription Plan
                </label>
                <select className="w-full px-3 py-2 border rounded">
                  <option>Basic</option>
                  <option>Premium</option>
                  <option>Enterprise</option>
                </select>
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded mt-4">
              <p className="text-sm text-blue-800">
                After adding the vehicle, notify the IoT team to schedule device
                installation.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddCarModal(false)}
                className="flex-1 px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddCarModal(false)}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const CloudAlertConfigView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Alert Configuration & Monitoring
      </h3>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">
          Supported Sound Intelligence Types
        </h4>
        <div className="grid grid-cols-3 gap-3">
          {soundTypes.map((sound) => (
            <div
              key={sound}
              className="flex items-center p-3 bg-gray-50 rounded"
            >
              <Volume2 className="text-gray-600 mr-2" size={16} />
              <span className="text-sm">{sound}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Alert Notification Settings</h4>
        <div className="space-y-4">
          {[
            { name: "Owner Notifications", desc: "Send alerts to car owners" },
            {
              name: "Service Provider Alerts",
              desc: "Notify service providers",
            },
            {
              name: "Emergency Services",
              desc: "Auto-notify for high-severity alerts",
            },
          ].map((setting) => (
            <div
              key={setting.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded"
            >
              <div>
                <p className="font-medium">{setting.name}</p>
                <p className="text-sm text-gray-600">{setting.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-blue-600"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Active Alert Monitor</h4>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
            >
              <div className="flex items-center">
                <Bell
                  className={`mr-3 ${
                    alert.severity === "high"
                      ? "text-red-600"
                      : alert.severity === "medium"
                      ? "text-yellow-600"
                      : "text-blue-600"
                  }`}
                  size={20}
                />
                <div>
                  <p className="font-medium">{alert.sound}</p>
                  <p className="text-sm text-gray-600">
                    {alert.carId} • {alert.type} • {alert.time}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
                  View Details
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200">
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const CloudDatabaseView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">System Database Management</h3>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border text-center">
          <Database className="text-blue-600 mb-3 mx-auto" size={32} />
          <h4 className="font-semibold mb-2">Vehicle Records</h4>
          <p className="text-3xl font-bold text-blue-600">{cars.length}</p>
          <button className="mt-4 w-full bg-blue-50 text-blue-600 py-2 rounded hover:bg-blue-100">
            Manage Records
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border text-center">
          <Database className="text-green-600 mb-3 mx-auto" size={32} />
          <h4 className="font-semibold mb-2">IoT Device Data</h4>
          <p className="text-3xl font-bold text-green-600">16</p>
          <button className="mt-4 w-full bg-green-50 text-green-600 py-2 rounded hover:bg-green-100">
            Manage Records
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border text-center">
          <Database className="text-orange-600 mb-3 mx-auto" size={32} />
          <h4 className="font-semibold mb-2">Alert History</h4>
          <p className="text-3xl font-bold text-orange-600">1,247</p>
          <button className="mt-4 w-full bg-orange-50 text-orange-600 py-2 rounded hover:bg-orange-100">
            View History
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Database Operations</h4>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Settings className="text-gray-600 mb-2" size={24} />
            <p className="font-medium">Backup Database</p>
            <p className="text-sm text-gray-600">Create system backup</p>
          </button>

          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <BarChart3 className="text-gray-600 mb-2" size={24} />
            <p className="font-medium">Generate Reports</p>
            <p className="text-sm text-gray-600">Export analytics data</p>
          </button>

          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Shield className="text-gray-600 mb-2" size={24} />
            <p className="font-medium">Data Security</p>
            <p className="text-sm text-gray-600">Manage access controls</p>
          </button>

          <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
            <Activity className="text-gray-600 mb-2" size={24} />
            <p className="font-medium">System Maintenance</p>
            <p className="text-sm text-gray-600">Optimize performance</p>
          </button>
        </div>
      </div>
    </div>
  );

  const OwnerDashboardView = () => (
    <div className="space-y-6">
      {/* Vehicle Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-3">My Vehicle</h2>
            <div className="space-y-1">
              <p className="text-blue-100 text-lg">Tesla Model S - CAR001</p>
              <p className="text-sm text-blue-200">VIN: 5YJ3E1EA6KF123456</p>
              <p className="text-sm text-blue-200">License: CAL-001</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Subscription</p>
            <p className="text-xl font-bold">Premium Plan</p>
            <p className="text-blue-200 text-xs mt-1">Renews Nov 15, 2025</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Shield className="text-green-600" size={28} />
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              Active
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Protection Status</p>
          <p className="text-2xl font-bold text-gray-900">24/7 Monitoring</p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Bell className="text-orange-600" size={28} />
            <span className="text-2xl font-bold text-orange-600">2</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Alerts Today</p>
          <p className="text-xs text-gray-500">1 Emergency, 1 Safety</p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="text-blue-600" size={28} />
            <span className="text-2xl font-bold text-blue-600">3/4</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Devices Online</p>
          <p className="text-xs text-gray-500">1 device offline</p>
        </div>

        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-purple-600" size={28} />
            <span className="text-2xl font-bold text-purple-600">98%</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">System Uptime</p>
          <p className="text-xs text-gray-500">Last 30 days</p>
        </div>
      </div>

      {/* Charts and Reports Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Alert Trends Chart */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart3 className="mr-2 text-blue-600" size={20} />
              Alert Trends (Last 7 Days)
            </h3>
            <button className="text-xs text-blue-600 hover:text-blue-800">
              View Details
            </button>
          </div>
          <div className="space-y-3">
            {[
              { day: "Mon", count: 3, percentage: 60 },
              { day: "Tue", count: 5, percentage: 100 },
              { day: "Wed", count: 2, percentage: 40 },
              { day: "Thu", count: 4, percentage: 80 },
              { day: "Fri", count: 1, percentage: 20 },
              { day: "Sat", count: 3, percentage: 60 },
              { day: "Sun", count: 2, percentage: 40 },
            ].map((data) => (
              <div key={data.day} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-10">
                  {data.day}
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                  <div
                    className="bg-blue-500 h-8 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${data.percentage}%` }}
                  >
                    <span className="text-xs font-medium text-white">
                      {data.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Type Distribution */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Volume2 className="mr-2 text-purple-600" size={20} />
              Alert Distribution by Type
            </h3>
            <span className="text-xs text-gray-500">Last 30 days</span>
          </div>
          <div className="space-y-4">
            {[
              { type: "Emergency", count: 8, percentage: 35, color: "red" },
              { type: "Safety", count: 12, percentage: 50, color: "yellow" },
              { type: "Security", count: 5, percentage: 20, color: "orange" },
              { type: "Passenger", count: 3, percentage: 12, color: "blue" },
              { type: "Animal", count: 2, percentage: 8, color: "green" },
            ].map((data) => (
              <div key={data.type}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {data.type}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {data.count} alerts
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      data.color === "red"
                        ? "bg-red-500"
                        : data.color === "yellow"
                        ? "bg-yellow-500"
                        : data.color === "orange"
                        ? "bg-orange-500"
                        : data.color === "blue"
                        ? "bg-blue-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${data.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary Report */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <Database className="mr-2 text-green-600" size={20} />
            Monthly Summary Report
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
              Download PDF
            </button>
            <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
              View Full Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-3xl font-bold text-blue-600">30</p>
            <p className="text-sm text-gray-600 mt-1">Total Alerts</p>
            <p className="text-xs text-green-600 mt-1">↓ 15% from last month</p>
          </div>

          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-3xl font-bold text-red-600">8</p>
            <p className="text-sm text-gray-600 mt-1">High Priority</p>
            <p className="text-xs text-red-600 mt-1">↑ 5% from last month</p>
          </div>

          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-3xl font-bold text-green-600">99.2%</p>
            <p className="text-sm text-gray-600 mt-1">Device Uptime</p>
            <p className="text-xs text-green-600 mt-1">↑ 2% from last month</p>
          </div>

          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-3xl font-bold text-purple-600">4.2h</p>
            <p className="text-sm text-gray-600 mt-1">Avg Response Time</p>
            <p className="text-xs text-green-600 mt-1">↓ 10% from last month</p>
          </div>
        </div>

        <div className="mt-6 border-t pt-6">
          <h4 className="font-semibold text-gray-900 mb-3">
            Detection Performance by Time of Day
          </h4>
          <div className="grid grid-cols-6 gap-2">
            {[
              { time: "00-04", alerts: 2, height: 20 },
              { time: "04-08", alerts: 3, height: 30 },
              { time: "08-12", alerts: 8, height: 80 },
              { time: "12-16", alerts: 10, height: 100 },
              { time: "16-20", alerts: 5, height: 50 },
              { time: "20-24", alerts: 2, height: 20 },
            ].map((data) => (
              <div key={data.time} className="text-center">
                <div className="bg-gray-100 h-32 rounded flex items-end justify-center">
                  <div
                    className="bg-blue-500 w-full rounded"
                    style={{ height: `${data.height}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600 mt-2">{data.time}</p>
                <p className="text-xs font-medium text-gray-900">
                  {data.alerts} alerts
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Performance Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Signal className="mr-2 text-indigo-600" size={20} />
            Device Performance & Health
          </h3>
          <select className="text-sm border rounded px-3 py-1">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
        </div>

        <div className="space-y-4">
          {iotDevices
            .filter((d) => d.carId === "CAR001")
            .map((device) => (
              <div key={device.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    {device.type === "Microphone" ? (
                      <Mic className="text-blue-600 mr-3" size={20} />
                    ) : (
                      <Camera className="text-purple-600 mr-3" size={20} />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {device.location}
                      </p>
                      <p className="text-xs text-gray-500">
                        {device.type} - {device.id}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">
                        Signal Strength
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {device.signalStrength}%
                      </p>
                    </div>
                    {device.status === "online" ? (
                      <CheckCircle className="text-green-600" size={24} />
                    ) : (
                      <XCircle className="text-red-600" size={24} />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Uptime (30 days)</span>
                    <span className="font-medium">
                      {device.status === "online" ? "99.8%" : "87.3%"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={
                        device.status === "online"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                      style={{
                        width: device.status === "online" ? "99.8%" : "87.3%",
                      }}
                      className="h-2 rounded-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Detections</p>
                      <p className="text-sm font-bold text-gray-900">
                        {Math.floor(Math.random() * 50) + 10}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Avg Response</p>
                      <p className="text-sm font-bold text-gray-900">
                        {(Math.random() * 2 + 1).toFixed(1)}s
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Last Active</p>
                      <p className="text-sm font-bold text-gray-900">
                        {device.lastSeen}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <AlertTriangle className="mr-2 text-orange-500" size={20} />
            Recent Activity
          </h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Alerts →
          </button>
        </div>
        <div className="space-y-3">
          {alerts
            .filter((a) => a.carId === "CAR001")
            .map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div
                    className={`p-2 rounded-full mr-4 ${
                      alert.severity === "high" ? "bg-red-100" : "bg-yellow-100"
                    }`}
                  >
                    <AlertTriangle
                      className={`${
                        alert.severity === "high"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                      size={20}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{alert.sound}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          alert.severity === "high"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {alert.type}
                      </span>
                      <span className="text-sm text-gray-500">
                        {alert.time}
                      </span>
                      <span className="text-sm text-gray-500">
                        • {alert.location}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedAlert(alert);
                    setShowAlertDetailModal(true);
                  }}
                  className="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 font-medium"
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const OwnerServicesView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-blue-600">Premium Plan</h3>
            <p className="text-gray-600">
              $19.99/month - Renews on Nov 15, 2025
            </p>
          </div>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">
          Intelligence Services Configuration
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Enable or disable specific surveillance intelligence services for your
          vehicle
        </p>
        <div className="space-y-3">
          {[
            {
              name: "Emergency Alerts",
              desc: "Sirens, crashes, urgent sounds",
              enabled: true,
              included: true,
            },
            {
              name: "Safety Monitoring",
              desc: "Horn alerts, tire screeching",
              enabled: true,
              included: true,
            },
            {
              name: "Security Detection",
              desc: "Glass breaking, intrusion alerts",
              enabled: true,
              included: true,
            },
            {
              name: "Passenger Sound Recognition",
              desc: "Crying, distress calls",
              enabled: true,
              included: true,
            },
            {
              name: "Animal Detection",
              desc: "Pet sounds inside vehicle",
              enabled: false,
              included: false,
            },
          ].map((service) => (
            <div
              key={service.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{service.name}</p>
                  {!service.included && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                      Enterprise Only
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{service.desc}</p>
              </div>
              <input
                type="checkbox"
                defaultChecked={service.enabled}
                disabled={!service.included}
                className="w-5 h-5 text-blue-600"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
        <div className="space-y-3">
          {[
            { name: "Email Notifications", enabled: true },
            { name: "SMS Alerts", enabled: true },
            { name: "Push Notifications", enabled: false },
            { name: "Daily Summary Report", enabled: true },
          ].map((pref) => (
            <div
              key={pref.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded"
            >
              <p className="font-medium">{pref.name}</p>
              <input
                type="checkbox"
                defaultChecked={pref.enabled}
                className="w-5 h-5 text-blue-600"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const IoTDeviceManagementView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">IoT Device Management</h3>
        <div className="flex gap-3">
          <select
            className="px-4 py-2 border rounded-lg"
            onChange={(e) =>
              setSelectedCar(cars.find((c) => c.id === e.target.value))
            }
          >
            <option value="">All Vehicles</option>
            {cars.map((car) => (
              <option key={car.id} value={car.id}>
                {car.id} - {car.owner}
              </option>
            ))}
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Plus size={18} />
            Add Device
          </button>
        </div>
      </div>

      {selectedCar && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium">
            Managing devices for: {selectedCar.id} - {selectedCar.model} (
            {selectedCar.owner})
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {iotDevices
          .filter((d) => !selectedCar || d.carId === selectedCar.id)
          .map((device) => (
            <div key={device.id} className="bg-white p-6 rounded-lg border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {device.type === "Microphone" ? (
                    <Mic className="text-blue-600 mr-3" size={24} />
                  ) : (
                    <Camera className="text-purple-600 mr-3" size={24} />
                  )}
                  <div>
                    <h4 className="font-semibold">{device.type}</h4>
                    <p className="text-sm text-gray-600">{device.id}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                    device.status === "online"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {device.status === "online" ? (
                    <CheckCircle size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}
                  {device.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Location:</span>
                  <span className="text-sm font-medium">{device.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Vehicle:</span>
                  <span className="text-sm font-medium">{device.carId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">WiFi Status:</span>
                  <span
                    className={`text-sm font-medium ${
                      device.wifi === "Connected"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {device.wifi}
                  </span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">
                      Signal Strength:
                    </span>
                    <span className="text-sm font-medium">
                      {device.signalStrength}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        device.signalStrength > 70
                          ? "bg-green-600"
                          : device.signalStrength > 40
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                      style={{ width: `${device.signalStrength}%` }}
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Seen:</span>
                  <span className="text-sm font-medium">{device.lastSeen}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700">
                  Configure
                </button>
                <button className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200">
                  Test
                </button>
                <button className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm hover:bg-red-200">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );

  const IoTNetworkView = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">
        Network & Connectivity Management
      </h3>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border">
          <Wifi className="text-blue-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Connected Devices</p>
          <p className="text-2xl font-bold">12/16</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <Signal className="text-green-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Avg Signal Strength</p>
          <p className="text-2xl font-bold">84%</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <Activity className="text-purple-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Network Uptime</p>
          <p className="text-2xl font-bold">99.7%</p>
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <Zap className="text-orange-600 mb-2" size={32} />
          <p className="text-sm text-gray-600">Data Throughput</p>
          <p className="text-2xl font-bold">2.3 GB</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">
          WiFi Network Configuration by Vehicle
        </h4>
        <div className="space-y-4">
          {cars.map((car) => (
            <div key={car.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-medium">
                    {car.id} - {car.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    Network: AutoNet_{car.id}
                  </p>
                </div>
                <button className="px-3 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm">
                  Configure Network
                </button>
              </div>
              <div className="grid grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Devices: </span>
                  <span className="font-medium">{car.devices}</span>
                </div>
                <div>
                  <span className="text-gray-600">Status: </span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div>
                  <span className="text-gray-600">Security: </span>
                  <span className="font-medium">WPA3</span>
                </div>
                <div>
                  <span className="text-gray-600">Bandwidth: </span>
                  <span className="font-medium">5 GHz</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h4 className="font-semibold mb-4">Device Control Panel</h4>
        <div className="grid grid-cols-4 gap-3">
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <Power className="text-green-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">Power On All</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <Power className="text-red-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">Power Off All</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <Activity className="text-blue-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">Restart Devices</p>
          </button>
          <button className="p-4 border rounded-lg hover:bg-gray-50 text-center">
            <Settings className="text-gray-600 mx-auto mb-2" size={24} />
            <p className="text-sm font-medium">Bulk Configure</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabs = () => {
    if (userRole === "cloud-staff") {
      return [
        { id: "dashboard", label: "Dashboard", icon: BarChart3 },
        { id: "cars", label: "Vehicle Management", icon: Car },
        { id: "alerts", label: "Alert Tracking", icon: AlertTriangle },
        { id: "database", label: "Database", icon: Database },
      ];
    } else if (userRole === "car-owner") {
      return [
        { id: "dashboard", label: "My Dashboard", icon: BarChart3 },
        { id: "services", label: "Services & Subscription", icon: Settings },
        { id: "alerts", label: "My Alerts", icon: Bell },
      ];
    } else {
      return [
        { id: "devices", label: "Device Management", icon: Wifi },
        { id: "network", label: "Network & Connectivity", icon: Signal },
      ];
    }
  };

  const renderContent = () => {
    if (userRole === "car-owner") {
      if (activeTab === "dashboard") return <OwnerDashboardView />;
      if (activeTab === "services") return <OwnerServicesView />;
      if (activeTab === "alerts")
        return (
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">My Alert History</h3>
            <div className="space-y-3">
              {alerts
                .filter((a) => a.carId === "CAR001")
                .map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-center justify-between p-4 border rounded hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <Bell
                        className={`mr-3 ${
                          alert.severity === "high"
                            ? "text-red-600"
                            : alert.severity === "medium"
                            ? "text-yellow-600"
                            : "text-blue-600"
                        }`}
                        size={20}
                      />
                      <div>
                        <p className="font-medium">{alert.sound}</p>
                        <p className="text-sm text-gray-600">
                          {alert.type} • {alert.time} • {alert.location}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowAlertDetailModal(true);
                      }}
                      className="px-4 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      View Details
                    </button>
                  </div>
                ))}
            </div>
          </div>
        );
    } else if (userRole === "iot-team") {
      if (activeTab === "devices") return <IoTDeviceManagementView />;
      if (activeTab === "network") return <IoTNetworkView />;
    } else {
      if (activeTab === "dashboard") return <CloudDashboardView />;
      if (activeTab === "cars") return <CloudCarManagementView />;
      if (activeTab === "alerts") return <CloudAlertConfigView />;
      if (activeTab === "database") return <CloudDatabaseView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Car className="text-blue-600 mr-3" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Auto Audio Intelligence
                </h1>
                <p className="text-sm text-gray-600">
                  {userRole === "cloud-staff"
                    ? "Cloud Service Management Platform"
                    : userRole === "car-owner"
                    ? "Vehicle Owner Portal"
                    : "IoT Device Management Console"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={userRole}
                onChange={(e) => {
                  setUserRole(e.target.value);
                  setActiveTab("dashboard");
                  setSelectedCar(null);
                }}
                className="px-4 py-2 border rounded-lg font-medium bg-white"
              >
                <option value="cloud-staff">☁️ Cloud Staff</option>
                <option value="car-owner">🚗 Car Owner</option>
                <option value="iot-team">🔧 IoT Team</option>
              </select>
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 hover:bg-gray-100 rounded-full"
                >
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-4 border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">
                          Notifications
                        </h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {alerts
                        .filter((a) =>
                          userRole === "car-owner" ? a.carId === "CAR001" : true
                        )
                        .slice(0, 5)
                        .map((alert) => (
                          <div
                            key={alert.id}
                            className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                            onClick={() => {
                              setSelectedAlert(alert);
                              setShowAlertDetailModal(true);
                              setShowNotifications(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`p-2 rounded-full ${
                                  alert.severity === "high"
                                    ? "bg-red-100"
                                    : alert.severity === "medium"
                                    ? "bg-yellow-100"
                                    : "bg-blue-100"
                                }`}
                              >
                                <Bell
                                  size={16}
                                  className={
                                    alert.severity === "high"
                                      ? "text-red-600"
                                      : alert.severity === "medium"
                                      ? "text-yellow-600"
                                      : "text-blue-600"
                                  }
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm text-gray-900">
                                  {alert.sound}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {alert.carId} • {alert.type}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {alert.time}
                                </p>
                              </div>
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${
                                  alert.severity === "high"
                                    ? "bg-red-100 text-red-700"
                                    : alert.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-blue-100 text-blue-700"
                                }`}
                              >
                                {alert.severity}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="p-3 border-t bg-gray-50">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium w-full text-center">
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-gray-600" size={20} />
                <span className="text-sm font-medium">
                  {userRole === "cloud-staff"
                    ? "Admin User"
                    : userRole === "car-owner"
                    ? "John Smith"
                    : "IoT Engineer"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1">
            {renderTabs().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <tab.icon size={18} />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">{renderContent()}</div>

      {/* Alert Detail Modal */}
      {showAlertDetailModal && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
              <h3 className="text-xl font-bold">Alert Details</h3>
              <button
                onClick={() => setShowAlertDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Alert Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${
                      selectedAlert.severity === "high"
                        ? "bg-red-100"
                        : selectedAlert.severity === "medium"
                        ? "bg-yellow-100"
                        : "bg-blue-100"
                    }`}
                  >
                    <AlertTriangle
                      size={24}
                      className={
                        selectedAlert.severity === "high"
                          ? "text-red-600"
                          : selectedAlert.severity === "medium"
                          ? "text-yellow-600"
                          : "text-blue-600"
                      }
                    />
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900">
                      {selectedAlert.sound}
                    </h4>
                    <p className="text-gray-600 mt-1">
                      Detected at {selectedAlert.time}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedAlert.severity === "high"
                      ? "bg-red-100 text-red-700"
                      : selectedAlert.severity === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {selectedAlert.severity.toUpperCase()} PRIORITY
                </span>
              </div>

              {/* Alert Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Alert Type</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAlert.type}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Vehicle</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAlert.carId}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Location</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAlert.location}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Detection Time</p>
                  <p className="font-semibold text-gray-900">
                    {selectedAlert.time}
                  </p>
                </div>
              </div>

              {/* Audio Analysis */}
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Volume2 className="mr-2 text-blue-600" size={18} />
                  Audio Analysis
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Confidence Level
                    </span>
                    <span className="font-semibold text-gray-900">94%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "94%" }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-600">
                      Frequency Range
                    </span>
                    <span className="font-semibold text-gray-900">
                      1.2 kHz - 3.8 kHz
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-900">
                      2.3 seconds
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Decibel Level</span>
                    <span className="font-semibold text-gray-900">85 dB</span>
                  </div>
                </div>
              </div>

              {/* Response Actions */}
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Shield className="mr-2 text-green-600" size={18} />
                  Response Actions Taken
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>Owner notified via SMS and Email</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>Alert logged in system database</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="text-green-600" size={16} />
                    <span>Recording saved for 30 days</span>
                  </div>
                  {selectedAlert.severity === "high" && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="text-green-600" size={16} />
                      <span>Emergency services notified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Preview (placeholder) */}
              <div className="border rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Vehicle Location
                </h5>
                <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Car className="mx-auto mb-2" size={32} />
                    <p className="text-sm">Map view placeholder</p>
                    <p className="text-xs">San Jose, CA 95113</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3 flex-shrink-0">
              <button
                onClick={() => setShowAlertDetailModal(false)}
                className="flex-1 px-4 py-2 border rounded hover:bg-white"
              >
                Close
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Download Report
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                Mark as False Positive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Plan Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold">Upgrade Your Plan</h3>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Choose the perfect plan for your vehicle protection needs
              </p>

              <div className="grid grid-cols-3 gap-6">
                {[
                  {
                    name: "Basic",
                    price: "$9.99",
                    period: "/month",
                    current: false,
                    features: [
                      "Emergency Alerts",
                      "Basic Sound Detection",
                      "Email Notifications",
                      "2 IoT Devices",
                      "7-day Alert History",
                      "Email Support",
                    ],
                  },
                  {
                    name: "Premium",
                    price: "$19.99",
                    period: "/month",
                    current: true,
                    popular: true,
                    features: [
                      "All Basic Features",
                      "Passenger Detection",
                      "SMS Alerts",
                      "Real-time Dashboard",
                      "4 IoT Devices",
                      "30-day Alert History",
                      "Priority Support",
                    ],
                  },
                  {
                    name: "Enterprise",
                    price: "$39.99",
                    period: "/month",
                    current: false,
                    features: [
                      "All Premium Features",
                      "Animal Detection",
                      "Advanced AI Models",
                      "API Access",
                      "Unlimited Devices",
                      "90-day Alert History",
                      "24/7 Phone Support",
                    ],
                  },
                ].map((plan) => (
                  <div
                    key={plan.name}
                    className={`relative border-2 rounded-lg p-6 ${
                      plan.current
                        ? "border-blue-500 bg-blue-50"
                        : plan.popular
                        ? "border-purple-500"
                        : "border-gray-200"
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Most Popular
                      </span>
                    )}
                    {plan.current && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    )}

                    <h4 className="text-xl font-bold text-gray-900 mt-2">
                      {plan.name}
                    </h4>
                    <div className="mt-4 mb-6">
                      <span className="text-4xl font-bold text-gray-900">
                        {plan.price}
                      </span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start text-sm">
                          <CheckCircle
                            className="text-green-600 mr-2 mt-0.5 flex-shrink-0"
                            size={16}
                          />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={`w-full py-3 rounded font-medium ${
                        plan.current
                          ? "bg-gray-100 text-gray-600 cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={plan.current}
                      onClick={() => setShowUpgradeModal(false)}
                    >
                      {plan.current ? "Current Plan" : "Upgrade Now"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Shield className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-gray-900">
                      30-Day Money-Back Guarantee
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Try any plan risk-free. If you're not satisfied, we'll
                      refund your payment within 30 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoCarMonitoringSystem;
