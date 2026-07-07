import { useSyncExternalStore } from 'react'
import { OnlineOrder, OrderStatus } from '../data/mock'

/* ============ Заказы с сайта (localStorage + подписка) ============ */

const KEY = 'chasi-orders'

let cache: OnlineOrder[] | null = null
const listeners = new Set<() => void>()

function read(): OnlineOrder[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as OnlineOrder[]) : []
  } catch {
    return []
  }
}

function write(list: OnlineOrder[]) {
  cache = list
  localStorage.setItem(KEY, JSON.stringify(list))
  listeners.forEach(fn => fn())
}

export function getOrders(): OnlineOrder[] {
  if (cache === null) cache = read()
  return cache
}

export function subscribeOrders(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function addOrder(order: OnlineOrder) {
  write([order, ...getOrders()])
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  write(getOrders().map(o => (o.id === id ? { ...o, status } : o)))
}

export function makeOrderId(): string {
  return 'W-' + Date.now().toString().slice(-6)
}

/* React-хук: живой список заказов */
export function useOrders(): OnlineOrder[] {
  return useSyncExternalStore(subscribeOrders, getOrders, getOrders)
}
