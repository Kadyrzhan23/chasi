import { useSyncExternalStore } from 'react'
import { LOW_STOCK, Product } from '../data/mock'
import { repo } from '../services/repository'
import type { ProductOverride } from './productTypes'

export type { EditableField, ProductOverride } from './productTypes'

/* ============ Живой каталог с учётом правок CRM ============
   База товаров приходит из repo (сейчас — мок, позже — сервер).
   Оверрайды (изменяемые в CRM поля) хранятся локально и
   накладываются поверх базы. Реализовано как внешний стор
   с гидратацией из AsyncStorage при старте. */

let base: Product[] = []
let overrides: Record<number, ProductOverride> = {}
let hydrated = false
let computed: Product[] = []
const listeners = new Set<() => void>()

/* Статус наличия жёстко выводится из остатка: 0 → под заказ, >0 → в наличии. */
function apply(p: Product, o?: ProductOverride): Product {
  const m: Product = o ? { ...p, ...o } : { ...p }
  m.inStock = m.stock > 0
  return m
}

function recompute() {
  computed = base.map(p => apply(p, overrides[p.id]))
  listeners.forEach(fn => fn())
}

async function hydrate() {
  if (hydrated) return
  hydrated = true
  const [b, o] = await Promise.all([repo.getProducts(), repo.getProductOverrides()])
  base = b
  overrides = o
  recompute()
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  void hydrate()
  return () => {
    listeners.delete(fn)
  }
}

function getSnapshot(): Product[] {
  return computed
}

/* ---------- мутации оверрайдов ---------- */
function setOverride(id: number, patch: ProductOverride) {
  overrides = { ...overrides, [id]: { ...overrides[id], ...patch } }
  void repo.saveProductOverrides(overrides)
  recompute()
}

export const setStock = (id: number, stock: number) =>
  setOverride(id, { stock: Math.max(0, Math.round(stock)) })
export const setDiscount = (id: number, discount: number) => setOverride(id, { discount })
export const updateProduct = (id: number, patch: ProductOverride) => setOverride(id, patch)

export function resetProduct(id: number) {
  const next = { ...overrides }
  delete next[id]
  overrides = next
  void repo.saveProductOverrides(overrides)
  recompute()
}

export const hasOverride = (id: number) => !!overrides[id]

/* ---------- производные ---------- */
export const effectivePrice = (p: Product) =>
  p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price

export const isLowStock = (p: Product) => p.inStock && p.stock > 0 && p.stock <= LOW_STOCK
export const isLastOne = (p: Product) => p.inStock && p.stock === 1

/* ---------- React-хуки ---------- */
export function useProducts(): Product[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}

export function useProduct(id: number): Product | undefined {
  return useProducts().find(p => p.id === id)
}
