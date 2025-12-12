import { EmptyState } from "@/components/shared/EmptyState";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type {
  NotificationPreference,
  NotificationChannelKey,
  PlanId,
} from "@/domain/types";

interface OwnerNotificationPreferencesSectionProps {
  planId: PlanId;
  preferences: NotificationPreference[] | null | undefined;
  onToggleChannel: (channel: NotificationChannelKey, enabled: boolean) => void;
}

export function OwnerNotificationPreferencesSection({
  planId,
  preferences,
  onToggleChannel,
}: OwnerNotificationPreferencesSectionProps) {
  const safePreferences = Array.isArray(preferences) ? preferences : [];

  const filteredPreferences = safePreferences.filter((pref) => {
    if (planId === "PREMIUM") return true;

    if (planId === "STANDARD") {
      return pref.channel === "EMAIL" || pref.channel === "PUSH";
    }

    return pref.channel === "EMAIL";
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to receive alerts.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent>
        {safePreferences.length === 0 ? (
          <div className=" text-slate-500">
            No notification channels configured.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPreferences.map((pref) => (
              <Item variant="outline" className="bg-slate-50/60">
                <ItemContent>
                  <ItemTitle>{pref.label}</ItemTitle>
                  <ItemDescription>{pref.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={(checked) =>
                      onToggleChannel(pref.channel, checked)
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
