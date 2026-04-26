---
title: 用 C 语言实现一个简易 Shell：lsh-cx 项目笔记
summary: 记录 lsh-cx 这个 C 语言 Shell 项目的目标、模块划分、执行流程、内置命令和外部命令执行方式。
createdAt: 2026-03-31
updatedAt: 2026-04-26
tags:
  - C
  - Shell
  - Linux
  - Makefile
---

## 项目简介

`lsh-cx` 是一个使用 C 语言实现的简易 Shell 项目，整体思路参考了 `brenns10/lsh` 的最小 Shell 教学实现，但没有照搬成单文件结构，而是拆成了多个职责清晰的模块。

这个项目当前关注的是一个最小可运行闭环：

```text
初始化 → 读取输入 → 解析命令 → 执行命令 → 回收资源 → 退出
```

当前版本已经支持：

- 显示提示符 `lsh> `
- 使用 `getline()` 读取用户输入
- 基于空白字符解析简单命令和参数
- 执行内置命令：`exit`、`help`、`pwd`、`cd`
- 调用系统外部命令，例如 `ls`、`echo`、`cat`
- 通过 `Ctrl-D` 触发 EOF 并退出 shell

目前项目主要面向 Linux 环境，没有做跨平台移植。

## 项目目录结构

项目采用比较典型的 C 小项目结构：

```text
lsh-cx/
├── Makefile
├── readme.md
├── include/
│   ├── builtin.h
│   ├── executor.h
│   ├── input.h
│   ├── parser.h
│   ├── shell.h
│   └── state.h
├── src/
│   ├── builtin.c
│   ├── executor.c
│   ├── input.c
│   ├── main.c
│   ├── parser.c
│   ├── shell.c
│   └── state.c
├── build/
└── bin/
```

其中：

- `include/` 存放头文件和模块接口
- `src/` 存放具体实现
- `build/` 存放中间目标文件 `.o`
- `bin/` 存放最终可执行文件 `lsh`

这种结构比单文件实现更适合后续继续加入管道、重定向、后台任务等功能。

## 构建与运行

项目使用 `Makefile` 组织构建流程。

```bash
make
```

编译后会生成：

```text
bin/lsh
```

运行 shell：

```bash
./bin/lsh
```

示例交互：

```text
lsh> pwd
/home/user/project

lsh> echo hello
hello

lsh> ls
...

lsh> exit
```

清理构建产物：

```bash
make clean
```

重新构建：

```bash
make re
```

## Makefile 设计

这个项目的 `Makefile` 使用了几个比较常见的变量：

```makefile
CC := gcc
CPPFLAGS := -Iinclude
CFLAGS   := -Wall -Wextra -Werror -std=c11
```

其中：

- `CC` 指定 C 编译器
- `CPPFLAGS` 添加头文件搜索路径
- `CFLAGS` 开启警告并使用 C11 标准
- `-Werror` 会把警告当作错误处理，有助于保持代码干净

源文件列表集中写在 `SRCS` 中：

```makefile
SRCS := \
	main.c \
	shell.c \
	state.c \
	input.c \
	parser.c \
	builtin.c \
	executor.c
```

目标文件通过模式替换生成：

```makefile
OBJS := $(SRCS:%.c=$(BUILD_DIR)/%.o)
```

核心规则是：

