import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FloatingAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface FloatingActionMenuProps {
  actions: FloatingAction[];
}

export default function FloatingActionMenu({ actions }: FloatingActionMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* FAB trigger */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className={cn(
          "h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-colors cursor-pointer",
          open
            ? "bg-destructive text-destructive-foreground"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        <motion.div animate={{ rotate: open ? 135 : 0 }} transition={{ duration: 0.2 }}>
          {open ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
        </motion.div>
      </motion.button>

      {/* Action items */}
      <AnimatePresence>
        {open &&
          actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ delay: i * 0.05, duration: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="bg-card text-card-foreground text-sm font-medium px-3 py-1.5 rounded-lg shadow-md border border-border whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick();
                  setOpen(false);
                }}
                className={cn(
                  "h-11 w-11 rounded-full shadow-md flex items-center justify-center transition-colors cursor-pointer",
                  action.className ?? "bg-card text-card-foreground hover:bg-accent border border-border"
                )}
              >
                {action.icon}
              </button>
            </motion.div>
          ))}
      </AnimatePresence>
    </div>
  );
}
