import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { MemberSpending } from "@/types/household.types";

interface Props {
  members: MemberSpending[];
  fairShare: number;
}

export default function FairShareComparison({ members, fairShare }: Props) {
  const maxSpent = Math.max(...members.map((m) => m.amountSpent), fairShare, 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Fair Share Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {members.map((member, i) => {
          const overFair = member.difference > 0;
          const pct = (member.amountSpent / maxSpent) * 100;
          const fairPct = (fairShare / maxSpent) * 100;

          return (
            <motion.div
              key={member.userId}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{member.fullName}</span>
                <span className={overFair ? "text-destructive" : "text-success"}>
                  {overFair ? "+" : ""}
                  {formatCurrency(member.difference)} vs fair share
                </span>
              </div>
              <div className="relative h-3 rounded-full bg-muted overflow-hidden">
                {/* Fair share marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-foreground/30 z-10"
                  style={{ left: `${fairPct}%` }}
                />
                {/* Spending bar */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`h-full rounded-full ${
                    overFair ? "bg-destructive/70" : "bg-success/70"
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Spent: {formatCurrency(member.amountSpent)}</span>
                <span>Fair: {formatCurrency(fairShare)}</span>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
