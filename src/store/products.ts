import { useSyncExternalStore } from 'react'
import { LOW_STOCK, Product, products as baseProducts } from '../data/mock'

/* ============ Управление товарами (localStorage overrides) ============
   База товаров лежит в mock.ts. Здесь — изменяемые в CRM поля
   (название, цена, характеристики, остаток, скидка), которые
   накладываются поверх базы и сразу отражаются на витрине. Без сервера. */

// Поля товара, которые можно править в CRM
export type EditableField =
  | 'name' | 'brand' | 'category' | 'style' | 'gender' | 'price'
  | 'diameter' | 'glass' | 'water' | 'reserve' | 'movement' | 'stock' | 'discount'

export type ProductOverride = Partial<Pick<Product, EditableField>>

const KEY = 'chasi-products'

let cache: Record<number, ProductOverride> | null = null
const listeners = new Set<() => void>()

function read(): Record<number, ProductOverride> {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Record<number, ProductOverride>) : {}
  } catch {
    return {}
  }
}

function getOverrides(): Record<number, ProductOverride> {
  if (cache === null) cache = read()
  return cache
}

function write(map: Record<number, ProductOverride>) {
  cache = map
  localStorage.setItem(KEY, JSON.stringify(map))
  listeners.forEach(fn => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

function setOverride(id: number, patch: ProductOverride) {
  const cur = getOverrides()
  write({ ...cur, [id]: { ...cur[id], ...patch } })
}

export const setStock = (id: number, stock: number) => setOverride(id, { stock: Math.max(0, Math.round(stock)) })
export const setDiscount = (id: number, discount: number) => setOverride(id, { discount })

/* полное редактирование любого набора полей */
export const updateProduct = (id: number, patch: ProductOverride) => setOverride(id, patch)

/* сброс товара к исходным (базовым) данным */
export function resetProduct(id: number) {
  const cur = getOverrides()
  const next = { ...cur }
  delete next[id]
  write(next)
}

/* есть ли у товара несохранённые правки относительно базы */
export const hasOverride = (id: number) => !!getOverrides()[id]

/* --- применение оверрайда к товару ---
   Статус наличия жёстко выводится из остатка:
   0 шт → под заказ, >0 → в наличии. Остаток — единый источник правды. */
function apply(p: Product, o?: ProductOverride): Product {
  const m: Product = o ? { ...p, ...o } : { ...p }
  m.inStock = m.stock > 0
  return m
}

/* --- цена со скидкой --- */
export const effectivePrice = (p: Product) =>
  p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price

/* --- срочность по остатку --- */
export const isLowStock = (p: Product) => p.inStock && p.stock > 0 && p.stock <= LOW_STOCK
export const isLastOne = (p: Product) => p.inStock && p.stock === 1

/* --- React-хуки: живые товары с учётом правок CRM --- */
export function useProducts(): Product[] {
  const ov = useSyncExternalStore(subscribe, getOverrides, getOverrides)
  return baseProducts.map(p => apply(p, ov[p.id]))
}

export function useProduct(id: number): Product | undefined {
  return useProducts().find(p => p.id === id)
}
