import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell } from "lucide-react";
import { householdService } from "@/services/householdService";
import type { Invitation } from "@/types/household.types";

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    householdService
      .getPendingInvitations()
      .then(setInvitations)
      .catch(() => {});
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const count = invitations.length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-md hover:bg-muted transition-colors cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
            {count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-2 w-72 rounded-lg border border-border bg-card shadow-lg z-50"
          >
            <div className="p-3 border-b border-border">
              <p className="text-sm font-semibold">Notifications</p>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {invitations.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No new notifications
                </p>
              ) : (
                invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="px-3 py-2.5 border-b border-border last:border-0 hover:bg-muted/50"
                  >
                    <p className="text-sm">
                      <span className="font-medium">{inv.inviterName}</span> invited you
                      to join{" "}
                      <span className="font-medium">{inv.householdName}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Pending invitation
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
