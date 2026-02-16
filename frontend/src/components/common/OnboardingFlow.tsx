import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Wallet, Home, UserPlus, Receipt } from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import type { LucideIcon } from "lucide-react";

interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  route: string;
}

const steps: Step[] = [
  {
    icon: Wallet,
    title: "Set your income",
    description: "Enter your monthly income and savings goal to get started with budget tracking.",
    action: "Set up income",
    route: "/income-setup",
  },
  {
    icon: Home,
    title: "Create a household",
    description: "Set up a shared space to track expenses with your roommates.",
    action: "Create household",
    route: "/household",
  },
  {
    icon: UserPlus,
    title: "Invite your roommate",
    description: "Share an invite link so your roommate can join and start tracking together.",
    action: "Send invite",
    route: "/household",
  },
  {
    icon: Receipt,
    title: "Add your first expense",
    description: "Log a shared or personal expense to see your dashboard come alive.",
    action: "Add expense",
    route: "/expenses",
  },
];

interface Props {
  completedSteps?: number[];
  onDismiss: () => void;
}

export default function OnboardingFlow({ completedSteps = [], onDismiss }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  const nextStep = steps.findIndex((_, i) => !completedSteps.includes(i));
  const allDone = nextStep === -1;

  if (allDone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Getting started</p>
            <button
              onClick={() => { setDismissed(true); onDismiss(); }}
              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          <div className="flex gap-1.5 mb-4">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  completedSteps.includes(i) ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={nextStep}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                {(() => {
                  const StepIcon = steps[nextStep].icon;
                  return <StepIcon className="h-5 w-5 text-primary" />;
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{steps[nextStep].title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {steps[nextStep].description}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => navigate(steps[nextStep].route)}
                className="shrink-0 gap-1.5"
              >
                {steps[nextStep].action}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </AnimatePresence>

          {completedSteps.length > 0 && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <Check className="inline h-3 w-3 text-success mr-1" />
                {completedSteps.length} of {steps.length} steps completed
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
