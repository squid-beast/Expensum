import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItemProps {
  value: string;
  children: React.ReactNode;
}

interface AccordionContextType {
  openItem: string | null;
  toggle: (value: string) => void;
}

const AccordionContext = React.createContext<AccordionContextType>({
  openItem: null,
  toggle: () => {},
});

function Accordion({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [openItem, setOpenItem] = React.useState<string | null>(null);
  const toggle = (value: string) =>
    setOpenItem((prev) => (prev === value ? null : value));

  return (
    <AccordionContext.Provider value={{ openItem, toggle }}>
      <div className={cn("divide-y divide-border", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, children }: AccordionItemProps) {
  return <div data-value={value}>{children}</div>;
}

function AccordionTrigger({
  children,
  className,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) {
  const { openItem, toggle } = React.useContext(AccordionContext);
  const isOpen = openItem === value;

  return (
    <button
      type="button"
      onClick={() => toggle(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-all hover:underline cursor-pointer",
        className
      )}
      aria-expanded={isOpen}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  );
}

function AccordionContent({
  children,
  className,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  value: string;
}) {
  const { openItem } = React.useContext(AccordionContext);
  const isOpen = openItem === value;

  return (
    <div
      className={cn(
        "overflow-hidden text-sm transition-all duration-200",
        isOpen ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
