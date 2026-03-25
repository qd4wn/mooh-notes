---
title: A Basic Introduction to Makefile with Examples
summary: A practical introduction to what Makefile is, how targets work, and how a few simple rules can clean up your daily development workflow.
createdAt: 2026-03-23
updatedAt: 2026-03-23
tags:
  - Makefile
  - Build Tools
  - Workflow
---

## What is a Makefile?

A `Makefile` is a rule file used together with the `make` command. It was originally common in C and C++ build systems, but it is still widely used today as a lightweight task runner for everyday project commands.

You can think of it as a way to:

- give repeated commands stable names
- organize build, test, and cleanup tasks
- make team workflows more consistent

> Tip
>
> If a project already has commands like `pnpm lint`, `pnpm build`, or `docker compose up`, a `Makefile` is often a clean way to provide one consistent entry point.

## A minimal example

Here is a very small `Makefile`:

```makefile
.PHONY: help

help:
	@echo "available targets:"
	@echo "  make help"
	@echo "  make dev"
	@echo "  make lint"
```

When you run `make help`, the commands under the `help` target are executed.

> The indentation before each command must be a tab, not spaces. This is one of the most common Makefile mistakes.

## Common target patterns

If you want to standardize common frontend commands, you can write:

```makefile
.PHONY: dev lint build clean

dev:
	pnpm dev

lint:
	pnpm lint

build:
	pnpm build

clean:
	rm -rf .next
```

Then you can run:

```bash
make dev
make lint
make build
```

## Why use `.PHONY`?

For targets like `dev`, `lint`, and `build`, it is usually best to declare them as `.PHONY`, which tells `make` that these names are tasks rather than real files.

Without `.PHONY`, `make` may skip execution if a file with the same name already exists.

## Rules with dependencies

One of the core strengths of `Makefile` is target dependencies:

```makefile
.PHONY: all build lint

all: lint build

lint:
	pnpm lint

build:
	pnpm build
```

When you run `make all`, `make` executes `lint` first and then `build`.

This is useful when you want to define a pre-release or pre-deploy flow.

## A more practical example

For a Next.js project like this one, a slightly more practical version could look like this:

```makefile
.PHONY: help dev lint build start

help:
	@echo "make dev     - start local development server"
	@echo "make lint    - run eslint"
	@echo "make build   - create production build"
	@echo "make start   - start production server"

dev:
	pnpm dev

lint:
	pnpm lint

build:
	pnpm build

start:
	pnpm start
```

The real value here is not just shorter commands. It gives the project one consistent command surface as the number of scripts grows.

> Practice
>
> In smaller projects, the biggest win from a `Makefile` is often not advanced automation, but making common tasks obvious and repeatable.

## When is Makefile a good fit?

It works well when you want to:

- provide one entry point for common commands
- reduce the need to remember long scripts
- keep CI, local development, and build tasks aligned

If the workflow becomes much more complex, you may eventually want a more specialized tool. But for many blogs, internal tools, and personal projects, `Makefile` is still a very pragmatic choice.
