/* ============ Интеграция с Telegram Mini App ============
   Работает, если сайт открыт внутри Telegram (webview).
   Токен бота здесь НЕ нужен — только на бэкенде для проверки подписи initData. */

type TgUser = { id: number; first_name?: string; last_name?: string; username?: string; language_code?: string }

type TgWebApp = {
  ready: () => void
  expand: () => void
  initData?: string
  initDataUnsafe?: { user?: TgUser }
  colorScheme?: 'light' | 'dark'
  setHeaderColor?: (color: string) => void
  setBackgroundColor?: (color: string) => void
}

declare global {
  interface Window {
    Telegram?: { WebApp?: TgWebApp }
  }
}

export const tg = (): TgWebApp | undefined => window.Telegram?.WebApp

/** Запущены ли мы внутри Telegram (есть подписанные initData). */
export const isTelegram = (): boolean => !!tg()?.initData

/** Имя пользователя из Telegram (для автозаполнения; без проверки подписи). */
export const telegramUserName = (): string | null => {
  const u = tg()?.initDataUnsafe?.user
  if (!u?.first_name) return null
  return [u.first_name, u.last_name].filter(Boolean).join(' ')
}

/** Инициализация Mini App: развернуть на весь экран, задать цвета шапки/фона. */
export function initTelegram(): void {
  const wa = tg()
  if (!wa) return
  try {
    wa.ready()
    wa.expand()
    wa.setHeaderColor?.('#0a0a0d')
    wa.setBackgroundColor?.('#0a0a0d')
  } catch {
    /* вне Telegram — молча пропускаем */
  }
}
