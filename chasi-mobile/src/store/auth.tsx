import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

/* ============ Авторизация (демо) ============
   В вебе автологин делал Telegram Mini App. В нативном приложении
   пока оставляем ручной демо-вход (кнопка «Войти»); позже сюда
   встанет реальная авторизация (телефон/OTP или OAuth) через repo. */

const DEMO_NAME = 'Азиз'

type AuthCtx = { authed: boolean; name: string; toggle: () => void }
const Ctx = createContext<AuthCtx>({ authed: false, name: DEMO_NAME, toggle: () => {} })

export const useAuth = () => useContext(Ctx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const toggle = useCallback(() => setAuthed(a => !a), [])
  const value = useMemo<AuthCtx>(() => ({ authed, name: DEMO_NAME, toggle }), [authed, toggle])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
