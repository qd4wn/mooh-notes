---
title: "Building a Minimal Shell in C: Notes on lsh-cx"
summary: "Notes on the lsh-cx C shell project, covering its goals, module design, command parsing, built-ins, external command execution, and resource management."
createdAt: 2026-03-31
updatedAt: 2026-04-26
tags:
  - C
  - Shell
  - Linux
  - Makefile
---

## Project Overview

`lsh-cx` is a small shell implemented in C. It follows the core idea of `brenns10/lsh`, a minimal educational shell, but reorganizes the implementation into separate modules instead of keeping everything in one source file.

The current goal is to build a minimal working loop:

```text
initialize → read input → parse command → execute command → release resources → exit
```

The current version supports:

- displaying the `lsh> ` prompt
- reading user input with `getline()`
- parsing simple commands by splitting on whitespace
- built-in commands: `exit`, `help`, `pwd`, and `cd`
- external commands such as `ls`, `echo`, and `cat`
- exiting on EOF, for example by pressing `Ctrl-D`

The project currently targets Linux and does not attempt to be portable across platforms.

## Directory Structure

The project uses a typical small C project layout:

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

The roles are clear:

- `include/` contains module interfaces
- `src/` contains implementations
- `build/` stores intermediate object files
- `bin/` stores the final `lsh` executable

This structure is more suitable for future extensions such as pipes, redirection, background jobs, and signal handling.

## Build and Run

The project uses a `Makefile` for compilation.

```bash
make
```

After compilation, the executable is generated at:

```text
bin/lsh
```

Run it with:

```bash
./bin/lsh
```

Example session:

```text
lsh> pwd
/home/user/project

lsh> echo hello
hello

lsh> ls
...

lsh> exit
```

Clean build artifacts:

```bash
make clean
```

Rebuild from scratch:

```bash
make re
```

## Makefile Design

The `Makefile` defines common compilation variables:

```makefile
CC := gcc
CPPFLAGS := -Iinclude
CFLAGS   := -Wall -Wextra -Werror -std=c11
```

These mean:

- `CC` selects the C compiler
- `CPPFLAGS` adds the header search path
- `CFLAGS` enables warnings and uses the C11 standard
- `-Werror` turns warnings into errors, helping keep the code clean

The source files are listed explicitly:

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

Object files are generated through pattern substitution:

```makefile
OBJS := $(SRCS:%.c=$(BUILD_DIR)/%.o)
```

The two core rules are:

```makefile
$(TARGET): $(OBJS) | $(BIN_DIR)
	$(CC) $(LDFLAGS) -o $@ $(OBJS) $(LDLIBS)

$(BUILD_DIR)/%.o: $(SRC_DIR)/%.c | $(BUILD_DIR)
	$(CC) $(CPPFLAGS) $(CFLAGS) -c $< -o $@
```

The first rule links object files into the final executable. The second compiles each `.c` file into an object file.

## Core Data Structures

The project defines two central structures: `ShellState` and `Command`.

```c
typedef struct ShellState
{
    int running;
    int last_status;
    const char *prompt;
    char *previous_dir;
} ShellState;
```

`ShellState` stores shell-level state:

- `running`: whether the main loop should continue
- `last_status`: the status code of the previous command
- `prompt`: the prompt string
- `previous_dir`: the previous directory, used by `cd -`

```c
typedef struct Command
{
    char *name;
    char **argv;
    int argc;
} Command;
```

`Command` represents one parsed command:

- `name` points to the command name, usually `argv[0]`
- `argv` is the argument array passed to `execvp()`
- `argc` stores the number of arguments

Using a command structure makes future extensions easier. Redirection, pipes, and background execution can later be modeled by extending this structure or by introducing a higher-level command list.

## Shell Lifecycle

The program starts in `main.c`:

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

The lifecycle has three phases:

1. `shell_init()` initializes state
2. `shell_loop()` enters the read-parse-execute loop
3. `shell_cleanup()` releases resources before exit

This is the minimal lifecycle model of a shell.

## Main Loop

`shell_loop()` is the core of the project. Each iteration roughly does this:

```text
show prompt
→ read one line
→ handle EOF / error / empty input
→ parse into Command
→ try built-in command
→ otherwise execute external command
→ free resources for this command
→ continue
```

