import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { CartItem, products } from '../data/mock'

/* ============ Корзина (localStorage, без сервера) ============ */

const KEY = 'chasi-cart'

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const arr = JSON.parse(raw) as CartItem[]
    // отфильтруем товары, которых уже нет в каталоге
    return arr.filter(i => products.some(p => p.id === i.productId) && i.qty > 0)
  } catch {
    return []
  }
}

const GKEY = 'chasi-giftset'
function loadGiftSet(): number | null {
  const raw = localStorage.getItem(GKEY)
  return raw ? Number(raw) : null
}

type CartCtx = {
  items: CartItem[]
  count: number
  add: (productId: number, qty?: number) => void
  setQty: (productId: number, qty: number) => void
  remove: (productId: number) => void
  clear: () => void
  giftSetId: number | null
  setGiftSetId: (id: number | null) => void
}

const Ctx = createContext<CartCtx>({
  items: [], count: 0, add: () => {}, setQty: () => {}, remove: () => {}, clear: () => {},
  giftSetId: null, setGiftSetId: () => {},
})

export const useCart = () => useContext(Ctx)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [giftSetId, setGiftSetIdState] = useState<number | null>(loadGiftSet)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items))
  }, [items])

  const setGiftSetId = useCallback((id: number | null) => {
    setGiftSetIdState(id)
    if (id === null) localStorage.removeItem(GKEY)
    else localStorage.setItem(GKEY, String(id))
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
    () => ({ items, count, add, setQty, remove, clear, giftSetId, setGiftSetId }),
    [items, count, add, setQty, remove, clear, giftSetId, setGiftSetId],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
