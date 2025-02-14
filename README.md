# Settings web
Веб-приложение библиотеки [Settings](https://github.com/GyverLibs/Settings)

## Как собрать
- Установить [VS Code](https://code.visualstudio.com/download)
- Установить [Node JS](https://nodejs.org/en/download/prebuilt-installer)
- Открыть папку в VS Code
- Консоль **Ctrl + `**
- `npm install`, дождаться установки зависимостей
- `npm run build`
- Проект соберётся в папку dist

## Разработка и отладка
Указать локальный IP платы в файле `webpack.config.js`. Консоль `npm run dev` запустит dev сервер и откроет браузер, будет обновлять сайт при изменениях в коде. Чтобы закрыть - `Ctrl+C` в консоли

## Как использовать
- Кеширование: `index` не кешировать, `js` и `css` кешировать для ускорения загрузки
- Указать gzip header