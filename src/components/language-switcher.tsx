"use client";

import { useRouter } from "next/navigation";

import { languageLabels, type Language } from "@/lib/i18n";

type LanguageSwitcherProps = {
  currentLanguage: Language;
  pathname: string;
  availableLanguages?: Language[];
};

export function LanguageSwitcher({
  currentLanguage,
  pathname,
  availableLanguages,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const languages = availableLanguages ?? (["zh", "en"] as const);
  const suffix = pathname.replace(`/${currentLanguage}`, "") || "";

  return (
    <label className="flex items-center gap-2 text-sm text-zinc-500">
      <select
        value={currentLanguage}
        onChange={(event) => {
          router.push(`/${event.target.value}${suffix}`);
        }}
        className="rounded-full border border-zinc-300 bg-white px-3 py-1 text-sm text-zinc-700 outline-none transition focus:border-zinc-900"
      >
        {languages.map((language) => (
          <option key={language} value={language}>
            {languageLabels[language]}
          </option>
        ))}
      </select>
    </label>
  );
}
