import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import type { Language } from "@/lib/i18n";
import type { TocItem } from "@/lib/post-types";

const postsRoot = path.join(process.cwd(), "src", "content", "posts");

export type Post = {
  slug: string;
  lang: Language;
  title: string;
  summary: string;
  date: string;
  tags: string[];
  toc: TocItem[];
  content: string;
};

type PostFrontmatter = {
  title: string;
  summary: string;
  date: string | Date;
  tags?: string[];
};

function normalizeDate(value: string | Date) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return value;
}

function slugifyHeading(value: string) {
  // 目录锚点使用一个简单、稳定的 slug 规则，避免把展示逻辑散落到内容文件里。
  return value
    .trim()
    .toLowerCase()
    .replace(/[`'"()[\].,!?/:]+/g, "")
    .replace(/\s+/g, "-");
}

function extractToc(content: string): TocItem[] {
  // 目前只把二级和三级标题放进右侧目录，避免目录层级过深影响阅读。
  const headingPattern = /^(##|###)\s+(.+)$/gm;
  const items: TocItem[] = [];

  for (const match of content.matchAll(headingPattern)) {
    const hashes = match[1];
    const rawTitle = match[2].trim();
    const title = rawTitle.replace(/`/g, "");

    items.push({
      id: slugifyHeading(title),
      title,
      level: hashes === "##" ? 2 : 3,
    });
  }

  return items;
}

async function readPostDirectories() {
  try {
    const entries = await fs.readdir(postsRoot, { withFileTypes: true });
    return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  } catch {
    return [];
  }
}

async function readPost(slug: string, lang: Language): Promise<Post | null> {
  const filePath = path.join(postsRoot, slug, `${lang}.md`);

  try {
    // frontmatter 提供笔记元信息，正文部分交给 Markdown 渲染器处理。
    const source = await fs.readFile(filePath, "utf8");
    const { data, content } = matter(source);
    const frontmatter = data as PostFrontmatter;

    return {
      slug,
      lang,
      title: frontmatter.title,
      summary: frontmatter.summary,
      date: normalizeDate(frontmatter.date),
      tags: frontmatter.tags ?? [],
      toc: extractToc(content),
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllPosts(lang: Language): Promise<Post[]> {
  const slugs = await readPostDirectories();
  const posts = await Promise.all(slugs.map((slug) => readPost(slug, lang)));

  return posts
    .filter((post): post is Post => post !== null)
    // 这里直接按日期字符串倒序，要求 frontmatter 使用 YYYY-MM-DD 这种可排序格式。
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string, lang: Language): Promise<Post | null> {
  return readPost(slug, lang);
}

export async function getAvailablePostLanguages(slug: string): Promise<Language[]> {
  const languages: Language[] = [];

  for (const lang of ["zh", "en"] as const) {
    const post = await readPost(slug, lang);

    if (post) {
      languages.push(lang);
    }
  }

  return languages;
}

export async function getPostSlugs(): Promise<string[]> {
  return readPostDirectories();
}
