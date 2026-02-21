import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, UserPlus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Home,
    title: "Create your household",
    description:
      "Set up your shared space in seconds. Name your household and configure a monthly budget that works for everyone.",
  },
  {
    icon: UserPlus,
    title: "Invite your roommates",
    description:
      "Share an invite link or send a direct invitation. They join with one click — no sign-up friction.",
  },
  {
    icon: BarChart3,
    title: "Track & get insights",
    description:
      "Log shared and personal expenses, see category breakdowns, and catch overspending before it becomes a problem.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.3 + i * 0.25,
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

function AnimatedLine({ index }: { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="absolute left-6 top-0 w-px origin-top bg-primary/20 md:left-8"
      style={{ height: "100%" }}
      initial={{ scaleY: 0 }}
      animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
      transition={{
        delay: 0.4 + index * 0.25,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      }}
    />
  );
}

function StepCircle({ index }: { index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 md:h-16 md:w-16 md:text-xl"
      initial={{ scale: 0, rotate: -180 }}
      animate={
        isInView
          ? { scale: 1, rotate: 0 }
          : { scale: 0, rotate: -180 }
      }
      transition={{
        delay: 0.2 + index * 0.25,
        duration: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
    >
      {index + 1}
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          custom={0}
        >
          <motion.span
            className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            How it works
          </motion.span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
            Get started in three steps
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            From setup to insights in under a minute. No credit card, no
            complexity.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative mt-16">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={cn(
                "relative flex gap-6 md:gap-8",
                i < steps.length - 1 && "pb-14"
              )}
            >
              {/* Animated connecting line between steps */}
              {i < steps.length - 1 && <AnimatedLine index={i} />}

              {/* Number circle with spring animation */}
              <StepCircle index={i} />

              {/* Content — slides in from left */}
              <motion.div
                className="flex-1 pt-1 md:pt-3"
                variants={slideInLeft}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
              >
                <div className="mb-2 flex items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, rotate: -90 }}
                    whileInView={{ opacity: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.5 + i * 0.25,
                      duration: 0.4,
                      type: "spring",
                    }}
                  >
                    <step.icon className="h-4 w-4 text-primary" />
                  </motion.div>
                  <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold md:text-xl">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {step.description}
                </p>
              </motion.div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
