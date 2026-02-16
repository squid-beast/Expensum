import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, Check } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { householdService } from "@/services/householdService";

interface Props {
  householdId: number;
}

export default function InviteMemberForm({ householdId }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      await householdService.invite(householdId, { email: email.trim() });
      setSuccess(true);
      setEmail("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to send invitation";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label htmlFor="invite-email">Invite by email</Label>
        <div className="flex gap-2">
          <Input
            id="invite-email"
            type="email"
            placeholder="roommate@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading || !email.trim()} size="default">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : success ? (
              <Check className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && (
        <p className="text-sm text-success">Invitation sent successfully</p>
      )}
    </motion.form>
  );
}
