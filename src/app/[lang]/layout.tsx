import { notFound } from "next/navigation";

import { ScrollJumpButtons } from "@/components/scroll-jump-buttons";
import { SiteHeader } from "@/components/site-header";
import { isSupportedLanguage, languages, type Language } from "@/lib/i18n";

export async function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export default async function LanguageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <SiteHeader lang={lang as Language} />
      <main className="mx-auto w-full max-w-5xl px-6 py-12">{children}</main>
      <ScrollJumpButtons />
    </div>
  );
}
