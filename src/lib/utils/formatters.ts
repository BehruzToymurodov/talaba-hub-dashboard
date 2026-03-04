export function formatDate(date?: string | null) {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(date));
}

export function formatDateNumeric(date?: string | null) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" })
    .format(parsed)
    .replace(/\//g, "-");
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
