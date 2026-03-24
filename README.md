# Mooh Notes

A bilingual notes site built with Next.js, focused on essays and records from daily learning and development.

## Development

```bash
make dev
```

Open `http://localhost:3000`.

If you want to see the available project commands:

```bash
make help
```

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

## Commands

```bash
make help
make dev
make lint
make build
make start
make clean
```

These targets map to the underlying `pnpm` workflow:

- `make dev`: start the Next.js development server
- `make lint`: run ESLint
- `make build`: create the production build
- `make start`: start the production server
- `make clean`: remove the `.next` build output

## Deployment Note

This project has already been deployed on Vercel.

At the moment, it is only accessible through the default `vercel.app` domain. No custom domain, reverse proxy, CDN acceleration, or other access optimization has been configured yet.

As a result, access from some regions may be unavailable or unstable, and a VPN may be required.