```makefile
$(TARGET): $(OBJS) | $(BIN_DIR)
	$(CC) $(LDFLAGS) -o $@ $(OBJS) $(LDLIBS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

这两条规则分别负责：

- 把多个 `.o` 文件链接成最终可执行文件
- 把每个 `.c` 文件编译成对应的 `.o` 文件

## 核心数据结构

项目定义了两个核心结构体：`ShellState` 和 `Command`。

```c
typedef struct ShellState
{
    int running;
    int last_status;
    const char *prompt;
    char *previous_dir;
} ShellState;
```

`ShellState` 保存 shell 的运行状态：

- `running`：主循环是否继续运行
- `last_status`：上一条命令的状态码
- `prompt`：当前提示符
- `previous_dir`：上一次目录，用于支持 `cd -`

```c
typedef struct Command
{
    char *name;
    char **argv;
    int argc;
} Command;
```

`Command` 表示解析后的一条命令：

- `name` 指向命令名，也就是 `argv[0]`
- `argv` 是传给 `execvp()` 的参数数组
- `argc` 是参数数量

把命令抽象成结构体的好处是，后续如果要支持重定向、管道、后台执行，可以继续给 `Command` 添加字段，而不用到处修改函数签名。

## Shell 生命周期

程序入口在 `main.c`，流程很简单：

```c
int main(void)
{
    ShellState shell;
    int status;

    status = shell_init(&shell);
    if (status != 0)
    {
        return status;
    }

    status = shell_loop(&shell);

    shell_cleanup(&shell);
    return status;
}
```

可以分成三个阶段：

1. `shell_init()` 初始化状态
2. `shell_loop()` 进入主循环
3. `shell_cleanup()` 退出前释放资源

这也是一个 shell 最基础的生命周期模型。

## 主循环流程

`shell_loop()` 是整个项目的核心。每一轮循环大致执行：

```text
显示提示符
→ 读取一行输入
→ 处理 EOF / 错误 / 空输入
→ 解析为 Command
→ 尝试执行 builtin
→ 如果不是 builtin，则执行外部命令
→ 释放本轮 Command 资源
→ 进入下一轮
```

对应到模块职责：

- `input` 负责读取输入
- `parser` 负责把字符串转成 `Command`
- `builtin` 负责处理内置命令
- `executor` 负责执行外部程序
- `state` 负责维护运行状态

这种拆分让主循环保持在一个比较高的抽象层级，不需要在一个函数里塞满所有细节。

## 输入读取模块

`input` 模块使用 POSIX 的 `getline()` 读取一整行输入。

```c
line_length = getline(&input->line, &input->capacity, stdin);
```

`getline()` 的好处是可以根据输入长度自动扩容缓冲区，比固定长度数组更安全。

读取结果被抽象成几种状态：

- 正常读取到一行
- 读取到空行
- 读取到 EOF，例如用户按下 `Ctrl-D`
- 读取过程发生错误

读取到换行后，模块会把行尾的 `\n` 替换成 `\0`，这样上层解析时就不用额外处理换行符。

## 命令解析模块

`parser` 模块当前只做一件事：基于空白字符切分参数。

例如输入：

```bash
echo hello world
```

会被解析成：

```text
name = "echo"
argv = ["echo", "hello", "world", NULL]
argc = 3
```

这里有一个重要细节：`argv` 的最后一个元素必须是 `NULL`，因为 `execvp()` 需要这样的参数格式。

当前解析器暂时不支持：

- 引号
- 转义字符
- 管道
- 重定向
- 后台任务

这符合项目第一阶段的目标：先实现最小可运行版本，再逐步扩展。

## 内置命令模块

内置命令不能全部交给外部程序执行，因为有些命令必须改变当前 shell 进程本身的状态。

例如 `cd` 如果在子进程里执行，改变的只是子进程的工作目录，父进程 shell 的目录不会变化。因此 `cd` 必须作为 builtin 在当前进程里执行。

当前支持的 builtin 有：

| 命令 | 作用 |
|---|---|
| `exit` | 请求退出 shell |
| `help` | 打印内置命令列表 |
| `pwd` | 输出当前工作目录 |
| `cd` | 切换当前工作目录 |

`cd` 还支持几个常见形式：

```bash
cd
cd /tmp
cd -
cd ~
cd ~/project
```

其中 `cd -` 依赖 `ShellState.previous_dir` 保存上一次成功切换前的目录。

## 外部命令执行模块

如果输入的命令不是 builtin，就会进入 `executor` 模块。

外部命令执行的核心流程是：

```text
fork()
→ 子进程 execvp()
→ 父进程 waitpid()
```

在子进程中：

```c
execvp(command->name, command->argv);
```

`execvp()` 会根据 `PATH` 查找可执行程序，并用目标程序替换当前子进程。

如果执行失败，子进程会打印错误并以 `127` 退出。

在父进程中：

```c
waitpid(pid, &status, 0);
```

父进程等待子进程结束，并把子进程的退出状态转换成 shell 的 `last_status`。

如果子进程被信号终止，状态码会转换成常见 shell 约定：

```text
128 + signal_number
```

## 资源管理

这个项目比较适合作为 C 语言资源管理练习，因为每一轮命令都会涉及动态内存：

- `getline()` 维护输入缓冲区
- `parser` 为每个 token 分配字符串
- `parser` 为 `argv` 动态扩容
- `cd -` 需要保存前一个目录路径

项目里的资源释放分层比较清楚：

- `input_cleanup()` 释放输入缓冲区
- `parser_cleanup_command()` 释放本轮命令参数
- `shell_state_cleanup()` 释放 shell 状态里保存的目录

这种模式的重点是：谁分配，谁负责提供对应的释放函数；每轮循环结束后都要清理本轮资源。

## 当前限制

这个 shell 目前仍然是一个最小版本，限制也很明确：

- 不支持引号，例如 `echo "hello world"` 不会被当成一个参数
- 不支持转义字符
- 不支持管道，例如 `ls | grep c`
- 不支持重定向，例如 `echo hi > a.txt`
- 不支持后台任务，例如 `sleep 10 &`
- 不支持历史记录和自动补全
- 暂时只考虑 Linux / POSIX 环境

这些限制不是问题，而是项目分阶段实现时刻意保留的边界。

## 后续可以扩展的方向

后续如果继续完善，可以考虑按下面顺序扩展：

1. 增强 parser，支持引号和转义
2. 增加重定向结构，例如输入重定向、输出重定向、追加输出
3. 支持管道，把一行命令解析成多个 `Command`
4. 增加后台任务支持
5. 增加信号处理，例如处理 `Ctrl-C`
6. 增加命令历史和简单补全
7. 为 parser 和 builtin 增加自动化测试

其中最关键的一步是 parser 的升级。当前 `Command` 结构已经为后续扩展留下了空间，但一旦支持管道和重定向，命令模型可能需要从“单条命令”升级为“命令列表”或“执行计划”。

