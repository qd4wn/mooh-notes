---
title: Makefile 基本介绍与使用示例（AI Generated）
summary: 用一篇入门笔记说明 Makefile 的作用、常见目标写法，以及如何通过几个简单规则提升日常开发效率。
createdAt: 2026-03-23
updatedAt: 2026-03-24
tags:
  - Makefile
  - 构建工具
  - 工程化
---

## 什么是 Makefile？

`Makefile` 是一份规则文件，通常配合 `make` 命令使用。它最早常用于 C/C++ 项目的编译，但现在也经常被当作一个轻量级任务运行器，用来统一项目里的常用命令。

你可以把它理解成：

- 给重复命令起一个稳定名字
- 把构建、测试、清理等步骤组织成规则
- 让团队成员用一致的方式执行开发任务

> Tip
>
> 如果一个项目里已经有 `pnpm lint`、`pnpm build`、`docker compose up` 这类分散命令，`Makefile` 很适合拿来做统一入口。

## 一个最小示例

下面是一个最基础的 `Makefile`：

```makefile
.PHONY: help

help:
	@echo "available targets:"
	@echo "  make help"
	@echo "  make dev"
	@echo "  make lint"
```

运行 `make help` 后，就会执行 `help` 目标下面的几行命令。

> 每条命令前面的缩进必须是 Tab，而不是空格。这是 Makefile 最容易踩的坑之一。

## 常见目标写法

如果你希望把前端项目里的常用命令统一起来，可以这样写：

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

这样之后，你就可以通过这些命令操作项目：

```bash
make dev
make lint
make build
```

## 为什么要写 `.PHONY`

对于像 `dev`、`lint`、`build` 这种目标，通常建议声明为 `.PHONY`，表示它们不是实际文件名，而是“始终可以执行的任务名”。

如果你不写 `.PHONY`，一旦目录里刚好存在同名文件，`make` 可能会误判目标已经是最新状态，从而跳过执行。

## 带依赖关系的规则

`Makefile` 的一个核心能力，是让一个目标依赖另一个目标：

```makefile
.PHONY: all build lint

all: lint build

lint:
	pnpm lint

build:
	pnpm build
```

执行 `make all` 时，`make` 会先运行 `lint`，再运行 `build`。

这很适合把“发布前检查”串起来。

## 一个更贴近日常开发的例子

下面这个版本更适合当前这种 Next.js 项目：

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

这样做的价值不是“少打几个字”，而是把项目约定放到一个统一入口里。随着脚本越来越多，这种统一会很有用。

> Practice
>
> 对个人项目来说，`Makefile` 最有价值的一点不是复杂编排，而是让一组常用命令有清晰、稳定的名字。

## 适合什么时候使用 Makefile？

以下场景很适合：

- 需要把多个常用命令做统一入口
- 想让团队成员少记一些长命令
- 需要为 CI、本地开发、构建脚本提供同一套任务名称

如果任务已经很复杂，也可以再考虑更专门的任务工具。但对很多博客、工具站和个人项目来说，`Makefile` 已经足够实用。
