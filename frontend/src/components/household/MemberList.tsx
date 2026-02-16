import { Crown, User } from "lucide-react";
import { Badge } from "@/ui/badge";
import type { HouseholdMember } from "@/types/household.types";

interface Props {
  members: HouseholdMember[];
}

export default function MemberList({ members }: Props) {
  return (
    <ul className="divide-y divide-border">
      {members.map((member) => (
        <li
          key={member.userId}
          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
              {member.role === "OWNER" ? (
                <Crown className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{member.fullName}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <Badge variant={member.role === "OWNER" ? "default" : "secondary"}>
            {member.role === "OWNER" ? "Owner" : "Member"}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
