declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXComponent: ComponentType;

  export const metadata: {
    title: string;
    summary: string;
    date: string;
    tags: string[];
    toc: {
      id: string;
      title: string;
      level: 2 | 3;
    }[];
  };

  export default MDXComponent;
}
