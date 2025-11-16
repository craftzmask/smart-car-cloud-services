import React from "react";
import { Button, Avatar, Badge } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Car } from "../data/mock-data";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCar: string;
  onSelectCar: (id: string) => void;
  cars: Car[];
  onLogout: () => void;
  viewMode: "dashboard" | "car" | "settings" | "notifications";
  onViewModeChange: (mode: "dashboard" | "car" | "settings" | "notifications") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen,
  onClose,
  selectedCar, 
  onSelectCar,
  cars,
  onLogout,
  viewMode,
  onViewModeChange
}) => {
  return (
    <aside 
      className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-content1 shadow-md transition-transform duration-300 ease-in-out
        lg:relative lg:z-0 lg:translate-x-0 lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b border-divider">
          <div className="flex items-center gap-2">
            <Icon icon="lucide:car" className="text-primary text-xl" />
            <span className="font-semibold text-lg">SmartCar</span>
          </div>
          <Button 
            isIconOnly 
            size="sm" 
            variant="light" 
            className="lg:hidden" 
            onPress={onClose}
          >
            <Icon icon="lucide:x" />
          </Button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h3 className="text-xs font-medium text-foreground-500 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              <Button
                variant={viewMode === "dashboard" ? "flat" : "light"}
                color={viewMode === "dashboard" ? "primary" : "default"}
                fullWidth
                className="justify-start"
                startContent={<Icon icon="lucide:layout-dashboard" />}
                onPress={() => onViewModeChange("dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant={viewMode === "notifications" ? "flat" : "light"}
                color={viewMode === "notifications" ? "primary" : "default"}
                fullWidth
                className="justify-start"
                startContent={<Icon icon="lucide:bell" />}
                onPress={() => onViewModeChange("notifications")}
              >
                Notifications
              </Button>
              <Button
                variant={viewMode === "settings" ? "flat" : "light"}
                color={viewMode === "settings" ? "primary" : "default"}
                fullWidth
                className="justify-start"
                startContent={<Icon icon="lucide:settings" />}
                onPress={() => onViewModeChange("settings")}
              >
                Settings
              </Button>
              <Button
                variant="light"
                fullWidth
                className="justify-start"
                startContent={<Icon icon="lucide:help-circle" />}
              >
                Help & Support
              </Button>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xs font-medium text-foreground-500 uppercase tracking-wider mb-3">
              My Cars
            </h3>
            <div className="space-y-2">
              {cars.map((car) => (
                <Button
                  key={car.id}
                  variant="flat"
                  fullWidth
                  className={`justify-start h-auto py-2 ${selectedCar === car.id && viewMode === "car" ? 'bg-primary/10' : ''}`}
                  onPress={() => onSelectCar(car.id)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Icon icon="lucide:car" className="text-primary text-xl" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{car.model}</span>
                      <div className="flex items-center gap-1">
                        {car.status}
                      </div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="p-4 border-t border-divider">          
          <Button
            variant="flat"
            color="danger"
            fullWidth
            className="justify-start"
            startContent={<Icon icon="lucide:log-out" />}
            onPress={onLogout}
          >
            Log Out
          </Button>
        </div>
      </div>
    </aside>
  );
};