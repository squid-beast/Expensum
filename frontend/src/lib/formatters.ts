import { useSettingsStore } from "@/store/settingsStore";

export function formatCurrency(amount: number, currency?: string): string {
  const code = currency ?? useSettingsStore.getState().currency;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** React hook — returns a formatter that re-renders when currency changes */
export function useFormatCurrency() {
  const currency = useSettingsStore((s) => s.currency);
  return (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
