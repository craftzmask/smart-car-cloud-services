import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Switch } from "@/components/ui/switch";
import type { CarServiceConfig, IntelligenceServiceKey } from "@/domain/types";

interface OwnerServiceConfigSectionProps {
  carId: string;
  configs: CarServiceConfig[];
  onToggleService: (
    carId: string,
    key: IntelligenceServiceKey,
    enabled: boolean
  ) => void;
}

export function OwnerServiceConfigSection({
  carId,
  configs,
  onToggleService,
}: OwnerServiceConfigSectionProps) {
  const configForCar = configs.find((config) => config.carId === carId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligence Services</CardTitle>
        <CardDescription>
          Enable or disable audio intelligence services for this vehicle.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!configForCar || configForCar.services.length === 0 ? (
          <div className="text-slate-500">
            No intelligence services configured for this car.
          </div>
        ) : (
          <div className="space-y-4">
            {configForCar.services.map((service) => (
              <Item variant="outline" className="bg-slate-50/60">
                <ItemContent>
                  <ItemTitle>{service.label}</ItemTitle>
                  <ItemDescription>{service.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={service.enabled}
                    onCheckedChange={(checked) =>
                      onToggleService(carId, service.key, checked)
                    }
                  />
                </ItemActions>
              </Item>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
