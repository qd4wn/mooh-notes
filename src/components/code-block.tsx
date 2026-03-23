"use client";

import { useState } from "react";

type CodeBlockProps = {
  children: React.ReactNode;
  code: string;
  language?: string;
};

function formatLanguageLabel(language?: string) {
  if (!language) {
    return "code";
  }

  return language.toLowerCase();
}

export function CodeBlock({ children, code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-sm">
      <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-4 py-2">
        <span className="font-mono text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
          {formatLanguageLabel(language)}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:border-zinc-300 hover:text-zinc-900"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-3 text-sm leading-6 text-zinc-800">{children}</div>
    </div>
  );
}
