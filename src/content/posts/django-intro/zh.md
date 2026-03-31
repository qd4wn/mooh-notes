---
title: Django 基础与示例
summary: 记录基于官方文档学习和使用 Django 框架的一些记录和随笔
createdAt: 2026-03-24
updatedAt: 2026-03-31
tags:
  - Django
  - Python
  - 后端
---

## 环境安装

### venv 安装 django

使用虚拟环境在项目目录下隔离安装 `django`，不直接安装在系统环境。

```bash
mkdir django-intro
cd django-intro

python -m venv .django-intro
source .django-intro/bin/activate
python -m pip install Django    # or 'pip install django'

python -m django --version
# 6.0.3

```

## Part 1

---

### 初始化目录，验证 `django` 服务正常启动

1. 以前面安装虚拟环境的目录作为项目目录，初始化 `django` 项目。

```bash
cd django-intro
django-admin startproject mysite .

# 初始化后目录结构如下所示（django-intro）
# .
# ├── .django-intro
# ├── manage.py
# └── mysite
#     ├── asgi.py
#     ├── __init__.py
#     ├── settings.py
#     ├── urls.py
#     └── wsgi.py
```

2. 执行如下命令验证 `django` 安装成功和项目初始化正常，找到默认启动的服务链接 `http://127.0.0.1:8000/` 在浏览器打开后正常显示成功信息和🚀图标（运行后会在当目录下创建一个db.sqlite3文件）。

```bash
python manage.py runserver
#...
# Django version 6.0.3, using settings 'mysite.settings'
# Starting development server at http://127.0.0.1:8000/
#...
```

### 创建 `polls` 应用，编写第一个视图

1. 使用 `django` 创建对应的应用。

```bash
python manage.py startapp polls

# polls/
# ├── admin.py
# ├── apps.py
# ├── __init__.py
# ├── migrations
# │   └── __init__.py
# ├── models.py
# ├── tests.py
# └── views.py

```

2. 编写第一个“视图”，编辑 `polls/views.py`。

```bash
# polls/views.py
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You are at the polls index.")

```

3. 映射到 URL 配置，分别编辑 `polls/urls.py`、`mysite/urls.py`。

```bash
# polls/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index")
]
```

```bash
# mysite/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('polls/', include("polls.urls")),
]
```

4. 重新启动 `django` 服务，访问 `http://127.0.0.1:8000/polls/`，能够看到 `polls/view.py` 中预设的返回信息 "Hello, world. You are at the polls index."。

## Part 2

---

### 配置对应数据库

1. `django` 默认使用`sqlite3`，对应的配置项在 `mysite/settings.py` 的 `DATABASE`，在服务启动时会读取对应的 `db.sqlite3` 文件，如果不存在会创建。

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

INSTALLED_APPS = { ... }
```

2. 配置好数据库后，执行 `migrate` 初始化已安装应用的数据表，后续可以进入 `dbshell` 中执行 `.tables` 查看对应的数据表;

```bash
python manage.py migrate

python manage.py dbshell

```

### 创建数据模型

1. 在 `polls/models.py`中 根据“投票”主题建立对应数据模型（表）：Question 表示问题，Choice 表示选项；一个问题可以有多个选项，每个选项记录自己的文本和票数，并通过外键关联到所属问题（所属问题删除时选项也会随之删除）。

```py
#models.py
from django.db import models


class Question(models.Model):
    question_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")


class Choice(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    choice_text = models.CharField(max_length=200)
    votes = models.IntegerField(default=0)

```

2. 创建完数据模型后将 `polls` 应用安装到我们的 `django` 项目中，为了在我们的工程中包含这个应用，在文件 `mysite/settings.py` 中 `INSTALLED_APPS` 子项添加点式路径（`polls/apps.py` 定义的`PollsConfig`）：

```py
# ...
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    "polls.apps.PollsConfig",

]
# ...
```

3. 当模型中与数据库结构相关的定义 `models.py` 发生变化时，需要先执行 `makemigrations` 生成迁移文件，再执行 `migrate` 将这些变更应用到数据库。
   > - `makemigrations`：根据模型变化生成迁移文件
   > - `migrate`：执行迁移文件并同步数据库结构

```bash
python manage.py makemigrations
# python manage.py makemigrations polls  # 范围控制
# Migrations for 'polls':
#   polls/migrations/0001_initial.py
#     + Create model Question
#     + Create model Choice

python manage.py migrate
# Operations to perform:
#   Apply all migrations: admin, auth, contenttypes, polls, sessions
# Running migrations:
#   Applying polls.0001_initial... OK

```

> 完成相关的定义后即可调用 `django` 创建的的各类数据模型对应的 `API`。
> `python manage.py shell` 执行后在交互式 python 中调用测试

### Django 管理页面

1. 创建一个管理员账户

```bash
python manage.py createsuperuser

# Username (leave blank to use 'moon'): admin
# Email address: admin@example.com
# Password: nido.1214
# Password (again): nido.1214
# Superuser created successfully.

```

2. 启动服务后，访问 `http://127.0.0.1:8000/admin/`，输入创建的账户/密码即可进入到对应自带的管理页面

```bash
python manage.py runserver
```

需要注意的是要将之前我们的模型注册到 `polls/admin.py` 中之后才可以在管理页面进行对象的操作

```py
# admin.py
from django.contrib import admin
from .models import Question, Choice

# Register your models here.
admin.site.register(Question)
admin.site.register(Choice)
```

## Part 3~7(暂时略过)

---

