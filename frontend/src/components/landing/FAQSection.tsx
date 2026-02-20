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
  {
    q: "Do you store bank data or connect to my bank?",
    a: "No. Expensum does not connect to bank accounts or store any financial credentials. You manually log expenses, keeping you in full control of your data.",
  },
  {
    q: "Can I cancel Premium anytime?",
    a: "Yes. You can cancel your Premium subscription at any time. There are no cancellation fees or lock-in periods.",
  },
  {
    q: "How do invites work?",
    a: "When you create a household, you get a unique invite link. Share it with your roommate and they can join your household with one click after signing up.",
  },
  {
    q: "Is my data private?",
    a: "Your personal expenses are visible only to you. Shared household expenses are visible to household members. We do not sell or share your data with third parties.",
  },
];

export default function FAQSection() {
  return (
    <section className="bg-muted/40 px-4 py-16 md:py-24">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
          Frequently asked questions
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-muted-foreground">
          Everything you need to know about Expensum.
        </p>

        <div className="mt-10">
          <Accordion>
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger value={`faq-${i}`}>{faq.q}</AccordionTrigger>
                <AccordionContent value={`faq-${i}`}>
                  <p className="text-muted-foreground">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
