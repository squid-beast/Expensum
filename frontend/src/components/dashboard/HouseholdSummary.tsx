import { motion } from "framer-motion";
import { Users, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { Card, CardContent } from "@/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { HouseholdDashboardSummary } from "@/types/household.types";

interface Props {
  data: HouseholdDashboardSummary;
}

const cards = [
  {
    key: "total" as const,
    label: "Total Household Spent",
    icon: DollarSign,
    getValue: (d: HouseholdDashboardSummary) => formatCurrency(d.totalHouseholdSpent),
  },
  {
    key: "fair" as const,
    label: "Fair Share / Member",
    icon: Users,
    getValue: (d: HouseholdDashboardSummary) => formatCurrency(d.fairSharePerMember),
  },
  {
    key: "daily" as const,
    label: "Daily Average",
    icon: TrendingUp,
    getValue: (d: HouseholdDashboardSummary) => formatCurrency(d.dailyAverage),
  },
  {
    key: "projected" as const,
    label: "Projected Spend",
    icon: Calendar,
    getValue: (d: HouseholdDashboardSummary) => formatCurrency(d.projectedSpend),
  },
];

export default function HouseholdSummary({ data }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <card.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-medium text-muted-foreground">{card.label}</p>
              </div>
              <p className="text-xl font-bold">{card.getValue(data)}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
