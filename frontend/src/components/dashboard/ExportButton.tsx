import { useState } from "react";
import { Download } from "lucide-react";
import { dashboardService } from "@/services/dashboardService";
import { Button } from "@/ui/button";

interface Props {
  month: number;
  year: number;
  householdId?: number;
  type?: string;
}

export default function ExportButton({ month, year, householdId, type }: Props) {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await dashboardService.exportCsv(month, year, householdId, type);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="gap-1.5"
    >
      <Download className="h-3.5 w-3.5" />
      {loading ? "Exporting..." : "Export CSV"}
    </Button>
  );
}
