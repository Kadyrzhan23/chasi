import { useSyncExternalStore } from 'react'
import { BookingStatus, ServiceBooking } from '../data/mock'
import { repo } from '../services/repository'

/* ============ Записи на ТО (AsyncStorage через repo + подписка) ============
   Демо-записи текущей недели (подтверждённые) + реальные заявки с витрины.
   Счётчик НОВЫХ стартует с нуля — новые появляются только при заявке. */

let stored: ServiceBooking[] = []
let hydrated = false
const listeners = new Set<() => void>()
const demo = repo.getDemoBookings()

function emit() {
  listeners.forEach(fn => fn())
}

async function hydrate() {
  if (hydrated) return
  hydrated = true
  stored = await repo.getStoredBookings()
  emit()
}

function persist() {
  void repo.saveStoredBookings(stored)
  emit()
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn)
  void hydrate()
  return () => {
    listeners.delete(fn)
  }
}

/** Все записи: заявки с устройства + демо текущей недели. */
export function getBookings(): ServiceBooking[] {
  return [...stored, ...demo]
}

function getStored(): ServiceBooking[] {
  return stored
}

export function addBooking(b: Omit<ServiceBooking, 'id' | 'createdAt' | 'status'>) {
  const booking: ServiceBooking = {
    ...b,
    id: 'SB-' + Date.now().toString().slice(-6),
    createdAt: new Date().toISOString(),
    status: 'новая',
  }
  stored = [booking, ...stored]
  persist()
  return booking
}

export function setBookingStatus(id: string, status: BookingStatus, rejectReason?: string) {
  stored = stored.map(b =>
    b.id === id ? { ...b, status, ...(rejectReason !== undefined ? { rejectReason } : {}) } : b,
  )
  persist()
}

/** React-хук: живой список записей (устройство + демо-неделя). */
export function useBookings(): ServiceBooking[] {
  const s = useSyncExternalStore(subscribe, getStored, getStored)
  return [...s, ...demo]
}

/** React-хук: только МОИ заявки (оформленные с этого устройства). */
export function useMyBookings(): ServiceBooking[] {
  return useSyncExternalStore(subscribe, getStored, getStored)
}
