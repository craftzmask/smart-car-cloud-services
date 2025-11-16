import React from "react";
import { Card, CardBody, CardHeader, CardFooter, Button, Chip, Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Car } from "../data/mock-data";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts";

interface CarOverviewProps {
  car: Car;
}

// Sample data for the charts
const batteryData = [
  { time: "00:00", value: 85 },
  { time: "04:00", value: 83 },
  { time: "08:00", value: 78 },
  { time: "12:00", value: 74 },
  { time: "16:00", value: 70 },
  { time: "20:00", value: 68 },
  { time: "Now", value: 65 },
];

const mileageData = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 240 },
  { month: "Mar", value: 380 },
  { month: "Apr", value: 490 },
  { month: "May", value: 630 },
  { month: "Jun", value: 720 },
  { month: "Jul", value: 850 },
];

export const CarOverview: React.FC<CarOverviewProps> = ({ car }) => {
  return (
    <div className="space-y-6">
      {/* Car Status Card */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Car Status</h2>
          <Button
            variant="flat"
            color="primary"
            size="sm"
            endContent={<Icon icon="lucide:arrow-right" />}
          >
            View Details
          </Button>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-3 gap-4">
            {/* Battery Status */}
            <div className="p-4 bg-content2 rounded-medium">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:battery-charging" className="text-success" />
                  <span className="font-medium">Battery</span>
                </div>
                <Chip color="success" variant="flat" size="sm">{car.battery}%</Chip>
              </div>
              <Progress 
                value={car.battery} 
                color="success"
                className="mb-2"
                showValueLabel={false}
              />
              <div className="flex justify-between text-xs text-foreground-500">
                <span>Range: {car.range} miles</span>
                <span>Charging: {car.charging ? "Yes" : "No"}</span>
              </div>
            </div>
            
            {/* Temperature */}
            <div className="p-4 bg-content2 rounded-medium">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:thermometer" className="text-primary" />
                  <span className="font-medium">Temperature</span>
                </div>
                <Chip color="primary" variant="flat" size="sm">{car.temperature}°F</Chip>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-col items-center">
                  <Icon icon="lucide:sun" className="text-warning mb-1" />
                  <span className="text-xs">Outside</span>
                  <span className="font-medium">{car.outsideTemp}°F</span>
                </div>
                <div className="flex flex-col items-center">
                  <Icon icon="lucide:car" className="text-primary mb-1" />
                  <span className="text-xs">Inside</span>
                  <span className="font-medium">{car.temperature}°F</span>
                </div>
                <div className="flex flex-col items-center">
                  <Icon icon="lucide:settings" className="text-default-500 mb-1" />
                  <span className="text-xs">Target</span>
                  <span className="font-medium">{car.targetTemp}°F</span>
                </div>
              </div>
            </div>
            
            {/* Security Status */}
            <div className="p-4 bg-content2 rounded-medium">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:shield-check" className="text-success" />
                  <span className="font-medium">Security</span>
                </div>
                <Chip color="success" variant="flat" size="sm">Secured</Chip>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:lock" className="text-success text-sm" />
                  <span className="text-xs">Doors Locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:bell" className="text-success text-sm" />
                  <span className="text-xs">Alarm Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:video" className="text-success text-sm" />
                  <span className="text-xs">Cameras On</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:wifi" className="text-success text-sm" />
                  <span className="text-xs">Connected</span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      {/* Charts Card */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Performance Metrics</h2>
          <div className="flex gap-2">
            <Button size="sm" variant="flat">Daily</Button>
            <Button size="sm" variant="flat">Weekly</Button>
            <Button size="sm" variant="flat" color="primary">Monthly</Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-6">
            {/* Battery Usage Chart */}
            <div>
              <h3 className="text-sm font-medium mb-2">Battery Usage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={batteryData}>
                    <defs>
                      <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--heroui-success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--heroui-success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                    <XAxis 
                      dataKey="time" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      domain={[50, 100]} 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Battery']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--heroui-content1))',
                        borderColor: 'hsl(var(--heroui-divider))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--heroui-success))" 
                      strokeWidth={2}
                      fill="url(#batteryGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Mileage Chart */}
            <div>
              <h3 className="text-sm font-medium mb-2">Monthly Mileage</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mileageData}>
                    <defs>
                      <linearGradient id="mileageGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--heroui-primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--heroui-divider))" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => `${value} mi`}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} miles`, 'Distance']}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--heroui-content1))',
                        borderColor: 'hsl(var(--heroui-divider))',
                        borderRadius: '8px',
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--heroui-primary))" 
                      strokeWidth={2}
                      fill="url(#mileageGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};