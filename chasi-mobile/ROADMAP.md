# CHASI.UZ — мобильное приложение (React Native / Expo)

Перенос Telegram Mini App **CHASI.UZ** (React + Vite, папка `../`) на React Native (Expo SDK 57, TypeScript, React Navigation).

Работа разбита на сессии — каждая рассчитана примерно на один 5-часовой лимит токенов.

## Архитектура

- **Expo + React Navigation** (native-stack + bottom-tabs). Файлы навигации в `src/navigation`.
- **Данные — через сервисный слой.** Весь код обращается к данным только через `src/services/repository.ts` (`repo`). Сейчас источник — локальные мок-данные + `AsyncStorage`. Чтобы подключить реальный сервер, достаточно написать `ApiDataSource`, реализующий интерфейс `DataSource`, и подменить экспорт `repo`. Остальной код менять не нужно.
- **Темы** noir / onyx — `src/theme` (`ThemeProvider`, токены в `themes.ts`). Переключение сохраняется в `AsyncStorage`.
- **i18n** ru / en / uz — `src/i18n` (движок без библиотек, словари перенесены из веба).
- **Сторы** (корзина, избранное, товары/оверрайды, заказы, записи на ТО) — `src/store`, на `AsyncStorage` через `repo`.
- **Тосты** — `src/toast` (нативные, Animated).

## Прогресс по сессиям

- [x] **Сессия 1 — Скелет + инфраструктура.** Проект, навигация, темы, i18n, сервисный слой данных, сторы, тосты, глобальная шапка, экраны-заглушки. Проходит `tsc --noEmit`.
- [ ] **Сессия 2 — Главная + Каталог.** Список, поиск, фильтры, карточки, SVG-визуал часов, бейджи.
- [ ] **Сессия 3 — Товар + Избранное.** Карточка товара, характеристики, теги, похожие, кнопки, начисляемые баллы.
- [ ] **Сессия 4 — Наборы + Корзина/Заказ.** Подарочные наборы, корзина, бокс, оплата, оформление.
- [ ] **Сессия 5 — Лояльность + Кабинет + Паспорт/QR.** Уровни/баллы, покупки, уведомления, паспорта, запись на ТО, QR.
- [ ] **Сессия 6 — Полировка + запуск на устройстве.** Единообразие тем, i18n, пустые состояния, тест в Expo Go. Опционально — CRM.

## Запуск

```bash
cd chasi-mobile
npm install
npx expo start        # затем сканировать QR приложением Expo Go
```

## Структура

```
src/
  components/   AppHeader, Placeholder (далее — карточки, визуалы)
  data/         mock.ts, loyalty.ts        (перенесено из веба, чистые данные)
  i18n/         engine, dict, giftsets
  navigation/   RootNavigator, types
  screens/      Home, Catalog, Product, GiftSets, Cart, Wishlist, Loyalty, Account, Passport
  services/     storage (AsyncStorage), repository (DataSource — точка подключения сервера)
  store/        cart, wishlist, products, orders, bookings, auth, tags
  theme/        ThemeContext, themes, fonts
  toast/        toast, ToastHost
```
