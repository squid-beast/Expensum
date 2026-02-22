import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { buttonVariants } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { Badge } from "@/ui/badge";
import { cn } from "@/lib/utils";

/* ── animation variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const floatCard = (delay: number, x: number, y: number) => ({
  hidden: { opacity: 0, x, y, scale: 0.92 },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
});


const barGrow = (width: string, delay: number) => ({
  hidden: { width: "0%" },
  visible: {
    width,
    transition: { delay, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
});

const headingLines = [
  { highlight: "Stay", text: " aligned." },
  { highlight: "Spot", text: " overspending." },
  { highlight: "Avoid", text: " money confusion." },
];

export default function HeroSection() {
  return (
    <section id="hero-section" className="overflow-hidden px-4 pb-16 pt-16 md:pt-24 md:pb-28">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-16">
          {/* ── Copy ── */}
          <div className="space-y-6">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl">
              {headingLines.map((line, i) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      delay: 0.1 + i * 0.15,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94] as const,
                    }}
                  >
                    <span className="text-primary">{line.highlight}</span>
                    {line.text}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              className="max-w-sm text-base text-muted-foreground md:text-lg"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              Simplify shared expenses with your roommates and take control with
              confidence.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-3"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={4}
            >
              <Link
                to="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8"
                )}
              >
                Get started
              </Link>
            </motion.div>
          </div>

          {/* ── Floating preview widgets ── */}
          <div className="relative min-h-[340px] sm:min-h-[380px] md:min-h-[440px]">
            {/* Main card — Top spending */}
            <motion.div
              className="absolute left-1/2 top-1/2 z-10 w-56 sm:w-64 -translate-x-1/2 -translate-y-1/2 md:w-72"
              variants={floatCard(0.5, 0, 40)}
              initial="hidden"
              animate="visible"
            >
              <Card className="shadow-xl shadow-black/5">
                <CardContent className="space-y-3 p-5">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Top spending
                  </p>
                  <motion.p
                    className="text-2xl font-bold"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0, duration: 0.4 }}
                  >
                    $1,240
                  </motion.p>
                  <div className="space-y-2">
                    {[
                      { name: "Groceries", amount: "$210", pct: "45%", color: "bg-primary", delay: 1.1 },
                      { name: "Rent", amount: "$190", pct: "38%", color: "bg-primary/70", delay: 1.25 },
                      { name: "Utilities", amount: "$120", pct: "24%", color: "bg-primary/40", delay: 1.4 },
                    ].map((cat) => (
                      <div key={cat.name} className="flex items-center gap-2.5">
                        <span className="w-16 text-xs text-foreground">
                          {cat.name}
                        </span>
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={cn("h-full rounded-full", cat.color)}
                            variants={barGrow(cat.pct, cat.delay)}
                            initial="hidden"
                            animate="visible"
                          />
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                          {cat.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Budget remaining — top-right */}
            <motion.div
              className="absolute -right-2 top-0 z-20 w-48 md:right-0 md:w-52"
              variants={floatCard(0.7, 30, -20)}
              initial="hidden"
              animate="visible"
            >
              <Card className="shadow-lg shadow-black/5">
                <CardContent className="p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Monthly budget
                  </p>
                  <p className="mt-1 text-xl font-bold">$2,000</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      variants={barGrow("62%", 1.3)}
                      initial="hidden"
                      animate="visible"
                    />
                  </div>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    62% remaining
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Shared vs Personal — bottom-left */}
            <motion.div
              className="absolute -left-2 bottom-0 z-20 md:left-0"
              variants={floatCard(0.9, -30, 20)}
              initial="hidden"
              animate="visible"
            >
              <Card className="shadow-lg shadow-black/5">
                <CardContent className="flex gap-3 p-4">
                  <div className="rounded-lg bg-primary/10 px-4 py-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground">Shared</p>
                    <p className="text-base font-bold">$480</p>
                  </div>
                  <div className="rounded-lg bg-muted px-4 py-2.5 text-center">
                    <p className="text-[10px] text-muted-foreground">Personal</p>
                    <p className="text-base font-bold">$280</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Badge — Groceries (top-left) */}
            <motion.div
              className="absolute left-4 top-8 z-20 md:left-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <Badge className="shadow-md px-3 py-1.5 text-xs">
                Groceries
              </Badge>
            </motion.div>

            {/* Badge — Over budget (bottom-right) */}
            <motion.div
              className="absolute bottom-12 right-2 z-20 md:right-4"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4, duration: 0.4, type: "spring", stiffness: 200 }}
            >
              <Badge variant="warning" className="shadow-md px-3 py-1.5 text-xs">
                Over budget
              </Badge>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
