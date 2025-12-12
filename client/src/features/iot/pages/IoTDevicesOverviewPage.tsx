import Error from "@/components/shared/Error";
import Loading from "@/components/shared/Loading";
import type { Car } from "@/domain/types";
import { IoTLayout } from "../components/IoTLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIotDashboard } from "../hooks/useIotDashboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function IoTDevicesOverviewPage() {
  const { data, isLoading, error } = useIotDashboard();

  if (isLoading) return <Loading />;

  if (error || !data) return <Error error={error} />;

  const { cars, devices, alerts } = data;

  function getCarDeviceMetrics(car: Car) {
    const carDevices = devices.filter((d) => d.carId === car.id);
    const online = carDevices.filter((d) => d.status === "ONLINE").length;
    const offline = carDevices.filter((d) => d.status === "OFFLINE").length;
    const carAlerts = alerts.filter((a) => a.carId === car.id);
    const critical = carAlerts.filter((a) => a.severity === "CRITICAL").length;

    return {
      devices: carDevices,
      online,
      offline,
      totalAlerts: carAlerts.length,
      criticalAlerts: critical,
    };
  }

  const totalDevices = devices.length;
  const totalCars = cars.length;

  return (
    <IoTLayout>
      <div className="space-y-6">
        {/* Top stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="uppercase">Cars</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalCars}</p>
              <p className="text-sm text-slate-500">
                Connected autonomous cars
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="uppercase">IoT Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{totalDevices}</p>
              <p className="text-sm text-slate-500">
                Audio / Camera / Edge Devices
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="uppercase">
                Critical alerts (system)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-rose-600">
                {alerts.filter((a) => a.severity === "CRITICAL").length}
              </p>
              <p className="text-sm text-slate-500">
                Across all cars and devices
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Per-car devices table */}
        <Card>
          <CardHeader>
            <CardTitle>Devices by Car</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Card</TableHead>
                  <TableHead className="text-right">Devices</TableHead>
                  <TableHead className="text-right">Online</TableHead>
                  <TableHead className="text-right">Offline</TableHead>
                  <TableHead className="text-right">Alerts</TableHead>
                  <TableHead className="text-right">Critical</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => {
                  const {
                    devices: carDevices,
                    online,
                    offline,
                    totalAlerts,
                    criticalAlerts,
                  } = getCarDeviceMetrics(car);

                  return (
                    <TableRow key={car.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-900">
                            {car.make} {car.model}
                          </span>
                          <span className="text-sm text-slate-500">
                            VIN: {car.vin}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {carDevices.length}
                      </TableCell>
                      <TableCell className="text-right">{online}</TableCell>
                      <TableCell className="text-right">{offline}</TableCell>
                      <TableCell className="text-right">
                        {totalAlerts}
                      </TableCell>
                      <TableCell className="text-right text-rose-600">
                        {criticalAlerts}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </IoTLayout>
  );
}
