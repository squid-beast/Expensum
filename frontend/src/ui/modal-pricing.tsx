import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: "free",
    name: "Free / Basic",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with personal budgeting",
    icon: <Zap className="h-5 w-5" />,
    features: [
      "Unlimited personal expenses",
      "5 expense categories",
      "Monthly dashboard & charts",
      "CSV export",
      "1 household (up to 3 members)",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: "$19",
    period: "per month",
    description: "For power users and larger households",
    icon: <Sparkles className="h-5 w-5" />,
    popular: true,
    features: [
      "Everything in Free, plus:",
      "Unlimited categories",
      "Recurring expenses",
      "Advanced analytics & trends",
      "Unlimited households & members",
      "Priority support",
      "Custom budget alerts",
    ],
  },
];

interface ModalPricingProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ModalPricing({ open, onOpenChange }: ModalPricingProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("free");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Upgrade your plan</DialogTitle>
          <DialogDescription className="text-center">
            Choose the plan that works best for you and your household
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          {plans.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={cn(
                "relative rounded-xl border-2 p-5 cursor-pointer transition-colors",
                selectedPlan === plan.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <div className={cn(
                  "h-9 w-9 rounded-lg flex items-center justify-center",
                  plan.popular ? "bg-primary/10 text-primary" : "bg-secondary text-secondary-foreground"
                )}>
                  {plan.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                </div>
              </div>

              <div className="mb-3">
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">/ {plan.period}</span>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Maybe later
          </Button>
          <Button
            onClick={() => {
              // For now, just close — payment integration can be added later
              onOpenChange(false);
            }}
          >
            {selectedPlan === "premium" ? "Upgrade to Premium" : "Continue with Free"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
