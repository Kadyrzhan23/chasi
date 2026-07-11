import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CartItem } from '../data/mock'
import { repo } from '../services/repository'

/* ============ Корзина (AsyncStorage через repo) ============ */

type CartCtx = {
  items: CartItem[]
  count: number
  ready: boolean
  add: (productId: number, qty?: number) => void
  setQty: (productId: number, qty: number) => void
  remove: (productId: number) => void
  clear: () => void
  giftSetId: number | null
  setGiftSetId: (id: number | null) => void
}

const Ctx = createContext<CartCtx>({
  items: [],
  count: 0,
  ready: false,
  add: () => {},
  setQty: () => {},
  remove: () => {},
  clear: () => {},
  giftSetId: null,
  setGiftSetId: () => {},
})

export const useCart = () => useContext(Ctx)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [giftSetId, setGiftSetIdState] = useState<number | null>(null)
  const [ready, setReady] = useState(false)

  // гидратация из хранилища
  useEffect(() => {
    let alive = true
    Promise.all([repo.getCart(), repo.getGiftSetSelection()]).then(([c, g]) => {
      if (!alive) return
      setItems(c)
      setGiftSetIdState(g)
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  // персистентность позиций (после гидратации)
  const first = useRef(true)
  useEffect(() => {
    if (!ready) return
    if (first.current) {
      first.current = false
      return
    }
    void repo.saveCart(items)
  }, [items, ready])

  const setGiftSetId = useCallback((id: number | null) => {
    setGiftSetIdState(id)
    void repo.saveGiftSetSelection(id)
  }, [])

  const add = useCallback((productId: number, qty = 1) => {
    setItems(prev => {
      const ex = prev.find(i => i.productId === productId)
      if (ex) return prev.map(i => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
      return [...prev, { productId, qty }]
    })
  }, [])

  const setQty = useCallback((productId: number, qty: number) => {
    setItems(prev =>
      qty <= 0
        ? prev.filter(i => i.productId !== productId)
        : prev.map(i => (i.productId === productId ? { ...i, qty } : i)),
    )
  }, [])

  const remove = useCallback((productId: number) => {
    setItems(prev => prev.filter(i => i.productId !== productId))
  }, [])

  const clear = useCallback(() => {
    setItems([])
    setGiftSetId(null)
  }, [setGiftSetId])

  const count = useMemo(() => items.reduce((a, i) => a + i.qty, 0), [items])

  const value = useMemo<CartCtx>(
    () => ({ items, count, ready, add, setQty, remove, clear, giftSetId, setGiftSetId }),
    [items, count, ready, add, setQty, remove, clear, giftSetId, setGiftSetId],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
