# Mooh Notes

A bilingual notes site built with Next.js, focused on essays and records from daily learning and development.

## Development

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Content

Posts live under `src/content/posts/<slug>/` and use one Markdown file per language:

```text
src/content/posts/
  makefile-basics/
    zh.md
    en.md
```

Each file uses YAML frontmatter for metadata:

```md
---
title: Post title
summary: Short summary
date: 2026-03-23
tags:
  - tag-one
  - tag-two
---
```

The table of contents is generated automatically from `##` and `###` headings in the Markdown body.

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm start
```
