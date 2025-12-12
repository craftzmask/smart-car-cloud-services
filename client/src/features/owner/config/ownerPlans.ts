import type { PlanId } from "@/domain/types";

export interface PlanOption {
  id: PlanId;
  name: string;
  pricePerMonth: number;
  description: string;
  features: string[];
}

export const OWNER_PLANS: PlanOption[] = [
  {
    id: "BASIC",
    name: "Basic",
    pricePerMonth: 9.99,
    description: "Essential monitoring for a single smart car.",
    features: ["Basic alert history", "Email notifications"],
  },
  {
    id: "STANDARD",
    name: "Standard",
    pricePerMonth: 19.99,
    description: "Enhanced safety features for daily driving.",
    features: ["Extended alert history", "Email + in-app notifications"],
  },
  {
    id: "PREMIUM",
    name: "Premium",
    pricePerMonth: 39.99,
    description: "Full intelligence suite for all your vehicles.",
    features: ["Full alert history", "Email + SMS + in-app notifications"],
  },
];
