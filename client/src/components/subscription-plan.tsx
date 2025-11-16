import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Progress, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { Car } from "../data/mock-data";

interface SubscriptionPlanProps {
  car: Car;
  detailed?: boolean;
  onManage?: () => void; // Add optional callback for manage button
}

export const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({ 
  car, 
  detailed = false,
  onManage // Add the new prop
}) => {
  // Add state to track current plan (instead of using car.subscription.plan directly)
  const [currentPlan, setCurrentPlan] = React.useState(car.subscription.plan);
  
  // Remove selectedPlan state since we're switching immediately
  // const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);
  
  // Calculate days left in subscription
  const today = new Date();
  const nextBilling = new Date(car.subscription.nextBillingDate);
  const daysLeft = Math.ceil((nextBilling.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const totalDays = 30; // Assuming monthly subscription
  const progressPercentage = Math.max(0, Math.min(100, (daysLeft / totalDays) * 100));
  
  const planFeatures = {
    basic: [
      "Real-time location tracking",
      "Basic security alerts",
      "Mobile app access",
      "Monthly reports"
    ],
    premium: [
      "Real-time location tracking",
      "Advanced security alerts",
      "Mobile app access",
      "Weekly reports",
      "Remote car control",
      "Video recording (7 days storage)",
      "Premium customer support"
    ],
    ultimate: [
      "Real-time location tracking",
      "Advanced security alerts",
      "Mobile app access",
      "Daily reports",
      "Remote car control",
      "Video recording (30 days storage)",
      "Premium customer support",
      "Roadside assistance",
      "Insurance discounts",
      "Family sharing (up to 5 users)"
    ]
  };
  
  const planColor = {
    basic: "default",
    premium: "primary",
    ultimate: "secondary"
  } as const;
  
  const planIcon = {
    basic: "lucide:shield",
    premium: "lucide:shield-check",
    ultimate: "lucide:shield-alert"
  };
  
  // Update current plan color and icon based on state
  const currentPlanColor = planColor[currentPlan as keyof typeof planColor] || "default";
  const currentPlanIcon = planIcon[currentPlan as keyof typeof planIcon] || "lucide:shield";
  const currentPlanFeatures = planFeatures[currentPlan as keyof typeof planFeatures] || [];

  // Handle plan selection - immediately switch to the selected plan
  const handleSelectPlan = (plan: string) => {
    // Only switch if it's not already the current plan
    if (plan !== currentPlan) {
      setCurrentPlan(plan);
      // Show toast or notification that plan was changed
      // In a real app, this would call an API to update the subscription
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Account Subscription</h2>
        {!detailed && onManage && (
          <Button
            variant="flat"
            size="sm"
            endContent={<Icon icon="lucide:arrow-right" />}
            onPress={onManage}
          >
            Manage
          </Button>
        )}
      </CardHeader>
      <CardBody>
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-full bg-${currentPlanColor}/10 flex items-center justify-center`}>
            <Icon icon={currentPlanIcon} className={`text-${currentPlanColor}`} />
          </div>
          <div>
            <h3 className="font-medium capitalize">{currentPlan} Plan</h3>
            <p className="text-xs text-foreground-500">
              {currentPlan === "basic" ? "$9.99" : currentPlan === "premium" ? "$19.99" : "$29.99"}/month for all vehicles
            </p>
          </div>
          <Chip
            color="success"
            variant="flat"
            size="sm"
            className="ml-auto"
          >
            active
          </Chip>
        </div>
        
        {/* Vehicle count badge */}
        <div className="mb-4 bg-content2 p-3 rounded-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="lucide:car" className="text-primary" />
              <span className="font-medium">Vehicles on this plan</span>
            </div>
            <Chip color="primary" variant="flat">3 vehicles</Chip>
          </div>
        </div>
        
        {/* Billing cycle progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Current billing cycle</span>
            <span>{daysLeft} days left</span>
          </div>
          <Progress 
            value={progressPercentage} 
            color={currentPlanColor as any}
            className="mb-1"
            showValueLabel={false}
          />
          <div className="text-xs text-foreground-500">
            Next billing on {nextBilling.toLocaleDateString()}
          </div>
        </div>
        
        {/* Available plans */}
        {detailed && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Available Plans</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.keys(planFeatures).map((plan) => {
                const isPlanActive = plan === currentPlan;
                
                return (
                  <Card 
                    key={plan} 
                    className={`border ${isPlanActive ? 'border-primary' : 'border-divider'} 
                      ${isPlanActive ? 'bg-primary/5' : ''}`}
                  >
                    <CardBody className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon 
                          icon={planIcon[plan as keyof typeof planIcon]} 
                          className={`text-${planColor[plan as keyof typeof planColor]}`} 
                        />
                        <h4 className="font-medium capitalize">{plan}</h4>
                      </div>
                      <div className="mb-3">
                        {plan === "basic" && <span className="text-lg font-semibold">$9.99/mo</span>}
                        {plan === "premium" && <span className="text-lg font-semibold">$19.99/mo</span>}
                        {plan === "ultimate" && <span className="text-lg font-semibold">$29.99/mo</span>}
                      </div>
                      <ul className="text-xs space-y-1 mb-4">
                        {(planFeatures[plan as keyof typeof planFeatures] || []).slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <Icon icon="lucide:check" className="text-success text-xs" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {(planFeatures[plan as keyof typeof planFeatures] || []).length > 3 && (
                          <li className="text-foreground-500">
                            +{(planFeatures[plan as keyof typeof planFeatures] || []).length - 3} more features
                          </li>
                        )}
                      </ul>
                      <Button
                        color={isPlanActive ? "success" : "primary"}
                        variant={isPlanActive ? "flat" : "solid"}
                        fullWidth
                        size="sm"
                        onPress={() => handleSelectPlan(plan)}
                        startContent={isPlanActive ? <Icon icon="lucide:check" /> : null}
                      >
                        {isPlanActive ? "Current Plan" : "Select Plan"}
                      </Button>
                    </CardBody>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </CardBody>
      {detailed && (
        <CardFooter>
          <div className="w-full space-y-2">
            <div className="bg-content2 p-3 rounded-medium">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:info" className="text-primary" />
                  <span className="font-medium">Current Plan</span>
                </div>
                <span className="font-medium capitalize">{currentPlan}</span>
              </div>
            </div>
            <p className="text-xs text-foreground-500 text-center">
              Your plan changes take effect immediately. You'll be charged the prorated difference on your next billing date.
            </p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};