import Link from "next/link";

import type { Language } from "@/lib/i18n";
import { formatDisplayDate } from "@/lib/date";
import type { Post } from "@/lib/posts";

type PostCardProps = {
  lang: Language;
  post: Post;
  updatedAtLabel: string;
};

export function PostCard({ lang, post, updatedAtLabel }: PostCardProps) {
  const updatedAt = formatDisplayDate(post.updatedAt, lang);

  return (
    <article className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-zinc-500">
        {updatedAtLabel}: {updatedAt}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
        <Link href={`/${lang}/posts/${post.slug}`}>{post.title}</Link>
      </h2>
      <p className="mt-3 text-base leading-7 text-zinc-600">{post.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700"
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}
