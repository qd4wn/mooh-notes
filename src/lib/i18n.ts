export const languages = ["zh", "en"] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = "zh";

export function isSupportedLanguage(value: string): value is Language {
  return languages.includes(value as Language);
}

export const languageLabels: Record<Language, string> = {
  zh: "zh",
  en: "en",
};

export const siteCopy: Record<
  Language,
  {
    siteTitle: string;
    tagline: string;
    intro: string;
    homeLink: string;
    postsLink: string;
    latestPosts: string;
    allPosts: string;
    readMore: string;
    switchLanguage: string;
    backToPosts: string;
    translations: string;
    missingTranslation: string;
  }
> = {
  zh: {
    siteTitle: "Mooh Notes",
    tagline: "双语博客与学习笔记",
    intro: "记录技术、阅读和学习中的长期笔记，支持中英文切换。",
    homeLink: "首页",
    postsLink: "文章",
    latestPosts: "最新文章",
    allPosts: "全部文章",
    readMore: "阅读文章",
    switchLanguage: "切换语言",
    backToPosts: "返回文章列表",
    translations: "可切换语言",
    missingTranslation: "当前文章暂时没有对应语言版本。",
  },
  en: {
    siteTitle: "Mooh Notes",
    tagline: "Bilingual blog and study notes",
    intro: "A place for technical writing, reading notes, and long-term learning in Chinese and English.",
    homeLink: "Home",
    postsLink: "Posts",
    latestPosts: "Latest posts",
    allPosts: "All posts",
    readMore: "Read post",
    switchLanguage: "Switch language",
    backToPosts: "Back to posts",
    translations: "Translations",
    missingTranslation: "This post does not have a translation in the requested language yet.",
  },
};
