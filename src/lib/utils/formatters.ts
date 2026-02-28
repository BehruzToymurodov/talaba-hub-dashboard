export function formatDate(date?: string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
}

export function formatDateTime(date?: string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}

export function formatDateRange(start?: string | null, end?: string | null) {
  if (!start || !end) return "-";
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function formatDiscountValue(percent?: number | null, amount?: number | null) {
  if (percent) return `${percent}%`;
  if (amount !== null && amount !== undefined) return `${amount}`;
  return "-";
}

export function getDomainFromEmail(email: string) {
  return email.split("@")[1] ?? "";
}
