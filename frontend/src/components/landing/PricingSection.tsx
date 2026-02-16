import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { buttonVariants } from "@/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Basic",
    price: "Free",
    period: "",
    popular: false,
    features: [
      "1 household workspace",
      "Up to 2 members",
      "Shared and personal expenses",
      "Monthly summary dashboard",
      "Overspending alerts (basic)",
    ],
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    popular: true,
    features: [
      "Multiple households",
      "Unlimited members per household",
      "Advanced insights (spend trends, projections)",
      "Export (CSV/PDF)",
      "Custom categories & budgets",
      "Recurring expenses",
      "Priority support",
    ],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          Simple pricing
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
          Start free. Upgrade when you need more.
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 md:grid-cols-2 md:gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="relative"
            >
              <Card className={plan.popular ? "border-primary shadow-md" : ""}>
                {plan.popular && (
                  <div className="absolute -top-3 left-4">
                    <Badge>Most popular</Badge>
                  </div>
                )}
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={cn(
                      buttonVariants({
                        variant: plan.popular ? "default" : "outline",
                      }),
                      "w-full"
                    )}
                  >
                    {plan.popular ? "Get Premium" : "Get started free"}
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
