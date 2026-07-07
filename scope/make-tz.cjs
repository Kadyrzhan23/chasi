const fs = require('fs')
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, PageNumber, TabStopType, TabStopPosition,
} = require('docx')

const GOLD = 'B8934F', DARK = '1A1A22', GREY = '666666', LIGHT = 'F5EFE3'
const CW = 9026 // A4, поля 1 дюйм

const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' }
const borders = { top: border, bottom: border, left: border, right: border }
const margins = { top: 80, bottom: 80, left: 120, right: 120 }

const P = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120, ...(opts.spacing || {}) },
    ...opts.par,
    children: [new TextRun({ text, size: 22, color: DARK, ...opts })],
  })

const bullet = (text, bold0) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 60 },
    children: bold0
      ? [new TextRun({ text: bold0, bold: true, size: 22 }), new TextRun({ text, size: 22 })]
      : [new TextRun({ text, size: 22 })],
  })

const H1 = t => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(t)] })
const H2 = t => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(t)] })

function cell(text, { w, head = false, bold = false, fill } = {}) {
  return new TableCell({
    borders, margins,
    width: { size: w, type: WidthType.DXA },
    shading: fill || head ? { fill: fill || DARK, type: ShadingType.CLEAR } : undefined,
    children: [new Paragraph({
      children: [new TextRun({ text, size: head ? 20 : 21, bold: head || bold, color: head ? 'FFFFFF' : DARK })],
    })],
  })
}

/** таблица работ: [работа, результат] */
function workTable(rows) {
  const w1 = 5426, w2 = 3600
  return new Table({
    width: { size: CW, type: WidthType.DXA },
    columnWidths: [w1, w2],
    rows: [
      new TableRow({ tableHeader: true, children: [cell('Состав работ', { w: w1, head: true }), cell('Результат', { w: w2, head: true })] }),
      ...rows.map(([a, b]) => new TableRow({ children: [cell(a, { w: w1 }), cell(b, { w: w2 })] })),
    ],
  })
}

/* ============================== ДОКУМЕНТ ============================== */

