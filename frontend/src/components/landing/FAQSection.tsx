import { motion } from "framer-motion";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/ui/accordion";

const faqs = [
  {
    q: "Is this like Splitwise?",
    a: "Expensum focuses on ongoing shared budgeting rather than one-off expense splitting. You set monthly budgets, track spending in real time, and see where money is going across your household.",
  },
  {
    q: "Can both roommates add expenses?",
    a: "Yes. Every member in a household can log shared and personal expenses. All shared entries appear on the household dashboard for everyone to see.",
  },
  {
    q: "What is the difference between shared and personal expenses?",
    a: "Shared expenses are costs you split with your household, like rent or groceries. Personal expenses are yours alone and only visible to you.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export default function FAQSection() {
  return (
    <section className="bg-muted/40 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <motion.span
            className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            FAQ
          </motion.span>
          <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted-foreground">
            Everything you need to know about Expensum.
          </p>
        </motion.div>

        {/* Accordion items — staggered scroll reveal */}
        <div className="mt-10">
          <Accordion>
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-20px" }}
                custom={i}
              >
                <AccordionItem value={`faq-${i}`}>
                  <AccordionTrigger value={`faq-${i}`}>
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent value={`faq-${i}`}>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
