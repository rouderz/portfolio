export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en", { dateStyle: "long", timeZone: "UTC" }).format(date);
}
