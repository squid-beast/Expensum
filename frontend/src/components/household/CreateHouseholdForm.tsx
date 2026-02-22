import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { householdService } from "@/services/householdService";
import { useHouseholdStore } from "@/store/householdStore";

interface Props {
  onCreated: () => void;
}

export default function CreateHouseholdForm({ onCreated }: Props) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setActiveHousehold = useHouseholdStore((s) => s.setActiveHousehold);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError("");
    try {
      const household = await householdService.create({
        name: name.trim(),
        ...(budget ? { monthlyBudget: parseFloat(budget) } : {}),
      });
      setActiveHousehold(household);
      setName("");
      setBudget("");
      onCreated();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create household";
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
        <Label htmlFor="household-name">Household name</Label>
        <Input
          id="household-name"
          placeholder="e.g. 42 Oak Street"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="household-budget">Monthly budget</Label>
        <Input
          id="household-budget"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="e.g. 3000"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Set a monthly spending target for the household (optional)
        </p>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <Button type="submit" disabled={loading || !name.trim()}>
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        Create household
      </Button>
    </motion.form>
  );
}