The module responsibilities are:

- `input` reads user input
- `parser` turns a string into a `Command`
- `builtin` handles built-in commands
- `executor` runs external programs
- `state` manages shell state

This keeps the main loop at a high level and avoids mixing all details into one function.

## Input Module

The `input` module uses POSIX `getline()` to read a full line:

```c
line_length = getline(&input->line, &input->capacity, stdin);
```

`getline()` can grow the buffer as needed, which is safer than using a fixed-size array.

The input module categorizes results as:

- a normal line
- an empty line
- EOF, such as `Ctrl-D`
- read error

After reading a line, the trailing newline is replaced with `\0`, so the parser does not need to handle it separately.

## Parser Module

The current parser does one simple thing: split input by whitespace.

For example:

```bash
echo hello world
```

is parsed as:

```text
name = "echo"
argv = ["echo", "hello", "world", NULL]
argc = 3
```

The final `NULL` in `argv` is important because `execvp()` expects a null-terminated argument array.

The parser currently does not support:

- quotes
- escape characters
- pipes
- redirection
- background jobs

This matches the first-stage goal: make the minimal shell work before adding more syntax.

## Built-in Commands

Not every command can be delegated to an external process. Some commands must modify the current shell process itself.

For example, if `cd` runs in a child process, only the child process changes directory. The parent shell would remain in the same directory. Therefore, `cd` must be implemented as a built-in command.

The current built-ins are:

| Command | Purpose |
|---|---|
| `exit` | request shell exit |
| `help` | print built-in command list |
| `pwd` | print the current working directory |
| `cd` | change the current working directory |

`cd` supports common forms:

```bash
cd
cd /tmp
cd -
cd ~
cd ~/project
```

`cd -` depends on `ShellState.previous_dir`, which stores the directory before the last successful `cd`.

## External Command Execution

If a command is not a built-in, it is handled by the `executor` module.

The core flow is:

```text
fork()
→ child process calls execvp()
→ parent process calls waitpid()
```

In the child process:

```c
execvp(command->name, command->argv);
```

`execvp()` searches for the executable using `PATH` and replaces the child process with the target program.

If execution fails, the child prints an error and exits with status `127`.

In the parent process:

```c
waitpid(pid, &status, 0);
```

The parent waits for the child to finish and converts the child process status into the shell's `last_status`.

If the child is terminated by a signal, the shell uses the common convention:

```text
128 + signal_number
```

## Resource Management

This project is also a good exercise in C resource management. Each loop iteration may involve dynamic memory:

- `getline()` owns an input buffer
- the parser allocates strings for each token
- the parser grows the `argv` array dynamically
- `cd -` stores the previous directory path

Cleanup is separated by responsibility:

- `input_cleanup()` releases the input buffer
- `parser_cleanup_command()` releases command arguments
- `shell_state_cleanup()` releases shell-level state such as `previous_dir`

The main idea is: every module that owns memory should provide a matching cleanup function, and each command iteration should release the resources it created.

## Current Limitations

The shell is still intentionally minimal. It does not support:

- quotes, such as treating `"hello world"` as one argument
- escape characters
- pipes, such as `ls | grep c`
- redirection, such as `echo hi > a.txt`
- background jobs, such as `sleep 10 &`
- command history or completion
- non-POSIX platforms

These are reasonable boundaries for a staged implementation.

## Possible Next Steps

Future improvements could be added in this order:

1. improve the parser to support quotes and escapes
2. add redirection support for input, output, and append modes
3. support pipelines by parsing one line into multiple commands
4. add background jobs
5. handle signals such as `Ctrl-C`
6. add command history and simple completion
7. add automated tests for parser and built-ins

The most important step is upgrading the parser. Once pipes and redirection are introduced, the internal model may need to evolve from a single `Command` into a command list or execution plan.

## Summary

`lsh-cx` is a compact project for learning both shell fundamentals and C project organization.

Its value is not in having many features, but in making the essential shell mechanics visible:

- how to read user input
- how to parse input into an argument array
- why built-ins must run in the current process
- why external commands need `fork + execvp + waitpid`
- how to manage per-command dynamic resources in C

After understanding this project, it becomes easier to reason about the execution model behind larger shells such as Bash and Zsh.
