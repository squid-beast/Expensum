import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { householdService } from "@/services/householdService";
import type { HouseholdDetail, HouseholdMember } from "@/types/household.types";

interface Props {
  householdId: number;
}

export default function MemberPresence({ householdId }: Props) {
  const [members, setMembers] = useState<HouseholdMember[]>([]);

  useEffect(() => {
    householdService
      .getDetail(householdId)
      .then((d: HouseholdDetail) => setMembers(d.members))
      .catch(() => {});
  }, [householdId]);

  if (members.length === 0) return null;

  return (
    <div className="flex items-center gap-1">
      {members.slice(0, 4).map((m, i) => (
        <motion.div
          key={m.userId}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          title={m.fullName}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary border-2 border-background -ml-1 first:ml-0"
        >
          {m.fullName.charAt(0).toUpperCase()}
        </motion.div>
      ))}
      {members.length > 4 && (
        <span className="ml-1 text-xs text-muted-foreground">
          +{members.length - 4}
        </span>
      )}
    </div>
  );
}
