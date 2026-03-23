import Link from "next/link";
import { notFound } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { TableOfContents } from "@/components/table-of-contents";
import { isSupportedLanguage, siteCopy, type Language } from "@/lib/i18n";
import { getAvailablePostLanguages, getPost, getPostSlugs } from "@/lib/posts";

export async function generateStaticParams() {
  const slugs = await getPostSlugs();

  return slugs.flatMap((slug) => [
    { lang: "zh", slug },
    { lang: "en", slug },
  ]);
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  const typedLang = lang as Language;
  const copy = siteCopy[typedLang];
  const post = await getPost(slug, typedLang);

  if (!post) {
    notFound();
  }

  const availableLanguages = await getAvailablePostLanguages(slug);
  const Content = post.Content;

  return (
    <article className="space-y-8">
      <div className="space-y-4">
        <Link href={`/${typedLang}/posts`} className="text-sm text-zinc-500 hover:text-zinc-900">
          {copy.backToPosts}
        </Link>
        <p className="text-sm text-zinc-500">{post.date}</p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">{post.title}</h1>
        <p className="max-w-3xl text-lg leading-8 text-zinc-600">{post.summary}</p>
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500">{copy.translations}</span>
          <LanguageSwitcher
            currentLanguage={typedLang}
            pathname={`/${typedLang}/posts/${slug}`}
            availableLanguages={availableLanguages}
          />
        </div>
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm ring-1 ring-zinc-200">
          <Content />
        </div>
        <TableOfContents items={post.toc} />
      </div>
    </article>
  );
}
