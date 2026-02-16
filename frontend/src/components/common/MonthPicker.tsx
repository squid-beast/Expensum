import { Button } from "@/ui/button";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

interface Props {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}

export default function MonthPicker({ month, year, onChange }: Props) {
  const now = new Date();
  const isCurrentMonth = month === now.getMonth() + 1 && year === now.getFullYear();

  const goBack = () => {
    if (month === 1) onChange(12, year - 1);
    else onChange(month - 1, year);
  };

  const goForward = () => {
    if (isCurrentMonth) return;
    if (month === 12) onChange(1, year + 1);
    else onChange(month + 1, year);
  };

  const goToday = () => {
    onChange(now.getMonth() + 1, now.getFullYear());
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={goBack}>
        &larr;
      </Button>
      <span className="text-sm font-medium min-w-[140px] text-center">
        {MONTH_NAMES[month - 1]} {year}
      </span>
      <Button variant="outline" size="sm" onClick={goForward} disabled={isCurrentMonth}>
        &rarr;
      </Button>
      {!isCurrentMonth && (
        <Button variant="ghost" size="sm" onClick={goToday} className="text-xs">
          Today
        </Button>
      )}
    </div>
  );
}
