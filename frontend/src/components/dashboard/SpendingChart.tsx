import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { CategoryBreakdown } from "@/types/dashboard.types";

const COLORS = [
  "#6366f1", "#ec4899", "#10b981", "#f59e0b",
  "#06b6d4", "#8b5cf6", "#f43f5e", "#14b8a6",
  "#f97316", "#64748b",
];

interface Props {
  data: CategoryBreakdown[];
}

export default function SpendingChart({ data }: Props) {
  const total = data.reduce((sum, cat) => sum + cat.amount, 0);

  // Simple donut chart using SVG
  let cumulativePercent = 0;
  const segments = data.map((cat, i) => {
    const pct = total > 0 ? (cat.amount / total) * 100 : 0;
    const startAngle = cumulativePercent * 3.6;
    cumulativePercent += pct;
    const endAngle = cumulativePercent * 3.6;
    return { ...cat, pct, startAngle, endAngle, color: COLORS[i % COLORS.length] };
  });

  const polarToCartesian = (angle: number, radius: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: 100 + radius * Math.cos(rad), y: 100 + radius * Math.sin(rad) };
  };

  const describeArc = (startAngle: number, endAngle: number, radius: number) => {
    const start = polarToCartesian(endAngle, radius);
    const end = polarToCartesian(startAngle, radius);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg">Spending Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Add expenses to see distribution
            </p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <svg viewBox="0 0 200 200" className="w-48 h-48">
                {segments.map((seg, i) => (
                  <motion.path
                    key={i}
                    d={describeArc(seg.startAngle, Math.max(seg.endAngle - 1, seg.startAngle + 0.5), 80)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="24"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                  />
                ))}
                <text x="100" y="95" textAnchor="middle" className="fill-foreground text-sm font-bold" fontSize="16">
                  {formatCurrency(total)}
                </text>
                <text x="100" y="115" textAnchor="middle" className="fill-muted-foreground" fontSize="10">
                  Total Spent
                </text>
              </svg>

              <div className="grid grid-cols-2 gap-2 w-full">
                {segments.slice(0, 6).map((seg, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="truncate text-muted-foreground">{seg.categoryName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
