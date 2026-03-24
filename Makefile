.PHONY: help dev lint build start clean

# 显示可用命令说明，方便快速查看项目常用入口。
help:
	@echo "Available targets:"
	@echo "  make dev    - start the Next.js dev server"
	@echo "  make lint   - run ESLint"
	@echo "  make build  - create the production build"
	@echo "  make start  - start the production server"
	@echo "  make clean  - remove build artifacts"

# 启动 Next.js 开发服务器，用于本地开发和实时预览。
dev:
	pnpm dev

# 执行 ESLint 检查，确认代码规范和基础问题。
lint:
	pnpm lint

# 构建生产版本，用于部署前验证和生成产物。
build:
	pnpm build

# 启动已经构建好的生产版本服务。
start:
	pnpm start

# 清理 Next.js 构建目录，便于重新构建。
clean:
	rm -rf .next
