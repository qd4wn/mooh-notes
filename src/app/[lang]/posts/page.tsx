import { notFound } from "next/navigation";

import { PostCard } from "@/components/post-card";
import { isSupportedLanguage, siteCopy, type Language } from "@/lib/i18n";
import { getAllPosts } from "@/lib/posts";

export default async function PostsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  const typedLang = lang as Language;
  const copy = siteCopy[typedLang];
  const posts = await getAllPosts(typedLang);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">{copy.postsLink}</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
          {copy.allPosts}
        </h1>
      </div>
      <div className="grid gap-6">
        {posts.map((post) => (
          <PostCard
            key={`${post.lang}-${post.slug}`}
            lang={typedLang}
            post={post}
            readMoreLabel={copy.readMore}
          />
        ))}
      </div>
    </section>
  );
}
