# Как добавить новый шрифт

Локальные шрифты лежат в `src/fonts/`, объявляются через `@font-face` в `src/scss/typo.scss` и копируются в `built/fonts/` при сборке. Webpack **не** обрабатывает `url()` в CSS (`css-loader` с `url: false`), поэтому путь в `@font-face` должен оставаться рабочим относительно собранного файла `built/css/style.bundle.css`.

## Шаги

1. **Положи файлы в `src/fonts/`**  
   Имена — латиница, без пробелов, в нижнем регистре: `family-weight.ext` (например `roslindale-bold.otf`, `pt-root.woff2`).

2. **Форматы**  
   Предпочтительный набор: **woff2** + **woff** (как у PT Root UI).  
   OTF/TTF допустимы, если других файлов нет (как у Roslindale), но для продакшена лучше конвертировать в woff2.

3. **Добавь `@font-face` в `src/scss/typo.scss`**  
   Путь всегда `../fonts/<file>` — от `built/css/` это попадает в `built/fonts/`.

   ```scss
   @font-face {
     font-family: 'My Font';
     src: url('../fonts/my-font.woff2') format('woff2'),
          url('../fonts/my-font.woff') format('woff');
     font-weight: normal;   // или 400 / 700 и т.д.
     font-style: normal;    // или italic
     font-display: swap;
   }
   ```

   Для нескольких начертаний — отдельный `@font-face` на каждое, с одним и тем же `font-family` и разными `font-weight` / `font-style`.

4. **Подключи семейство в типографике**  
   Обнови переменные в начале `typo.scss` (`$fontH1`, `$fontMain` и т.д.) или используй `font-family` точечно в нужных стилях. Укажи разумный fallback-стек (serif / sans-serif).

5. **Собери проект**  
   ```bash
   yarn run build
   ```  
   `CopyWebpackPlugin` скопирует всё из `src/fonts/` в `built/fonts/`. Без сборки новые файлы на прод не попадут — `built/` коммитится.

## Чего не делать

- Не клади шрифты только в `built/fonts/` — источник правды `src/fonts/`.
- Не меняй путь на `/fonts/...` или `../../fonts/...`: при `url: false` в бандле останется ровно то, что написано, и сломается относительно `built/css/`.
- Не подключай локальный шрифт через Google Fonts / CDN, если файлы уже в репо. Внешние шрифты (сейчас Cormorant Garamond, Material Icons) — отдельный случай; для брендовых семейств сайта используй self-host.
- Не забывай `font-display: swap`, чтобы текст не ждал загрузки шрифта.

## Проверка

1. В DevTools → Network фильтр `Font`: файлы отдаются с `200` из `/fonts/...`.
2. В Computed styles у нужного элемента видно новое `font-family`.
3. Имя файла в `@font-face` **точно** совпадает с именем в `src/fonts/` (опечатки вроде `roslindate` вместо `roslindale` молча дают fallback).
