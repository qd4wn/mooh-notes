---
title: C 语言开发中 Makefile 与 CMake 的对比
summary: 从上手成本、构建复杂度、跨平台能力和团队协作几个角度，对比在 C 语言项目里使用 Makefile 和 CMake 的实际差异。
createdAt: 2026-03-23
updatedAt: 2026-03-23
tags:
  - C
  - Makefile
  - CMake
  - Build System
---

## 为什么会拿 Makefile 和 CMake 比较？

在 C 语言项目里，构建系统几乎是绕不开的话题。只要项目不再是单个 `main.c` 文件，你通常就要开始考虑：

- 源文件如何组织
- 头文件依赖如何管理
- 不同平台如何构建
- Debug 和 Release 如何区分

这时最常见的两个名字就是 `Makefile` 和 `CMake`。

它们经常被放在一起讨论，但实际上它们并不完全是同一个层级的东西。

## 它们分别是什么？

`Makefile` 通常是直接写给 `make` 的规则文件。你会手动描述目标、依赖和执行命令。

`CMake` 则更像一个“生成构建系统的工具”。你写的是 `CMakeLists.txt`，然后由 CMake 去生成具体平台上的构建文件，比如 Makefile、Ninja 文件，或者 IDE 工程文件。

简单说：

- `Makefile` 更接近“直接控制构建命令”
- `CMake` 更接近“描述项目结构，再生成构建方案”

## 在小型 C 项目中，Makefile 的优势

如果你的项目非常小，比如只有几个 `.c` 和 `.h` 文件，那么 `Makefile` 往往更直接。

一个最小例子可能像这样：

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -std=c11
TARGET = app
SRCS = main.c math.c

$(TARGET): $(SRCS)
	$(CC) $(CFLAGS) -o $(TARGET) $(SRCS)

clean:
	rm -f $(TARGET)
```

它的优点很明显：

- 写法直接
- 对构建过程可见性很强
- 不需要额外学习另一套 DSL

如果只是写课程作业、小实验或几十个文件以内的工具，`Makefile` 很可能已经够用了。

## 在中大型项目中，CMake 更常见

当项目开始变复杂时，`CMake` 的优势就会慢慢显现。

例如：

- 有多个子目录
- 需要生成静态库、动态库和可执行文件
- 需要处理不同平台和不同编译器
- 需要接入测试框架、安装规则或第三方依赖

一个非常基础的 `CMakeLists.txt` 可能像这样：

```cmake
cmake_minimum_required(VERSION 3.16)
project(demo C)

set(CMAKE_C_STANDARD 11)

add_executable(app
  main.c
  math.c
)
```

然后你通常会这样构建：

```bash
cmake -S . -B build
cmake --build build
```

这种写法的优势在于，随着项目增长，你不需要手动维护越来越多的底层构建细节。

## 依赖管理和可维护性

`Makefile` 的一个常见问题是，项目一旦变大，规则会迅速膨胀。你可能要自己维护：

- 每个目标的依赖
- 头文件变化后的重编译逻辑
- 平台差异
- 编译参数组合

理论上这些都能做，但维护成本会越来越高。

`CMake` 在这方面更偏向“工程化描述”。它不是让你逐行拼接所有编译命令，而是让你声明：

- 有哪些目标
- 这些目标依赖哪些源码
- 使用哪些 include 目录
- 链接哪些库

这种抽象在多人协作或长期维护时通常更稳。

## 跨平台能力

如果你只在 Linux 上用 GCC，本地写一个 `Makefile` 完全没问题。

但如果你有这些需求：

- Linux 和 Windows 都要支持
- 需要兼容 GCC、Clang、MSVC
- 有人习惯命令行，有人习惯 IDE

那 `CMake` 往往更合适，因为它天然就是跨平台构建生成器。

这也是为什么很多现代 C/C++ 开源项目更倾向于用 `CMake`。

## 学习成本

从入门角度看：

- `Makefile` 更容易写出“第一个能跑的版本”
- `CMake` 更容易在后期维持结构清晰

但要注意，`CMake` 的语法和思维方式本身也有学习成本。很多人第一次写 `CMakeLists.txt` 时，也会觉得它并不直观。

所以不能简单说谁更“简单”，而应该说：

- 对短期、小型项目，`Makefile` 更直接
- 对长期、复杂项目，`CMake` 更可持续

## 一个务实的选择建议

如果你现在正在写 C 语言项目，可以这样判断：

- 只有少量文件，目标单一：优先考虑 `Makefile`
- 预计会扩展、分模块、跨平台：优先考虑 `CMake`
- 团队协作、CI、IDE 集成要求较多：更偏向 `CMake`

很多人并不是“完全放弃 Makefile”，而是会把两者结合使用。比如：

- 用 `CMake` 负责真正的工程构建
- 用顶层 `Makefile` 封装常用命令

例如：

```makefile
.PHONY: configure build clean

configure:
	cmake -S . -B build

build:
	cmake --build build

clean:
	rm -rf build
```

这种组合在实际项目里很常见，因为它兼顾了：

- CMake 的工程化能力
- Makefile 作为命令入口的便利性

## 总结

如果只看“能不能编译 C 程序”，两者都可以做到。

真正的区别在于：

- `Makefile` 更底层、更直接
- `CMake` 更抽象、更适合扩展

所以问题通常不是“谁绝对更好”，而是：

> 你的 C 项目现在的规模和未来的复杂度，值不值得引入更高层的构建描述工具？
