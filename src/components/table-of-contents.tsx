import Link from "next/link";

import type { TocItem } from "@/lib/post-types";

type TableOfContentsProps = {
  items: TocItem[];
};

export function TableOfContents({ items }: TableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <aside className="top-24 rounded-[1.5rem] border border-zinc-200 bg-white p-5 shadow-sm lg:sticky">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Contents</p>
      <nav className="mt-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className={item.level === 3 ? "pl-4" : ""}>
              <Link
                href={`#${item.id}`}
                className="text-sm leading-6 text-zinc-600 hover:text-zinc-950"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
