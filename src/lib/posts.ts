import "server-only";

import type { ComponentType } from "react";

import type { Language } from "@/lib/i18n";
import type { TocItem } from "@/content/posts";
import { postRegistry } from "@/content/posts";

export type Post = {
  slug: string;
  lang: Language;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  toc: TocItem[];
  Content: ComponentType;
};

function readPost(slug: string, lang: Language): Post | null {
  const postModule = postRegistry[slug as keyof typeof postRegistry]?.[lang];

  if (!postModule) {
    return null;
  }

  return {
    slug,
    lang,
    title: postModule.metadata.title,
    summary: postModule.metadata.summary,
    date: postModule.metadata.date,
    tags: postModule.metadata.tags,
    toc: postModule.metadata.toc,
    Content: postModule.default,
  };
}

export async function getAllPosts(lang: Language): Promise<Post[]> {
  const slugs = Object.keys(postRegistry);
  const posts = slugs.map((slug) => readPost(slug, lang));

  return posts
    .filter((post): post is Post => post !== null)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string, lang: Language): Promise<Post | null> {
  return readPost(slug, lang);
}

export async function getAvailablePostLanguages(slug: string): Promise<Language[]> {
  const languages: Language[] = [];

  for (const lang of ["zh", "en"] as const) {
    const post = readPost(slug, lang);

    if (post) {
      languages.push(lang);
    }
  }

  return languages;
}

export async function getPostSlugs(): Promise<string[]> {
  return Object.keys(postRegistry);
}
