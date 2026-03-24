import type { Language } from "@/lib/i18n";

export function formatDisplayDate(date: string, lang: Language) {
  const formatter = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: lang === "zh" ? "long" : "short",
    day: "numeric",
  });

  return formatter.format(new Date(date));
}
