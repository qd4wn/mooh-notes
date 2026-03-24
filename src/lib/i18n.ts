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
    siteTitle: "Mooh's Notes",
    tagline: "日常学习和开发中的一些随笔与记录",
    intro: "整理日常学习、开发和阅读过程中的想法、经验与零散记录。",
    homeLink: "首页",
    postsLink: "笔记",
    latestPosts: "最新笔记",
    allPosts: "全部笔记",
    readMore: "阅读笔记",
    switchLanguage: "切换语言",
    backToPosts: "返回笔记列表",
    translations: "可切换语言",
    missingTranslation: "当前笔记暂时没有对应语言版本。",
  },
  en: {
    siteTitle: "Mooh's Notes",
    tagline: "Notes and reflections from daily learning and development",
    intro:
      "A place for essays, notes, and small records gathered from daily learning, development, and reading.",
    homeLink: "Home",
    postsLink: "Posts",
    latestPosts: "Latest posts",
    allPosts: "All posts",
    readMore: "Read post",
    switchLanguage: "Switch language",
    backToPosts: "Back to posts",
    translations: "Translations",
    missingTranslation:
      "This post does not have a translation in the requested language yet.",
  },
};
