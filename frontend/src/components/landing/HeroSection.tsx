import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { buttonVariants } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function HeroSection() {
  return (
    <section className="px-4 pb-16 pt-12 md:pt-20 md:pb-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-12">
          {/* Copy */}
          <div className="space-y-6">
            <motion.h1
              className="text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              A shared budgeting workspace for roommates to track expenses, spot
              overspending, and stay aligned.
            </motion.h1>

            <motion.p
              className="max-w-md text-base text-muted-foreground md:text-lg"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              Create a household, invite your roommates, and manage shared and
              personal spending in one clean dashboard.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              <Link
                to="/signup"
                className={cn(buttonVariants({ size: "lg" }))}
              >
                Get started free
              </Link>
              <a
                href="#pricing"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" })
                )}
              >
                View pricing
              </a>
            </motion.div>
          </div>

          {/* Product preview card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
          >
            <Card className="overflow-hidden">
              <CardContent className="space-y-5 p-5">
                {/* Budget remaining */}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Monthly budget remaining
                  </p>
                  <p className="mt-1 text-3xl font-bold text-foreground">
                    $1,240
                  </p>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: "62%" }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    62% of $2,000 remaining
                  </p>
                </div>

                {/* Shared vs personal */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Shared</p>
                    <p className="mt-0.5 text-lg font-semibold">$480</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Personal</p>
                    <p className="mt-0.5 text-lg font-semibold">$280</p>
                  </div>
                </div>

                {/* Top categories */}
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Top categories
                  </p>
                  {[
                    { name: "Groceries", amount: "$210", pct: 28 },
                    { name: "Rent", amount: "$190", pct: 25 },
                    { name: "Utilities", amount: "$120", pct: 16 },
                  ].map((cat) => (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span className="w-20 text-sm text-foreground">
                        {cat.name}
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary/70"
                          style={{ width: `${cat.pct}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {cat.amount}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
