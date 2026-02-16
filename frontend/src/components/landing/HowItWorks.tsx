import { motion } from "framer-motion";
import { Home, UserPlus, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/ui/card";

const steps = [
  {
    icon: Home,
    title: "Create a household",
    description:
      "Set up your shared space in seconds. Name your household and configure a monthly budget.",
  },
  {
    icon: UserPlus,
    title: "Invite your roommate",
    description:
      "Share an invite link or send a direct invitation. They join with one click.",
  },
  {
    icon: BarChart3,
    title: "Track and get insights",
    description:
      "Log shared and personal expenses, see category breakdowns, and catch overspending early.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HowItWorks() {
  return (
    <section className="bg-muted/40 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          How it works
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
          Three steps to better shared budgeting.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              custom={i}
            >
              <Card className="h-full">
                <CardContent className="flex flex-col items-start gap-3 p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </div>
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
