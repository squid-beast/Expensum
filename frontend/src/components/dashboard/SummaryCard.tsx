import { motion } from "framer-motion";
import { Card, CardContent } from "@/ui/card";
import { useFormatCurrency } from "@/lib/formatters";
import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  delay?: number;
}

export default function SummaryCard({ title, value, icon: Icon, trend, delay = 0 }: SummaryCardProps) {
  const formatCurrency = useFormatCurrency();
  const trendColor =
    trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-4 w-4 text-primary" />
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className={`text-2xl font-bold ${trendColor === "text-muted-foreground" ? "" : trendColor}`}
          >
            {formatCurrency(value)}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
