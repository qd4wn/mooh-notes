import { notFound } from "next/navigation";

import { PostCard } from "@/components/post-card";
import { isSupportedLanguage, siteCopy, type Language } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // App Router 在当前版本里通过异步 params 提供动态路由参数。
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  const typedLang = lang as Language;
  const copy = siteCopy[typedLang];
  // 首页笔记列表直接从内容层读取，页面本身只负责组织展示。
  const posts = await getAllPosts(typedLang);

  return (
    <div className="space-y-12">
      <section className="rounded-4xl bg-white p-8 shadow-sm ring-1 ring-zinc-200">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          {copy.tagline}
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950">
          {copy.siteTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
          {copy.intro}
        </p>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">
            {copy.latestPosts}
          </h2>
          <a
            href={`/${typedLang}/posts`}
            className="text-sm text-zinc-500 hover:text-zinc-900"
          >
            {copy.allPosts}
          </a>
        </div>
        <div className="grid gap-6">
          {posts.map((post) => (
            <PostCard
              key={`${post.lang}-${post.slug}`}
              lang={typedLang}
              post={post}
              readMoreLabel={copy.readMore}
              createdAtLabel={copy.createdAtLabel}
              updatedAtLabel={copy.updatedAtLabel}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
