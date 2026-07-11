import { useSyncExternalStore } from 'react'
import { OnlineOrder, OrderStatus } from '../data/mock'
import { repo } from '../services/repository'

/* ============ Заказы с сайта (AsyncStorage через repo + подписка) ============ */

let cache: OnlineOrder[] = []
let hydrated = false
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach(fn => fn())
}

async function hydrate() {
  if (hydrated) return
  hydrated = true
  cache = await repo.getOrders()
  emit()
}

function persist() {
  void repo.saveOrders(cache)
  emit()
}

export function getOrders(): OnlineOrder[] {
  return cache
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  void hydrate()
  return () => {
    listeners.delete(fn)
  }
}

export function addOrder(order: OnlineOrder) {
  cache = [order, ...cache]
  persist()
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  cache = cache.map(o => (o.id === id ? { ...o, status } : o))
  persist()
}

export function makeOrderId(): string {
  return 'W-' + Date.now().toString().slice(-6)
}

export function useOrders(): OnlineOrder[] {
  return useSyncExternalStore(subscribe, getOrders, getOrders)
}
