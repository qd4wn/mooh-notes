import type { ComponentType } from "react";

import type { Language } from "@/lib/i18n";

import MakefileBasicsEn, {
  metadata as makefileBasicsEnMetadata,
} from "./posts/makefile-basics/en.mdx";
import MakefileBasicsZh, {
  metadata as makefileBasicsZhMetadata,
} from "./posts/makefile-basics/zh.mdx";

export type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

export type PostMetadata = {
  title: string;
  summary: string;
  date: string;
  tags: string[];
  toc: TocItem[];
};

export type PostModule = {
  default: ComponentType;
  metadata: PostMetadata;
};

const postModules = {
  "makefile-basics": {
    zh: {
      default: MakefileBasicsZh,
      metadata: makefileBasicsZhMetadata,
    },
    en: {
      default: MakefileBasicsEn,
      metadata: makefileBasicsEnMetadata,
    },
  },
} satisfies Record<string, Partial<Record<Language, PostModule>>>;

export const postRegistry = postModules;
