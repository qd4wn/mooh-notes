"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { siteCopy, type Language } from "@/lib/i18n";

type SiteHeaderProps = {
  lang: Language;
};

export function SiteHeader({ lang }: SiteHeaderProps) {
  const copy = siteCopy[lang];
  const pathname = usePathname();
  const homeHref = `/${lang}`;
  const postsHref = `/${lang}/posts`;
  const isHomeActive = pathname === homeHref;
  const isPostsActive = pathname === postsHref || pathname.startsWith(`${postsHref}/`);

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
              href={homeHref}
              aria-current={isHomeActive ? "page" : undefined}
              className={
                isHomeActive
                  ? "rounded-full bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-950"
                  : "rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-zinc-950"
              }
            >
              {copy.homeLink}
            </Link>
            <Link
              href={postsHref}
              aria-current={isPostsActive ? "page" : undefined}
              className={
                isPostsActive
                  ? "rounded-full bg-zinc-200 px-3 py-2 text-sm font-medium text-zinc-950"
                  : "rounded-full px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-white hover:text-zinc-950"
              }
            >
              {copy.postsLink}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSwitcher currentLanguage={lang} pathname={pathname} />
            <a
              href="https://github.com/qd4wn/mooh-notes"
              target="_blank"
              rel="noreferrer"
              aria-label="View mooh-notes on GitHub"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-950"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4.5 w-4.5 fill-current"
              >
                <path d="M12 2C6.477 2 2 6.589 2 12.248c0 4.526 2.865 8.364 6.839 9.719.5.096.682-.223.682-.496 0-.245-.009-.894-.014-1.754-2.782.617-3.37-1.395-3.37-1.395-.454-1.18-1.11-1.494-1.11-1.494-.908-.637.069-.624.069-.624 1.004.072 1.532 1.054 1.532 1.054.892 1.57 2.341 1.116 2.91.854.091-.664.35-1.117.636-1.374-2.22-.26-4.555-1.142-4.555-5.084 0-1.123.39-2.042 1.03-2.762-.103-.262-.447-1.316.098-2.744 0 0 .84-.277 2.75 1.055A9.31 9.31 0 0 1 12 6.836a9.27 9.27 0 0 1 2.504.348c1.909-1.332 2.748-1.055 2.748-1.055.547 1.428.203 2.482.1 2.744.64.72 1.028 1.639 1.028 2.762 0 3.952-2.338 4.821-4.566 5.076.359.32.678.95.678 1.915 0 1.382-.012 2.498-.012 2.838 0 .276.18.597.688.495C19.138 20.608 22 16.772 22 12.248 22 6.589 17.523 2 12 2Z" />
              </svg>
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
