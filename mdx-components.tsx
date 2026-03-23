import { isValidElement } from "react";
import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/code-block";

function Callout({
  title,
  children,
}: Readonly<{
  title?: string;
  children: React.ReactNode;
}>) {
  return (
    <div className="my-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-zinc-700">
      {title ? <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">{title}</p> : null}
      <div className="mt-2 text-base leading-7">{children}</div>
    </div>
  );
}

const components: MDXComponents = {
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
    <h3 {...props} className="mt-8 scroll-mt-24 text-xl font-semibold text-zinc-950" />
  ),
  p: (props) => <p {...props} className="my-4 text-base leading-8 text-zinc-700" />,
  ul: (props) => <ul {...props} className="my-4 list-disc space-y-2 pl-6 text-zinc-700" />,
  ol: (props) => <ol {...props} className="my-4 list-decimal space-y-2 pl-6 text-zinc-700" />,
  li: (props) => <li {...props} className="leading-8" />,
  code: (props) => (
    <code
      {...props}
      className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[0.95em] text-zinc-900"
    />
  ),
  pre: ({ children }) => {
    if (!isValidElement(children)) {
      return (
        <pre className="my-6 overflow-x-auto rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 text-zinc-800 shadow-sm">
          {children}
        </pre>
      );
    }

    const childProps = children.props as {
      children?: React.ReactNode;
      className?: string;
    };
    const className = childProps.className ?? "";
    const language = className.replace("language-", "") || undefined;
    const rawCode =
      typeof childProps.children === "string"
        ? childProps.children.replace(/\n$/, "")
        : "";

    return (
      <CodeBlock code={rawCode} language={language}>
        <pre className="m-0 text-sm leading-6 text-zinc-800">
          {children}
        </pre>
      </CodeBlock>
    );
  },
  blockquote: (props) => (
    <blockquote
      {...props}
      className="my-6 border-l-4 border-zinc-300 pl-4 italic text-zinc-600"
    />
  ),
  a: (props) => <a {...props} className="font-medium text-zinc-950 underline underline-offset-4" />,
  Callout,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
