import { motion } from "framer-motion";
import { Card, CardContent } from "@/ui/card";
import { useFormatCurrency } from "@/lib/formatters";
import type { MemberSpending } from "@/types/household.types";

interface Props {
  members: MemberSpending[];
  currentUserId: number | undefined;
}

export default function ContributionComparison({ members, currentUserId }: Props) {
  const formatCurrency = useFormatCurrency();
  if (members.length < 2) return null;

  const you = members.find((m) => m.userId === currentUserId);
  const others = members.filter((m) => m.userId !== currentUserId);

  if (!you) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.35 }}
    >
      <Card>
        <CardContent className="p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Contributions this month
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">You</span>
              <span className="text-sm font-semibold">{formatCurrency(you.amountSpent)}</span>
            </div>
            {others.map((m) => (
              <div key={m.userId} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{m.fullName}</span>
                <span className="text-sm font-semibold">{formatCurrency(m.amountSpent)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