至此基本的 `Django` 相关配置和基础使用已经完成，目前执行 `runserver` 后访问 `http://127.0.0.1:8000/polls/` 应该会看到页面显示设置的打印调试信息 "Hello, world. You are at the polls index." （**Part 3 ~ Part7** 以及后续就是做投票相关页面的具体内容，以及 Part8 是 `DJDT` 工具简单介绍）

## Extra: 将 polls 打包为可复用的模块

---

> 将已经编写好的 `polls` demo 应用打包，即所谓的可重用性示例

### 打包前的环境准备

确保用于打包的 `Python` 环境中有需要用到的库

```bash
python -m pip install setuptools
python -m pip install build

```

### 具体的打包流程

1. 在之前的项目（`django-intro`）外创建打包的目录 `django-polls`，并将前面写的 `polls/` 目录复制一份到打包目录

```bash
mkdir django-polls

# 假设打包与之前项目目录同级
# polls        → django_polls（模块名）
# django-polls → 包名
cp django-intro/polls ./django-polls/django_polls -r    # ！一定将polls/ 改为 django_polls/

```

2. 修改 `django-polls/polls/apps.py` 内容大致如下

```py
# django-polls/polls/app.py
from django.apps import AppConfig

class PollsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "django_polls"
    label = "polls"

```

3. 创建 `django-polls/README.rst` 和 `django-polls/LICENSE` 文件，这里仅测试能否正常打包，留空即可不作过多赘述

4. 编写 `django-polls/pyproject.toml` 用于后续的打包，最简示例如下所示

```toml
[build-system]
requires = ["setuptools>=77.0.3"]
build-backend = "setuptools.build_meta"

[project]
name = "django-polls"
version = "0.1.0"
description = "A Django app to conduct web-based polls."
readme = "README.rst"
license = "BSD-3-Clause"
requires-python = ">= 3.12"
dependencies = ["django>=6.0"]
```

5. 为了包含模板和静态文件，创建一个文件 `django-polls/MANIFEST.in`，内容如下

```in
recursive-include django_polls/static *
recursive-include django_polls/templates *
```

6. 在 `django-polls` 目录下执行 `python -m build` 进行打包，打包前后目录结构应如下所示，对应打包后的 `.whl` 文件和 `.tar.gz` 文件即在 `dist` 目录下

```bash
# 打包前目录结构
.
├── LICENSE
├── MANIFEST.in
├── django_polls
├── pyproject.toml
└── README.rst

# 打包后目录结构
.
├── dist
├── django_polls.egg-info
├── LICENSE
├── MANIFEST.in
├── django_polls
├── pyproject.toml
└── README.rst
```

### 作为用户库安装 `polls` 应用

1. 准备一个全新/其它的 `django` 项目（直接使用之前的 `python` 虚拟环境将打好的包安装到这个环境中）

```bash
# 创建新的 django 项目
mkdir polls-pack-test && cd polls-pack-test
django-admin startproject testsite .

# 替换为对应的 venv 和 dist 路径
source [django-intro目录]/.django-intro/bin/activate
pip install [django-polls目录]/dist/django_polls-0.1.0-py3-none-any.whl

```

2. 修改 `testsite/settings.py`，在 `INSTALLED_APPS` 中添加打包后导入的 `django_polls` 包

```python
INSTALLED_APPS = [
    # ... ...

    # 添加打包的 name 名称
    "django_polls",
]
```

3. 修改 `testsite/urls.py`

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("polls/", include("django_polls.urls")),
]
```

4. 执行 `migrate` 和 `runserver` 后即可访问对应 "[url]/polls" 访问对应应用（相关业务数据需要重新添加）

```bash
python manage.py migrate

python manage.py runserver

```

5. 用于该投票应用可以使用下面的 `seed.py` 生成一部分随机数据验证打包正常重用（如果 `django` 项目名发生改变和打包名称改变要对 `seed.py` 进行修改）

```python
# seed.py
# 用于数据库中记录的批量生成程序（清除旧数据）

import os
import django
import datetime
import random

# 初始化 Django 环境
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'testsite.settings')
django.setup()

from django_polls.models import Question, Choice
from django.utils import timezone

# 清楚旧的数据
Question.objects.all().delete()

questions_text = [
    "What is your favorite programming language?",
    "Which code editor do you use most often?",
    "What is your primary operating system?",
    "Do you prefer frontend or backend development?",
    "How many hours do you code daily?",
    "Which database do you use most?",
    "What is your favorite web framework?",
    "Which version control system do you use?",
    "Do you prefer tabs or spaces?",
    "What is your favorite programming paradigm?"
]

choices_pool = [
    ["Python", "C++", "Java", "Go"],
    ["VS Code", "Vim", "PyCharm", "Neovim"],
    ["Linux", "Windows", "macOS"],
    ["Frontend", "Backend", "Fullstack"],
    ["<1 hour", "1-3 hours", "3-6 hours", "6+ hours"],
    ["MySQL", "PostgreSQL", "SQLite", "MongoDB"],
    ["Django", "Flask", "Spring", "Express"],
    ["Git", "SVN", "Mercurial"],
    ["Tabs", "Spaces"],
    ["OOP", "Functional", "Procedural"]
]

# 迭代生成对应的数据记录填入表
for i in range(len(questions_text)):
    q = Question.objects.create(
        question_text=questions_text[i],
        pub_date=timezone.now() - datetime.timedelta(days=random.randint(0, 5))
    )

    for choice_text in choices_pool[i]:
        Choice.objects.create(
            question=q,
            choice_text=choice_text,
            votes=random.randint(0, 100)
        )

print(f"Data generation completed! Questions count: {Question.objects.count()}")

```
