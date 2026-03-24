import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

import { CodeBlock } from "@/components/code-block";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug, rehypeHighlight]}
      components={{
        h1: (props) => (
          <h1
            {...props}
            className="mt-10 text-4xl font-semibold tracking-tight text-zinc-950 first:mt-0"
          />
        ),
        h2: (props) => (
          <h2
            {...props}
            className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight text-zinc-950"
          />
        ),
        h3: (props) => (
          <h3
            {...props}
            className="mt-8 scroll-mt-24 text-xl font-semibold text-zinc-950"
          />
        ),
        p: (props) => <p {...props} className="my-4 text-base leading-8 text-zinc-700" />,
        ul: (props) => (
          <ul {...props} className="my-4 list-disc space-y-2 pl-6 text-zinc-700" />
        ),
        ol: (props) => (
          <ol {...props} className="my-4 list-decimal space-y-2 pl-6 text-zinc-700" />
        ),
        li: (props) => <li {...props} className="leading-8" />,
        blockquote: (props) => (
          <blockquote
            {...props}
            className="my-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 text-zinc-700"
          />
        ),
        a: (props) => (
          <a
            {...props}
            className="font-medium text-zinc-950 underline underline-offset-4"
          />
        ),
        // react-markdown 默认会生成 pre > code，这里把外层 pre 去掉，统一交给自定义代码块组件处理。
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children, ...props }) => {
          const language = className?.replace("language-", "");
          const code = String(children).replace(/\n$/, "");

          if (!language) {
            return (
              <code
                {...props}
                className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.95em] text-zinc-900"
              >
                {children}
              </code>
            );
          }

          // 带语言类名的代码块走统一的 CodeBlock，提供语言标签、复制按钮和样式。
          return (
            <CodeBlock code={code} language={language}>
              <pre className="m-0 text-sm leading-6 text-zinc-800">
                <code className={className}>{children}</code>
              </pre>
            </CodeBlock>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
