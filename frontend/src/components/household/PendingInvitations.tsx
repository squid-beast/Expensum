import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Loader2, Mail } from "lucide-react";
import { Button } from "@/ui/button";
import { Card, CardContent } from "@/ui/card";
import { householdService } from "@/services/householdService";
import type { Invitation } from "@/types/household.types";

interface Props {
  invitations: Invitation[];
  onUpdate: () => void;
}

export default function PendingInvitations({ invitations, onUpdate }: Props) {
  const [loadingToken, setLoadingToken] = useState<string | null>(null);

  const handleAction = async (token: string, action: "accept" | "decline") => {
    setLoadingToken(token);
    try {
      if (action === "accept") {
        await householdService.acceptInvitation(token);
      } else {
        await householdService.declineInvitation(token);
      }
      onUpdate();
    } catch {
      // silently fail — parent will re-fetch
    } finally {
      setLoadingToken(null);
    }
  };

  if (invitations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Mail className="h-4 w-4 text-primary" />
        Pending invitations
      </div>
      <AnimatePresence mode="popLayout">
        {invitations.map((inv) => (
          <motion.div
            key={inv.token}
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardContent className="p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {inv.householdName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Invited by {inv.inviterName}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAction(inv.token, "decline")}
                    disabled={loadingToken === inv.token}
                  >
                    {loadingToken === inv.token ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAction(inv.token, "accept")}
                    disabled={loadingToken === inv.token}
                  >
                    {loadingToken === inv.token ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
