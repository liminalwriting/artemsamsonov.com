# AGENTS.md — artemsamsonov.com

Персональный сайт Артёма Самсонова (Head of Product Design). Продакшен: [https://artemsamsonov.com](https://artemsamsonov.com). Репозиторий: `sayocean450/artemsamsonov.com`.

Это статический портфолио-сайт: главная с опытом и блоком менторства + набор кейс-/статейных страниц. Не SPA и не фреймворк-приложение.

## Стек

| Слой | Технология |
|------|------------|
| Разметка | Pug (миксины-компоненты) |
| Стили | SCSS (Dart Sass) |
| JS | Один бандл, vanilla |
| Сборка | Webpack 4 + `html-webpack-plugin` |
| SEO-артефакты | Gulp (`sitemap`, `robots`, `manifest`) |
| Пакетный менеджер | Yarn (есть и `yarn.lock`, и устаревший `package-lock.json` — предпочитай Yarn) |

`package.json` всё ещё называется `sayocean-me` и в description упоминает старое имя — это наследие, не источник правды о бренде. Бренд сайта: **Артём Самсонов** / `artemsamsonov.com`.

## Быстрый старт

```bash
yarn install
yarn run devserver   # webpack-dev-server, development
yarn run build       # production → папка built/
npx gulp seo         # sitemap.xml, robots.txt, manifest.json в built/
```

После правок контента/стилей/компонентов обычно нужен `yarn run build`, потому что **`built/` — закоммиченный артефакт сборки** (деплой идёт из неё, не из `src/`).

## Архитектура каталогов

```
src/
  pages/<slug>/<slug>.pug   # одна папка = одна HTML-страница
  pages/index/index.scss    # стили только главной (подключены в imports.scss)
  components/<name>/        # Pug-миксин + SCSS рядом
  scss/                     # глобальные токены, сетка, типографика, article
  js/index.js               # Hotjar, --vh, glassmorphism header, tenure counter
  img/ video/ fonts/        # копируются в built/ как есть
built/                      # OUTPUT: HTML + css/style.bundle.css + js/bundle.js + assets
docs/changelog/             # changelog по фичам и крупным изменениям
docs/instructions/          # инструкции по работе с проектом
webpack/                    # модули конфига (pug, scss, script, files, pug-to-html)
gulpfile.js                 # seo-задачи, SITE_URL = https://artemsamsonov.com
.htaccess                   # чистые URL без .html (копируется в built/)
```

### Как появляется страница

1. Создай `src/pages/<slug>/<slug>.pug`.
2. `webpack/pug-to-html.js` подхватывает все `src/pages/**/*.pug` и пишет `built/<slug>.html`.
3. Имя файла Pug **должно совпадать** с именем папки (`jb/jb.pug` → `jb.html`).

### Как устроены компоненты

- Каждый UI-блок — Pug **mixin** в `src/components/<name>/<name>.pug`.
- Стили — `src/components/<name>/<name>.scss`, импорт в `src/scss/imports.scss`.
- Страница `include`-ит нужные миксины и вызывает `+mixinName(...)`.
- HTML в mixin-аргументах часто передаётся как строки с `!=` (неэкранированный вывод) — учитывай XSS только в смысле «не вставляй сырой пользовательский ввод»; контент здесь авторский.

Пример паттерна главной: `+experienceCard(...)`, `+skillCard(...)`, `+caseCard(...)`.

## Страницы

| Файл | Назначение |
|------|------------|
| `index` | Главная: hero, опыт (Mango / getmatch / Wrike), навыки-менторство |
| `getmatch-*` | Кейсы getmatch (карточка, ODO, calc, personas, up) |
| `msteams-*` | Кейсы Microsoft Teams |
| `calendar-from-hell` | Кейс календаря |
| `hakaton` / `hakaton-en` | Хакатон (RU/EN) |
| `jb` | Design exercise JetBrains (EN) |

На главной секция `#cases` и блок `#tags` сейчас **закомментированы** — не включай без явной просьбы.

## Визуальный язык и контент

- Тёмная главная (`body.body_dark` + `+header('dark')`), светлые статьи (`body.body_light`).
- Шрифты: **Roslindale** (заголовки), **PT Root UI** (текст) — локально в `src/fonts/`.
- Токены цвета и отступов: `src/scss/colors.scss` (`$sectionSpacing`, палитра).
- Типографика: `src/scss/typo.scss`; сетка/брейкпоинты: `src/scss/grid.scss`.
- Контент главной и большинства кейсов — **русский**; часть статей — английский. Сохраняй язык страницы.
- Типографика текста: неразрывные пробелы (`\u00A0` / `&#8209;`), короткие ёмкие формулировки, метрики где уместно.
- Не меняй tone of voice на «корпоративный AI»: сайт личный, прямой, продуктовый.

## JS-поведение (не ломай без нужды)

В `src/js/index.js`:

- Hotjar (`hjid: 713452`)
- `--vh` для мобильного viewport
- opacity хедера при скролле (`--bg-opacity`)
- динамический стаж в Mango: `#experience-tenure-mango` от даты `2025-12-01`

Yandex Metrika — в `src/components/metrika/`.

## SEO и мета

- OG/title/description задаются через mixin `+head(...)` в `src/components/head/head.pug`.
- JSON-LD Person / WebSite зашиты в head и на index — при смене должности/компании обновляй и schema, и copy на главной.
- После добавления HTML-страниц запускай `npx gulp seo`, чтобы обновить `built/sitemap.xml`.
- `robots.txt` генерится из `src/robots.template.txt`.

## Правила для агентов

1. **Править источник в `src/`**, затем собирать в `built/`. Не править только HTML в `built/`, если правка должна жить в репозитории.
2. При UI-изменениях обновляй и компонент (Pug/SCSS), и при необходимости `imports.scss`.
3. Новую страницу клади по конвенции `pages/<slug>/<slug>.pug`; не изобретай роутинг.
4. Не обновляй Webpack/Babel/зависимости «на всякий случай» — стек старый (Webpack 4), апгрейды рискованны.
5. Не коммить `node_modules`. `built/` после осмысленной сборки — да, это нормальная практика этого репо.
6. Коммиты в истории часто на русском и по смыслу («Главная: …», «Сборка: обновлён built …»). Следуй этому стилю, если просят закоммитить.
7. Внешние ссылки в шапке: Telegram `t.me/forrrealism`, LinkedIn `linkedin.com/in/a-samsonov/`.
8. `soshnikov-writing` в dependencies — наследие; не опирайся на него без проверки фактического использования.
9. Changelog законченных фич и крупных изменений веди отдельными Markdown-файлами в `docs/changelog/`. Называй файл по фиче (`getmatch-odo-redesign.md`) и фиксируй пользовательские и технические изменения.
10. Инструкции по типовым задачам (шрифты и т.п.) — в `docs/instructions/`.

## Типичные задачи

| Задача | Куда смотреть |
|--------|----------------|
| Текст/опыт/навыки на главной | `src/pages/index/index.pug` |
| Карточка опыта | `src/components/experience-card/` |
| Карточка навыка / кейса | `skill-card/`, `case-card/` |
| Стили статей | `src/scss/article.scss` |
| Глобальные цвета/типографика | `src/scss/colors.scss`, `typo.scss` |
| Новый локальный шрифт | `docs/instructions/adding-fonts.md` |
| Новая страница-кейс | скопируй `template-case`; инструкция — `docs/instructions/creating-case-from-template.md` |
| Деплой-проверка | `yarn run build` → открыть `built/index.html` / devserver |

## Чего здесь нет

- Нет React/Vue/Next, нет TypeScript, нет API/бэкенда, нет тестов.
- Нет CMS: весь контент в Pug.
- Нет env-секретов в репо (аналитика захардкожена в шаблонах/JS).
