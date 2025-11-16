import React from "react";
import { Sidebar } from "./components/sidebar";
import { DashboardHeader } from "./components/dashboard-header";
import { CarOverview } from "./components/car-overview";
import { DeviceManagement } from "./components/device-management";
import { CarMap } from "./components/car-map";
import { SubscriptionPlan } from "./components/subscription-plan";
import { AlertActivity } from "./components/alert-activity";
import { Tabs, Tab, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { mockCars, mockAlerts } from "./data/mock-data";
import { LoginPage } from "./components/login-page";
import { IoTStaffDashboard } from "./components/iot-staff-dashboard";
import { CloudStaffDashboard } from "./components/cloud-staff-dashboard";
import { DashboardOverview } from "./components/dashboard-overview";
import { SettingsPage } from "./components/settings-page";
import { NotificationsPage } from "./components/notifications-page";
import { SystemAlertsPage } from "./components/system-alerts-page";

export default function App() {
  const [selectedTab, setSelectedTab] = React.useState("overview");
  const [selectedCar, setSelectedCar] = React.useState(mockCars[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  // Change default view mode from "car" to "dashboard"
  const [viewMode, setViewMode] = React.useState<"dashboard" | "car" | "settings" | "notifications">("dashboard");
  
  // Add authentication state
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [userRole, setUserRole] = React.useState<"owner" | "iot" | "cloud" | null>(null);

  // Add state for alert detail modal
  const [selectedAlert, setSelectedAlert] = React.useState<Alert | null>(null);
  const [isAlertDetailOpen, setIsAlertDetailOpen] = React.useState(false);

  // Handle login function
  const handleLogin = (role: "owner" | "iot" | "cloud") => {
    setIsAuthenticated(true);
    setUserRole(role);
  };

  // Handle logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // Handle view mode change
  const handleViewModeChange = (mode: "dashboard" | "car") => {
    setViewMode(mode);
    if (mode === "dashboard") {
      setSelectedTab("overview");
    }
  };

  // Add function to navigate to subscription page
  const handleNavigateToSubscription = () => {
    setViewMode("car");
    setSelectedTab("subscription");
  };

  // Function to handle viewing alert details
  const handleViewAlertDetail = (alert: Alert) => {
    setSelectedAlert(alert);
    setIsAlertDetailOpen(true);
  };

  // Function to mark all alerts as read
  const handleMarkAllAsRead = () => {
    // In a real app, this would update the backend
    console.log("Marking all alerts as read");
    // You would update your alerts state here
  };

  // Filter alerts for the selected car
  const filteredAlerts = mockAlerts.filter(alert => alert.carId === selectedCar);
  
  // Find the currently selected car
  const currentCar = mockCars.find(car => car.id === selectedCar) || mockCars[0];

  // If not authenticated, show login page
  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Show different dashboard based on role
  if (userRole === "iot") {
    return <IoTStaffDashboard onLogout={handleLogout} />;
  }

  if (userRole === "cloud") {
    return <CloudStaffDashboard onLogout={handleLogout} />;
  }

  // Car owner dashboard (original dashboard)
  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar - Always visible on desktop */}
      <Sidebar 
        isOpen={true}
        onClose={() => {}}
        selectedCar={selectedCar}
        onSelectCar={(id) => {
          setSelectedCar(id);
          setViewMode("car");
        }}
        cars={mockCars}
        onLogout={handleLogout}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <DashboardHeader 
          car={viewMode === "car" ? currentCar : undefined}
          onLogout={handleLogout}
          title={
            viewMode === "dashboard" ? "Dashboard Overview" : 
            viewMode === "settings" ? "Settings" : 
            viewMode === "notifications" ? "Notifications" : undefined
          }
          alerts={mockAlerts}
          onViewAllNotifications={() => setViewMode("notifications")}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {viewMode === "dashboard" ? (
              <DashboardOverview 
                cars={mockCars} 
                alerts={mockAlerts} 
                onSelectCar={(id) => {
                  setSelectedCar(id);
                  setViewMode("car");
                }}
                onNavigateToSubscription={handleNavigateToSubscription}
                onViewAlertDetail={handleViewAlertDetail}
              />
            ) : viewMode === "settings" ? (
              <SettingsPage onLogout={handleLogout} />
            ) : viewMode === "notifications" ? (
              <NotificationsPage 
                alerts={mockAlerts}
                cars={mockCars}
                onViewAlertDetail={handleViewAlertDetail}
                onMarkAllAsRead={handleMarkAllAsRead}
              />
            ) : (
              <Tabs 
                aria-label="Dashboard Tabs" 
                selectedKey={selectedTab} 
                onSelectionChange={setSelectedTab as any}
                className="mb-6"
              >
                <Tab key="overview" title="Overview">
                  <div className="space-y-6">
                    <CarOverview car={currentCar} />
                    <SubscriptionPlan car={mockCars[0]} /> {/* Always use the first car's subscription as the account subscription */}
                    <CarMap car={currentCar} allCars={mockCars} showControls={false} />
                    <AlertActivity alerts={filteredAlerts.slice(0, 5)} hideActionButtons={true} />
                  </div>
                </Tab>
                
                <Tab key="devices" title="Devices">
                  <DeviceManagement car={currentCar} />
                </Tab>
                
                <Tab key="alerts" title="Alerts">
                  <AlertActivity alerts={filteredAlerts} showAll />
                </Tab>
                
                <Tab key="subscription" title="Subscription">
                  <SubscriptionPlan car={mockCars[0]} detailed /> {/* Always use the first car's subscription as the account subscription */}
                </Tab>
              </Tabs>
            )}
          </div>
        </main>
        
        {/* Alert Detail Modal */}
        <Modal isOpen={isAlertDetailOpen} onOpenChange={setIsAlertDetailOpen} size="md">
          <ModalContent>
            {(onClose) => (
              <>
                {selectedAlert && (
                  <>
                    {/* ... existing modal content ... */}
                  </>
                )}
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}