import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { repo } from '../services/repository'

/* ============ Wishlist / избранное (AsyncStorage через repo) ============
   Хранит id понравившихся товаров. Доступно всем (не только клиентам). */

type WishCtx = {
  ids: number[]
  count: number
  ready: boolean
  has: (id: number) => boolean
  toggle: (id: number) => void
  remove: (id: number) => void
  clear: () => void
}

const Ctx = createContext<WishCtx>({
  ids: [],
  count: 0,
  ready: false,
  has: () => false,
  toggle: () => {},
  remove: () => {},
  clear: () => {},
})

export const useWishlist = () => useContext(Ctx)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<number[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    repo.getWishlist().then(w => {
      if (!alive) return
      setIds(w)
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  const first = useRef(true)
  useEffect(() => {
    if (!ready) return
    if (first.current) {
      first.current = false
      return
    }
    void repo.saveWishlist(ids)
  }, [ids, ready])

  const has = useCallback((id: number) => ids.includes(id), [ids])
  const toggle = useCallback((id: number) => {
    setIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [id, ...prev]))
  }, [])
  const remove = useCallback((id: number) => setIds(prev => prev.filter(x => x !== id)), [])
  const clear = useCallback(() => setIds([]), [])

  const value = useMemo<WishCtx>(
    () => ({ ids, count: ids.length, ready, has, toggle, remove, clear }),
    [ids, ready, has, toggle, remove, clear],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
