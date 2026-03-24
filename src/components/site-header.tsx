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
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <Link
            href={`/${lang}`}
            className="text-lg font-semibold tracking-tight text-zinc-950"
          >
            {copy.siteTitle}
          </Link>
          <p className="mt-1 max-w-xl text-sm leading-6 text-zinc-500">{copy.tagline}</p>
        </div>
        <nav className="flex items-center justify-between gap-3 rounded-full border border-zinc-200 bg-zinc-50/90 px-3 py-2 shadow-sm">
          <div className="flex items-center gap-1">
            <Link
              href={`/${lang}`}
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-zinc-950"
            >
              {copy.homeLink}
            </Link>
            <Link
              href={`/${lang}/posts`}
              className="rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-zinc-950"
            >
              {copy.postsLink}
            </Link>
          </div>
          <LanguageSwitcher currentLanguage={lang} pathname={pathname} />
        </nav>
      </div>
    </header>
  );
}
