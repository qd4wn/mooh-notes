---
title: Django Basics and Examples
summary: Notes and reflections on learning and using the Django framework based on the official documentation
createdAt: 2026-03-24
updatedAt: 2026-03-31
tags:
  - Django
  - Python
  - Backend
---

## Environment Setup

### Install Django in a `venv`

Use a virtual environment to keep the `django` installation isolated inside the project directory instead of installing it directly into the system environment.

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

### Initialize the project and verify that the `django` server starts correctly

1. Use the directory where the virtual environment was created as the project directory and initialize a `django` project there.

```bash
cd django-intro
django-admin startproject mysite .

# The directory structure after initialization looks like this (django-intro)
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

2. Run the following command to confirm that `django` was installed successfully and the project was initialized correctly. Open the default development URL `http://127.0.0.1:8000/` in your browser. You should see Django's default success page with the rocket icon. Running this command will also create a `db.sqlite3` file in the current directory.

```bash
python manage.py runserver
#...
# Django version 6.0.3, using settings 'mysite.settings'
# Starting development server at http://127.0.0.1:8000/
#...
```

### Create the `polls` app and write the first view

1. Use `django` to create the app.

```bash
python manage.py startapp polls

# polls/
# ├── admin.py
# ├── apps.py
# ├── __init__.py
# ├── migrations
# │   └── __init__.py
# ├── models.py
# ├── tests.py
# └── views.py

```

2. Write the first "view" in `polls/views.py`.

```bash
# polls/views.py
from django.http import HttpResponse

def index(request):
    return HttpResponse("Hello, world. You are at the polls index.")

```

3. Map it in the URL configuration by editing `polls/urls.py` and `mysite/urls.py`.

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

4. Restart the `django` server and open `http://127.0.0.1:8000/polls/`. You should see the response text defined in `polls/views.py`: "Hello, world. You are at the polls index."

## Part 2

---

### Configure the database

1. `django` uses `sqlite3` by default. The related configuration is in the `DATABASES` section of `mysite/settings.py`. When the server starts, Django reads the `db.sqlite3` file and creates it automatically if it does not already exist.

```py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

INSTALLED_APPS = { ... }
```

2. After the database is configured, run `migrate` to initialize the tables for the installed apps. After that, you can enter `dbshell` and run `.tables` to inspect the created tables.

```bash
python manage.py migrate

python manage.py dbshell

```

### Create the data models

1. In `polls/models.py`, define the data models around the "polls" theme: `Question` represents a question, and `Choice` represents an option. One question can have multiple choices. Each choice stores its own text and vote count, and it is linked to its parent question through a foreign key. When the parent question is deleted, its related choices are deleted as well.

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

2. After creating the models, install the `polls` app into the `django` project. To include the app in the project, add the dotted path to `INSTALLED_APPS` in `mysite/settings.py` using the `PollsConfig` defined in `polls/apps.py`.

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

3. When the database-related definitions in `models.py` change, run `makemigrations` first to generate migration files, then run `migrate` to apply the changes to the database.
   > - `makemigrations`: generate migration files based on model changes
   > - `migrate`: apply those migration files and sync the database schema

```bash
python manage.py makemigrations
# python manage.py makemigrations polls  # limit the scope
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

> After these definitions are in place, you can use the APIs that Django provides for these data models.
> Run `python manage.py shell` and test them interactively in Python.

### Django admin page

1. Create an administrator account.

```bash
python manage.py createsuperuser

# Username (leave blank to use 'moon'): admin
# Email address: admin@example.com
# Password: nido.1214
# Password (again): nido.1214
# Superuser created successfully.

```

2. Start the server and visit `http://127.0.0.1:8000/admin/`. Sign in with the username and password you just created to access the built-in admin page.

```bash
python manage.py runserver
```

Note that you need to register the models in `polls/admin.py` before you can manage those objects from the admin page.

```py
# admin.py
from django.contrib import admin
from .models import Question, Choice

# Register your models here.
admin.site.register(Question)
admin.site.register(Choice)
```

## Part 3 to Part 7 (temporarily skipped)

---

At this point, the basic Django setup and usage flow is already in place. After running `runserver`, visiting `http://127.0.0.1:8000/polls/` should show the debug text set earlier: "Hello, world. You are at the polls index." The content in **Part 3 to Part 7** mainly focuses on building the actual poll pages, and Part 8 gives a brief introduction to the `DJDT` tool.

## Extra: Package `polls` as a reusable module

---

> Package the `polls` demo app that has already been written, as an example of reusability.

### Prepare the packaging environment

Make sure the required libraries are available in the Python environment used for packaging.

```bash
python -m pip install setuptools
python -m pip install build

```

### The packaging workflow

1. Create a packaging directory named `django-polls` outside the previous project (`django-intro`), then copy the `polls/` directory into it.

```bash
mkdir django-polls

# Assume the packaging directory is at the same level as the previous project directory
# polls        → django_polls (module name)
# django-polls → package name
cp django-intro/polls ./django-polls/django_polls -r    # be sure to rename polls/ to django_polls/

```

2. Update the contents of `django-polls/polls/apps.py` so it looks roughly like this:

```py
# django-polls/polls/app.py
from django.apps import AppConfig

class PollsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "django_polls"
    label = "polls"

```

3. Create `django-polls/README.rst` and `django-polls/LICENSE`. Since this is only for testing whether packaging works, leaving them empty is fine here.

4. Create `django-polls/pyproject.toml` for packaging. A minimal example is shown below.

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

5. To include templates and static files, create a `django-polls/MANIFEST.in` file with the following contents:

```in
recursive-include django_polls/static *
recursive-include django_polls/templates *
```

6. Run `python -m build` inside the `django-polls` directory. The directory structure before and after packaging should look like the following. The generated `.whl` and `.tar.gz` files will be placed in the `dist` directory.

```bash
# Directory structure before packaging
.
├── LICENSE
├── MANIFEST.in
├── django_polls
├── pyproject.toml
└── README.rst

# Directory structure after packaging
.
├── dist
├── django_polls.egg-info
├── LICENSE
├── MANIFEST.in
├── django_polls
├── pyproject.toml
└── README.rst
```

### Install the packaged `polls` app as a user library

1. Prepare a brand-new or separate `django` project. You can reuse the previous Python virtual environment and install the packaged wheel into that environment.

```bash
# Create a new Django project
mkdir polls-pack-test && cd polls-pack-test
django-admin startproject testsite .

# Replace these with your actual venv and dist paths
source [django-intro directory]/.django-intro/bin/activate
pip install [django-polls directory]/dist/django_polls-0.1.0-py3-none-any.whl

```

2. Edit `testsite/settings.py` and add the packaged `django_polls` app to `INSTALLED_APPS`.

```python
INSTALLED_APPS = [
    # ... ...

    # Add the packaged app name
    "django_polls",
]
```

3. Edit `testsite/urls.py`.

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("polls/", include("django_polls.urls")),
]
```

4. Run `migrate` and `runserver`, then visit `[url]/polls` to access the packaged app. Related business data needs to be added again in the new project.

```bash
python manage.py migrate

python manage.py runserver

```

5. For this polls app, you can use the following `seed.py` to generate some random data and verify that the packaged app works correctly when reused. If the Django project name or packaged module name changes, update `seed.py` accordingly.

```python
# seed.py
# Script for bulk-generating database records (and clearing old data)

import os
import django
import datetime
import random

# Initialize the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'testsite.settings')
django.setup()

from django_polls.models import Question, Choice
from django.utils import timezone

# Clear old data
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

# Iterate and create records in the tables
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
