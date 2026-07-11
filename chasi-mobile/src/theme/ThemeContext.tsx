import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getJSON, setJSON } from '../services/storage'
import { Theme, THEME_MAP, ThemeId } from './themes'

/* ============ Провайдер темы (noir / onyx) ============
   Выбор темы сохраняется в AsyncStorage. useTheme() отдаёт
   полный объект токенов темы + переключатель. */

const THEME_KEY = 'chasi-theme'

type Ctx = { theme: Theme; themeId: ThemeId; setTheme: (id: ThemeId) => void }
const ThemeCtx = createContext<Ctx>({ theme: THEME_MAP.noir, themeId: 'noir', setTheme: () => {} })

export const useTheme = () => useContext(ThemeCtx)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('noir')

  useEffect(() => {
    let alive = true
    getJSON<ThemeId>(THEME_KEY, 'noir').then(id => {
      if (alive && (id === 'noir' || id === 'onyx')) setThemeId(id)
    })
    return () => {
      alive = false
    }
  }, [])

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id)
    void setJSON(THEME_KEY, id)
  }, [])

  const value = useMemo<Ctx>(
    () => ({ theme: THEME_MAP[themeId], themeId, setTheme }),
    [themeId, setTheme],
  )
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>
}
