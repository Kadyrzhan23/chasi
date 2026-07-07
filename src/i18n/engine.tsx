import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { dict } from './dict'

/* ============ Лёгкий i18n (без библиотек) ============
   Контекст языка + t(key, vars) + сохранение в localStorage.
   Витрина переводится; CRM остаётся на русском. */

export type Lang = 'ru' | 'en' | 'uz'
export const LANGS: { id: Lang; label: string }[] = [
  { id: 'ru', label: 'RU' },
  { id: 'en', label: 'EN' },
  { id: 'uz', label: 'UZ' },
]

type Vars = Record<string, string | number>

function lookup(lang: Lang, key: string): unknown {
  return key.split('.').reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), dict[lang])
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (key: string, vars?: Vars) => string }
const I18nCtx = createContext<Ctx>({ lang: 'ru', setLang: () => {}, t: k => k })

export const useI18n = () => useContext(I18nCtx)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const l = localStorage.getItem('chasi-lang')
    return l === 'en' || l === 'uz' || l === 'ru' ? l : 'ru'
  })

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('chasi-lang', l)
    document.documentElement.lang = l
  }, [])

  const t = useCallback((key: string, vars?: Vars) => {
    let s = lookup(lang, key)
    if (typeof s !== 'string') s = lookup('ru', key)
    if (typeof s !== 'string') return key
    let out = s
    if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v))
    return out
  }, [lang])

  const value = useMemo<Ctx>(() => ({ lang, setLang, t }), [lang, setLang, t])
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>
}
