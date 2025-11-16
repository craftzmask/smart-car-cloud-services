import React from "react";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge, Avatar } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Car } from "../data/mock-data";

interface DashboardHeaderProps {
  car?: Car;
  onLogout: () => void;
  title?: string;
  alerts?: Alert[];
  onViewAllNotifications?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  car, 
  onLogout, 
  title,
  alerts = [],
  onViewAllNotifications
}) => {
  // Get 5 most recent alerts
  const recentAlerts = React.useMemo(() => {
    return [...alerts]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  }, [alerts]);
  
  // Count unread alerts
  const unreadCount = alerts.filter(alert => !alert.read).length;
  
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
  
  // Get severity color
  const severityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "primary";
      default: return "default";
    }
  };

  return (
    <header className="bg-content1 border-b border-divider p-4">
      <div className="flex items-center justify-between">
        <div>
          {title ? (
            <h1 className="text-xl font-semibold">{title}</h1>
          ) : car ? (
            <>
              <h1 className="text-xl font-semibold">
                {car.model}
              </h1>
              <div className="flex items-center gap-2">
                <Badge 
                  color={car.status === "online" ? "success" : "warning"}
                  variant="flat"
                  size="sm"
                >
                  {car.status}
                </Badge>
                <span className="text-xs text-foreground-500">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </>
          ) : (
            <h1 className="text-xl font-semibold">SmartCar Dashboard</h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                aria-label="Notifications"
              >
                <div className="relative">
                  <Icon icon="lucide:bell" />
                </div>
                  <Badge
                    className="top-1"
                    content={unreadCount > 0 ? unreadCount : null}
                    color="danger"
                    size="sm"
                    placement="top-right"
                  />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Notifications" className="w-80">
              <DropdownItem key="header" className="font-medium" textValue="Recent Alerts">
                Recent Alerts
              </DropdownItem>
              
              {recentAlerts.length === 0 ? (
                <DropdownItem key="no-alerts" textValue="No alerts">
                  <div className="py-2 text-center text-foreground-500">
                    No recent alerts
                  </div>
                </DropdownItem>
              ) : (
                recentAlerts.map(alert => (
                  <DropdownItem 
                    key={alert.id} 
                    textValue={alert.message}
                    className="py-2"
                    startContent={
                      <div className={`w-2 h-2 rounded-full bg-${severityColor(alert.severity)}`} />
                    }
                    description={formatAlertTime(alert.timestamp)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="truncate">{alert.message}</span>
                      {!alert.read && (
                        <Badge color="danger" size="sm" variant="flat">New</Badge>
                      )}
                    </div>
                  </DropdownItem>
                ))
              )}
              
              <DropdownItem 
                key="all" 
                textValue="View all notifications" 
                className="text-primary" 
                showDivider
                onPress={onViewAllNotifications}
              >
                View all notifications
              </DropdownItem>
              <DropdownItem key="settings" textValue="Notification settings">
                Notification settings
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Button
                variant="light"
                endContent={<Icon icon="lucide:chevron-down" className="text-sm" />}
                startContent={
                  <Avatar
                    src="https://img.heroui.chat/image/avatar?w=200&h=200&u=1"
                    name="John Doe"
                    size="sm"
                  />
                }
              >
                John Doe
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="profile">My Profile</DropdownItem>
              <DropdownItem key="settings">Account Settings</DropdownItem>
              <DropdownItem key="billing">Billing</DropdownItem>
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
  );
};