import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { siteCopy, type Language } from "@/lib/i18n";

type SiteHeaderProps = {
  lang: Language;
  pathname: string;
};

export function SiteHeader({ lang, pathname }: SiteHeaderProps) {
  const copy = siteCopy[lang];

  return (
    <header className="border-b border-zinc-200 bg-white/90">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-6 px-6 py-4">
        <div>
          <Link href={`/${lang}`} className="text-lg font-semibold tracking-tight">
            {copy.siteTitle}
          </Link>
          <p className="text-sm text-zinc-500">{copy.tagline}</p>
        </div>
        <nav className="flex items-center gap-3">
          <Link href={`/${lang}`} className="text-sm hover:text-zinc-900">
            {copy.homeLink}
          </Link>
          <Link href={`/${lang}/posts`} className="text-sm hover:text-zinc-900">
            {copy.postsLink}
          </Link>
          <LanguageSwitcher currentLanguage={lang} pathname={pathname} />
        </nav>
      </div>
    </header>
  );
}
