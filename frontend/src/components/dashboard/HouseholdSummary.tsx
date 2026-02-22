import { motion } from "framer-motion";
import { Wallet, DollarSign, PiggyBank, Users } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { useFormatCurrency } from "@/lib/formatters";
import type { HouseholdDashboardSummary } from "@/types/household.types";

interface Props {
  data: HouseholdDashboardSummary;
}

export default function HouseholdSummary({ data }: Props) {
  const formatCurrency = useFormatCurrency();
  const hasBudget = data.monthlyBudget != null && data.monthlyBudget > 0;

  const cards = [
    {
      key: "total",
      label: "Total Spent",
      icon: DollarSign,
      value: formatCurrency(data.totalHouseholdSpent),
      color: "",
    },
    {
      key: "budget",
      label: "Household Budget",
      icon: Wallet,
      value: hasBudget ? formatCurrency(data.monthlyBudget!) : "Not set",
      color: "",
    },
    {
      key: "remaining",
      label: "Remaining",
      icon: PiggyBank,
      value: hasBudget ? formatCurrency(data.remaining) : "—",
      color: hasBudget
        ? data.remaining >= 0
          ? "text-success"
          : "text-destructive"
        : "",
    },
    {
      key: "perMember",
      label: "Budget / Member",
      icon: Users,
      value: hasBudget ? formatCurrency(data.budgetPerMember) : "—",
      color: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <card.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground leading-tight">{card.label}</p>
              </div>
              <p className={`text-lg sm:text-xl font-bold tabular-nums truncate ${card.color}`}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
