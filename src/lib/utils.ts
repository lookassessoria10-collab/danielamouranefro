export const cn = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

export const pad2 = (n: number) => String(n).padStart(2, "0");

export function relativeDay(timestamp: number, now = Date.now()) {
  const day = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  if (timestamp >= startOfToday) return "hoje";
  if (timestamp >= startOfToday - day) return "ontem";
  const days = Math.ceil((startOfToday - timestamp) / day);
  if (days < 7) return `há ${days} dias`;
  return new Date(timestamp).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

export const pluralize = (count: number, singular: string, plural: string) =>
  `${count} ${count === 1 ? singular : plural}`;
