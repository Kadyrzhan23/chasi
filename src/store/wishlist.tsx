import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

/* ============ Wishlist / избранное (localStorage) ============
   Хранит id понравившихся товаров. Доступно всем (не только клиентам). */

const KEY = 'chasi-wishlist'

function load(): number[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as number[]
    return Array.isArray(arr) ? arr.filter(n => typeof n === 'number') : []
  } catch {
    return []
  }
}

type WishCtx = {
  ids: number[]
  count: number
  has: (id: number) => boolean
  toggle: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

const Ctx = createContext<WishCtx>({
  ids: [], count: 0, has: () => false, toggle: () => {}, remove: () => {}, clear: () => {},
})

export const useWishlist = () => useContext(Ctx)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids])

  const has = useCallback((id: number) => ids.includes(id), [ids])
  const toggle = useCallback((id: number) => {
    setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev]))
  }, [])
  const remove = useCallback((id: number) => setIds(prev => prev.filter(x => x !== id)), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo<WishCtx>(
    () => ({ ids, count: ids.length, has, toggle, remove, clear }),
    [ids, has, toggle, remove, clear],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
