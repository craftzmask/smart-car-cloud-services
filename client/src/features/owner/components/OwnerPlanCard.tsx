import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { OwnerSubscription } from "@/domain/types";
import { formatDate } from "@/utils";

interface OwnerPlanCardProps {
  subscription: OwnerSubscription | null | undefined;
  onUpgrade?: () => void;
}

export function OwnerPlanCard({ subscription, onUpgrade }: OwnerPlanCardProps) {
  const hasSub = Boolean(subscription);
  const planName = hasSub ? subscription!.planName : "Unknown plan";
  const priceNumber = hasSub ? Number(subscription!.pricePerMonth) : NaN;
  const priceText = Number.isFinite(priceNumber)
    ? priceNumber.toFixed(2)
    : "N/A";
  const renewalText =
    hasSub && subscription!.renewalDate
      ? formatDate(subscription!.renewalDate)
      : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan & Billing</CardTitle>
        <CardDescription>
          Manage your smart surveillance subscription.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Current plan</p>
          <p className="font-medium">{planName}</p>
        </div>
        <div>
          <p className="text-slate-500">Price</p>
          <p className="font-medium">
            {hasSub ? `${priceText}/month` : "No subscription data available"}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Renews on</p>
          <p className="font-medium">{renewalText}</p>
        </div>
      </CardContent>
      <Separator />
      <CardFooter>
        <Button className="ml-auto" onClick={onUpgrade}>
          Upgrade plan
        </Button>
      </CardFooter>
    </Card>
  );
}
