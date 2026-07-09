import { useSyncExternalStore } from 'react'
import { BookingStatus, ServiceBooking, serviceBookings } from '../data/mock'

/* ============ Записи на ТО (localStorage + подписка) ============
   Мок-записи из mock.ts + заявки, оформленные с витрины. */

const KEY = 'chasi-bookings'

let cache: ServiceBooking[] | null = null
const listeners = new Set<() => void>()

function read(): ServiceBooking[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as ServiceBooking[]) : []
  } catch {
    return []
  }
}

function stored(): ServiceBooking[] {
  if (cache === null) cache = read()
  return cache
}

function write(list: ServiceBooking[]) {
  cache = list
  localStorage.setItem(KEY, JSON.stringify(list))
  listeners.forEach(fn => fn())
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

/** Все записи: мок (демо-неделя) + оформленные с сайта, новые сверху. */
export function getBookings(): ServiceBooking[] {
  return [...stored(), ...serviceBookings]
}

export function addBooking(b: Omit<ServiceBooking, 'id' | 'createdAt' | 'status'>) {
  const booking: ServiceBooking = {
    ...b,
    id: 'SB-' + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    status: 'новая',
  }
  write([booking, ...stored()])
  return booking
}

export function setBookingStatus(id: string, status: BookingStatus) {
  // статус можно менять только у заявок с сайта (мок-записи неизменяемы в демо)
  write(stored().map(b => (b.id === id ? { ...b, status } : b)))
}

/** React-хук: живой список записей. */
export function useBookings(): ServiceBooking[] {
  const s = useSyncExternalStore(subscribe, stored, stored)
  return [...s, ...serviceBookings]
}
