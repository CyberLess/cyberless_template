# Работа с шаблонизатором Pug

В сборке используется шаблонизатор [Pug](https://pugjs.org/) (ранее назывался Jade).  

А так же набор миксинов для ускоренного написания БЭМ - [bemto](https://github.com/kizu/bemto)  

Pug предоставляет множество возможностей, упрощающих работу с шаблонами:

* Переменные.
* Циклы.
* Условия.
* Фильтры.
* Наследование шаблонов.
* Миксины.

## Автоматизация

* При компиляции файлов, сборка ищет союзы и предлоги, и добавляет к ним `&nbsp;`, тем самым делая их неразрывными со следующим словом, и убирая "висячие предлоги". 
* В сборке зарезервирован файл `src/pug/pages/index.pug`, он отображает список всех страниц. При изменении разметки, автоматически создается список всех страниц на главной.
* Пути `/img/` автоматически заменяются на `/app/img/`.

## Файловая структура

Страницы размещаются в `src/pug/pages`, части шаблонов в `src/pug/layouts`, а дополнительные миксины в `src/pug/mixins`:

```text
cyberless_template
└── src
    └── pug
        ├── layouts
        │   ├── base.pug
        │   ├── main.pug
        │   └── modals.pug
        ├── mixins
        │   ├── svg.pug
        │   └── mixin-loader.pug
        └── pages
            ├── index.pug
            └── main.pug
```

## GULP таск

За сборку и преобразование Pug в HTML отвечает задача `pug`:

```bash
gulp pug
```

После выполнения команды в папке `dist` появятся HTML-файлы:

```text
cyberless_template
└── dist
    ├── index.html
    └── main.html
```

## Базовый шаблон и создание страниц

В качестве базового шаблона используется `src/pug/base.pug`.

Пример наследования и использования шаблона:

```jade
extends ../layouts/base

append vars
  - title = 'Главная';

block content
  // Содержимое страницы
```

Базовый шаблон определяет блоки (участки кода или место в шаблоне), которые можно изменять и дополнять при наследовании.

### `vars`

Блок `vars` хранит основные настройки шаблона:

* `title` — заголовок страницы (используется в `<title>` и метатегах).

* `description` — описание страницы (используется в метатегах).

* `image` — изображение страницы (используется в метатегах).

* `html` — настройки тега `<html>`:
  * `html.attrs` — объект для задания дополнительных атрибутов.
  * `html.classList` — массив классов.

* `body` — настройки тега `<body>`:
  * `body.attrs` — объект для задания дополнительных атрибутов.
  * `body.classList` — массив классов.

* `meta` — значения метатегов.

* `link` — значения тегов `<link>`.

Пример использования:

```jade
prepend vars
    - title = 'Заголовок'
    - description = 'Описание'
    - image = 'http://example.com/images/image.png'

append vars
    - link.icon16x16 = '/favicon_16x16.png'
    - link.icon32x32 = '/favicon_32x32.png'
```

### `head-start`

Блок `head-start` является альтернативой `prepend meta`.

### `meta`

В блоке `meta` подключаются метатеги.

Пример использования:

```jade
append meta
    meta(name="referrer" content="none")
```

### `links`

В блоке `links` подключаются внешние ресурсы.

Пример использования:

```jade
append links
    link(rel="prefetch" href="/images/background.jpg")
```

### `styles`

В блоке `styles` подключаются стили.

Пример использования:

```jade
append styles
    link(rel="stylesheet" href="/css/custom.css")
```

### `head-end`

Блок `head-end` является альтернативой `append links`.

### `body-start`

Блок `body-start` является альтернативой `prepend content`.

### `content`

Блок `content` предназначен для хранения содержимого страницы.

Пример использования:

```jade
block content
    .container
        h1
            | Заголовок страницы
```

### `scripts`

В блоке `scripts` подключаются скрипты.

Пример использования:

```jade
append scripts
    script(src="/js/custom.js")
```

### `body-end`

Блок `body-end` является альтернативой `append scripts`.

