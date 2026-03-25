---
title: Django 基础与示例
summary: 记录基于官方文档学习和使用 Django 框架的一些记录和随笔
createdAt: 2026-03-24
updatedAt: 2026-03-24
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

---

至此基本的 `Django` 相关配置和基础使用已经完成，**Part 3** 以及后续就是做投票相关页面的具体内容，暂时不在这里展开过多...
