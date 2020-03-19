# Структура папок и файлов

```text
cyberless_template
├── src
│   ├── attach
│   │   ├── .htaccess
│   │   └── robots.txt
│   ├── img
│   ├── js
│   │   ├── modules
│   │   │   ├── forms.js
│   │   │   └── modals.js
│   │   ├── app.js
│   │   ├── config.js
│   │   └── init.js
│   ├── pug
│   │   ├── mixins
│   │   │   ├── bemto-master
│   │   │   ├── mixin-loader.pug
│   │   │   └── svg.pug
│   │   ├── layouts
│   │   │   ├── header.pug
│   │   │   ├── base.pug
│   │   │   └── footer.pug
│   │   ├── pages
│   │   │   ├── main.pug
│   │   │   └── index.pug
│   │   └── base.pug
│   ├── fonts
│   ├── icons
│   └── sass
│       ├── defaults
│       │   ├── _!fonts.scss
│       │   ├── _!let.scss
│       │   ├── _!libs.scss  
│       │   ├── _!media.scss
│       │   ├── _!simple.scss
│       │   ├── _keyframes.scss
│       │   └── _content.scss
│       ├── mixins
│       │   ├── _font-face.scss
│       │   └── _placeholder.scss
│       ├── modules
│       │   ├── _!btn.scss
│       │   ├── _footer.scss
│       │   └── _header.scss
│       │   
│       └── app.scss
```

## `src`

В папке `src` хранятся исходные файлы проекта.

## `src/img`

Папка `img` предназначена для хранения изображений.
При сборке файлы из данной папки попадают в `dist/app/img`.

## `src/fonts`

Папка `src/fonts` предназначена шрифтов.
При сборке файлы из данной папки попадают в `dist/app/fonts`.

## `src/icons`

Папка `src/icons` предназначена svg иконок.
При сборке файлы из данной папки попадают в `dist/app/icons`.

## `src/js`

Папка `src/js` предназначена для хранения скриптов.

## `src/js/modules`

Папка `src/js/modules` предназначена для хранения js модулей.

## `src/js/app.js`

Файл `src/js/app.js` предназначен для хранения основной логики сайта.
При сборке данный файл попадает в `dist/app/js`.

## `src/js/config.js`

Файл `src/js/config.js` предназначен для хранения объекта общих данных (debug, вспомогательные функции, переменные ...).

## `src/js/init.js`

Файл `src/js/init.js` предназначен для инициализации объектов модулей.

## `src/pug`

Папка `src/pug` предназначена для хранения шаблонов.

## `src/pug/mixins`

Папка `src/pug/mixins` предназначена для хранения Pug-миксинов.

## `src/pug/mixins/mixin-loader.pug`

В файле `src/pug/mixins/mixin-loader.pug` подключаются все миксины.

## `src/pug/mixins/svg.pug`

В файле `src/pug/mixins/svg.pug` хранится Pug-миксин для подключения SVG-иконок.

## `src/pug/layouts`

Папка `src/pug/layouts` предназначена для хранения частей pug шаблонов (header, footer, ...).

## `pug/layouts/base.pug`

В файле `pug/layouts/base.pug` хранится базовый шаблон страниц сайта.

## `src/pug/pages`

Папка `src/pug/pages` предназначена для хранения страниц сайта.

## `pug/pages/index.pug`

В файле `pug/pages/index.pug` хранится разметка главной страницы со списком других.

## `pug/pages/main.pug`

`pug/pages/main.pug` - пример страницы сайта.

## `src/sass`

Папка `src/sass` предназначена для хранения стилей.

## `src/sass/mixins`

Папка `src/sass/mixins` предназначена для хранения SASS-миксинов и функций.

## `src/sass/defaults`

Папка `src/sass/defaults` предназначена для хранения базовых SASS стилей.

## `src/sass/defaults/_!fonts.scss`

Файл `src/sass/defaults/_!fonts.scss` предназначен для хранения стилей шрифтов.

## `src/sass/defaults/_!let.scss`

Файл `src/sass/defaults/_!let.scss` предназначен для хранения переменных.

## `src/sass/defaults/_!libs.scss`

Файл `src/sass/defaults/_!libs.scss` предназначен для хранения стилей плагинов из node_modules.

## `src/sass/defaults/_!media.scss`

Файл `src/sass/defaults/_!media.scss` хранит переменные для media запросов.

## `src/sass/defaults/_!simple.scss`

Файл `src/sass/defaults/_!simple.scss` предназначен для хранения базовых стилей.

## `src/sass/defaults/_content.scss`

Файл `src/sass/defaults/_content.scss` предназначен для хранения типографики.

## `src/sass/defaults/_keyframes.scss`

Файл `src/sass/defaults/_keyframes.scss` хранит keyframes анимаций.

## `src/sass/modules`

Папка `src/sass/modules` предназначена для хранения БЭМ блоков.