const children = [
  // ---- титул ----
  new Paragraph({ spacing: { before: 2400 } }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'CHASI.UZ', size: 72, bold: true, color: GOLD })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200 }, children: [new TextRun({ text: 'ТЕХНИЧЕСКОЕ ЗАДАНИЕ', size: 40, bold: true, color: DARK })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120 }, children: [new TextRun({ text: 'на разработку e-commerce платформы бутика часов', size: 26, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 2000 }, children: [new TextRun({ text: 'Назначение документа: оценка стоимости и сроков разработки.', size: 22, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Документ можно передавать любым подрядчикам для получения коммерческих предложений.', size: 22, color: GREY })] }),
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 400 }, children: [new TextRun({ text: 'Версия 1.0 · июль 2026 · г. Ташкент', size: 22, color: GREY })] }),
  new Paragraph({ pageBreakBefore: true, children: [] }),

  // ---- 1. О проекте ----
  H1('1. О проекте'),
  P('Заказчик — бутик часов в Ташкенте (розничные продажи оригинальных швейцарских часов и реплик, более 10 лет на рынке, действующий сайт на WordPress/WooCommerce). Цель проекта — заменить шаблонный сайт на собственную e-commerce платформу с CRM, программой удержания клиентов и Telegram-интеграцией.'),
  P('Платформа состоит из четырёх частей: клиентский сайт (витрина и личный кабинет), серверное приложение (API и бизнес-логика), административная панель (CRM для владельца и персонала) и Telegram-бот (уведомления и продажи).'),
  P('Интерактивный прототип интерфейсов готов и передаётся подрядчику вместе с этим документом — он определяет дизайн и поведение всех экранов.'),

  H1('2. Рекомендуемый технологический стек'),
  P('Подрядчик может предложить аналоги с обоснованием. Требования: открытые технологии без привязки к SaaS-конструкторам, код и данные — собственность заказчика.'),
  bullet('React + TypeScript (готовый прототип уже на этом стеке), адаптивная вёрстка, SSR для SEO (Next.js или аналог).', 'Frontend: '),
  bullet('Node.js (NestJS) или Python (Django/FastAPI), PostgreSQL, Redis.', 'Backend: '),
  bullet('REST или GraphQL API, JWT-авторизация.', 'API: '),
  bullet('VPS/облако, Docker, CI/CD, ежедневные бэкапы, мониторинг.', 'Инфраструктура: '),

  // ---- 3. Объём работ ----
  H1('3. Объём работ'),

  H2('3.1. UI/UX дизайн'),
  workTable([
    ['Дизайн-система: типографика, цвета, компоненты (тёмная премиальная тема по прототипу)', 'Figma-библиотека'],
    ['Макеты: главная, каталог с фильтрами, карточка товара, корзина и оформление заказа, личный кабинет (5 разделов), цифровой паспорт часов, страницы контента', 'Макеты всех экранов, десктоп + мобайл'],
    ['Макеты админ-панели (CRM): 6+ разделов', 'Макеты CRM'],
    ['Прототипирование ключевых сценариев и анимаций', 'Кликабельный прототип'],
  ]),

  H2('3.2. Frontend — клиентский сайт'),
  workTable([
    ['Главная страница с анимациями по прототипу', 'Адаптивная страница'],
    ['Каталог: фильтры (класс товара, бренд, стиль, пол, цена, диаметр/запястье, водозащита, запас хода, наличие), сортировка, поиск', 'Каталог с мгновенной фильтрацией'],
    ['Карточка товара: галерея, характеристики, видео, похожие товары', 'Страница товара'],
    ['Скрытие цен до авторизации; вход по номеру телефона (SMS/Telegram OTP)', 'Механика авторизации'],
    ['Корзина, оформление заказа, онлайн-оплата', 'Checkout'],
    ['Личный кабинет: покупки, цифровые паспорта часов, wishlist с очередью, trade-in с загрузкой фото, уведомления, баллы', 'Кабинет, 5+ разделов'],
    ['Страница цифрового паспорта часов (открывается по QR-коду)', 'Публичная страница паспорта'],
    ['Мультиязычность: русский, узбекский', '2 локали'],
    ['SEO: SSR, микроразметка, человекочитаемые URL, скорость (Core Web Vitals)', 'Технический SEO-пакет'],
  ]),

  H2('3.3. Backend — серверное приложение'),
  workTable([
    ['Проектирование БД и API', 'Схема БД, спецификация API'],
    ['Каталог: товары, категории, атрибуты, остатки, цены в USD/UZS с автокурсом', 'Модуль каталога'],
    ['Пользователи: OTP-авторизация, профили, сегменты', 'Модуль пользователей'],
    ['Заказы и статусы, история', 'Модуль заказов'],
    ['Трекинг поведения: просмотры товаров по клиентам, события', 'Система событий'],
    ['Движок триггерных акций (правила «N просмотров → скидка X%», лимиты, антифрод, сгорание промокодов)', 'Триггерный движок'],
    ['Лист ожидания и предзаказы с депозитами', 'Модуль спроса'],
    ['Программа лояльности: баллы, уровни, рефералы', 'Модуль лояльности'],
    ['Trade-in: заявки с фото, оценка, статусы', 'Модуль trade-in'],
    ['Сервисный модуль: паспорта часов, гарантия, график ТО, напоминания, запись на визиты', 'Сервисный модуль'],
    ['Очередь уведомлений: Telegram, SMS, приоритеты и расписания', 'Модуль уведомлений'],
  ]),

  H2('3.4. Админ-панель (CRM)'),
  workTable([
    ['Дашборд: продажи, визиты, просмотры, конверсия за периоды (день/7 дней/месяц)', 'Аналитический дашборд'],
    ['Управление каталогом и остатками', 'Раздел «Товары»'],
    ['Заказы: обработка, статусы', 'Раздел «Заказы»'],
    ['Клиенты: карточка клиента с историей просмотров и покупок, LTV, сегменты', 'Раздел «Клиенты»'],
    ['Интересы: кто какой товар смотрел N раз, отправка персональной скидки в 1 клик', 'Раздел «Интересы»'],
    ['Спрос: лист ожидания по моделям, депозиты, потенциальная выручка', 'Раздел «Спрос»'],
    ['Trade-in заявки: фото, оценка, статусы', 'Раздел «Trade-in»'],
    ['Сервис: клиенты с приближающимся ТО, отправка напоминаний, календарь записей', 'Раздел «Сервис»'],
    ['Настройка правил акций и рассылок без программиста', 'Конструктор правил'],
    ['Роли и права доступа (владелец, менеджер, мастер)', 'Ролевая модель'],
  ]),

  H2('3.5. Интеграции'),
  workTable([
    ['Приём платежей Click и Payme (оплата заказов и депозитов)', 'Работающие платежи'],
    ['Рассрочка (Uzum Nasiya или банковская — по выбору заказчика)', 'Оплата в рассрочку'],
    ['SMS-шлюз (Eskiz.uz или аналог)', 'SMS-уведомления'],
    ['Google Analytics 4 / Яндекс.Метрика, пиксели соцсетей', 'Веб-аналитика'],
    ['Автоматический курс USD/UZS (ЦБ РУз)', 'Автокурс валют'],
  ]),

  H2('3.6. Telegram-бот'),
  workTable([
    ['Авторизация по номеру телефона через бота (связка с сайтом)', 'Вход через Telegram'],
    ['Уведомления клиентам: скидки, поступления из листа ожидания, статусы заказов, напоминания о ТО', 'Бот-рассыльщик'],
    ['Мини-каталог и приём заказов в боте', 'Продажи в Telegram'],
    ['Ежедневный отчёт владельцу: продажи, топ просмотров, новые заявки', 'Отчёты владельцу'],
  ]),

  H2('3.7. Инфраструктура и DevOps'),
  workTable([
    ['Настройка сервера, домена, SSL', 'Рабочее окружение'],
    ['Docker, CI/CD (автоматическое развёртывание)', 'Пайплайн'],
    ['Ежедневные бэкапы БД, мониторинг, алерты', 'Резервирование'],
    ['Перенос контента со старого сайта, настройка 301-редиректов (сохранение SEO)', 'Миграция без потери позиций'],
  ]),

  H2('3.8. Тестирование и запуск'),
  workTable([
    ['Функциональное и кроссбраузерное тестирование, мобильные устройства', 'Отчёт QA'],
    ['Нагрузочное тестирование, безопасность (OWASP)', 'Отчёт'],
    ['Наполнение каталога (до 200 товаров), обучение персонала', 'Готовый к работе магазин'],
    ['Документация: инструкция администратора, техническая документация', 'Комплект документации'],
  ]),

  // ---- 4. Этапы ----
  H1('4. Этапность'),
  bullet('дизайн, каталог с фильтрами, авторизация со скрытием цен, корзина и оплата Click/Payme, базовая админка, деплой.', 'Этап 1 (MVP): '),
  bullet('личный кабинет, цифровые паспорта часов, сервисный модуль ТО, триггерные скидки, лист ожидания с депозитами, Telegram-бот.', 'Этап 2: '),
  bullet('лояльность и рефералы, trade-in, рассрочка, мультиязычность, расширенная аналитика.', 'Этап 3: '),

  // ---- 6. Что включить в смету ----
  H1('5. Что подрядчик обязан включить в предложение'),
  bullet('Оценку трудозатрат (в часах) и стоимость по каждому этапу из раздела 3 — по этой структуре предложения легко сравнивать между собой.'),
  bullet('Состав команды (роли, занятость) и график работ по неделям.'),
  bullet('Стоимость ежемесячной поддержки после запуска (SLA: время реакции на сбой).'),
  bullet('Стоимость инфраструктуры в месяц (сервер, SMS, домен).'),
  bullet('Гарантийный срок на исправление дефектов (рекомендуется от 3 месяцев, бесплатно).'),
  bullet('Подтверждение: исходный код, БД и все доступы — собственность заказчика (передаются в Git-репозиторий заказчика).'),
  bullet('Портфолио: 2–3 похожих e-commerce проекта с ссылками.'),

  // ---- 7. Приёмка ----
  H1('6. Критерии приёмки'),
  bullet('Все функции разделов 3.1–3.8 работают на реальных данных без критических дефектов.'),
  bullet('Скорость: загрузка страниц ≤ 2,5 сек на мобильном (4G), Google PageSpeed ≥ 85.'),
  bullet('Корректная работа в Chrome, Safari, Firefox и на iOS/Android.'),
  bullet('Оплата, SMS и Telegram-уведомления проверены на боевых интеграциях.'),
  bullet('Персонал обучен, документация передана, код — в репозитории заказчика.'),
]

const doc = new Document({
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 30, bold: true, font: 'Arial', color: DARK },
        paragraph: { spacing: { before: 320, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: GOLD, space: 2 } } } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 25, bold: true, font: 'Arial', color: GOLD },
        paragraph: { spacing: { before: 240, after: 140 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: {
      default: new Header({ children: [new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: 'CHASI.UZ · Техническое задание', size: 18, color: GREY }),
          new TextRun({ text: '\tдля оценки стоимости разработки', size: 18, color: GREY }),
        ],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: 'Стр. ', size: 18, color: GREY }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: GREY })],
      })] }),
    },
    children,
  }],
})

Packer.toBuffer(doc).then(b => { fs.writeFileSync(process.argv[2] || 'tz.docx', b); console.log('OK') })
