import {
  CartItem,
  GiftSet,
  giftSets as mockGiftSets,
  OnlineOrder,
  Product,
  products as mockProducts,
  ServiceBooking,
  serviceBookings as demoBookings,
} from '../data/mock'
import type { ProductOverride } from '../store/productTypes'
import { getJSON, removeKey, setJSON } from './storage'

/* ============================================================
   Сервисный слой данных.

   Весь остальной код общается с данными ТОЛЬКО через `repo`.
   Сейчас источник — локальные мок-данные + AsyncStorage.
   Чтобы перейти на реальный сервер, достаточно написать второй
   класс, реализующий интерфейс DataSource (ApiDataSource),
   и подменить экспорт `repo` внизу файла. Остальное приложение
   менять не придётся.
   ============================================================ */

export interface DataSource {
  /* --- каталог (в будущем — GET /products, /gift-sets) --- */
  getProducts(): Promise<Product[]>
  getGiftSets(): Promise<GiftSet[]>

  /* --- правки товаров из CRM (оверрайды поверх базы) --- */
  getProductOverrides(): Promise<Record<number, ProductOverride>>
  saveProductOverrides(map: Record<number, ProductOverride>): Promise<void>

  /* --- корзина --- */
  getCart(): Promise<CartItem[]>
  saveCart(items: CartItem[]): Promise<void>
  getGiftSetSelection(): Promise<number | null>
  saveGiftSetSelection(id: number | null): Promise<void>

  /* --- избранное --- */
  getWishlist(): Promise<number[]>
  saveWishlist(ids: number[]): Promise<void>

  /* --- онлайн-заказы --- */
  getOrders(): Promise<OnlineOrder[]>
  saveOrders(list: OnlineOrder[]): Promise<void>

  /* --- записи на ТО (только оформленные с устройства) --- */
  getStoredBookings(): Promise<ServiceBooking[]>
  saveStoredBookings(list: ServiceBooking[]): Promise<void>
  /* демо-записи текущей недели (для заполнения графика) */
  getDemoBookings(): ServiceBooking[]
}

/* ---------- ключи хранилища ---------- */
const K = {
  overrides: 'chasi-products',
  cart: 'chasi-cart',
  giftSet: 'chasi-giftset',
  wishlist: 'chasi-wishlist',
  orders: 'chasi-orders',
  bookings: 'chasi-bookings',
} as const

/* ============ Локальный источник (мок + AsyncStorage) ============ */
class LocalDataSource implements DataSource {
  async getProducts(): Promise<Product[]> {
    return mockProducts.map(p => ({ ...p }))
  }

  async getGiftSets(): Promise<GiftSet[]> {
    return mockGiftSets.map(g => ({ ...g }))
  }

  async getProductOverrides(): Promise<Record<number, ProductOverride>> {
    return getJSON<Record<number, ProductOverride>>(K.overrides, {})
  }

  async saveProductOverrides(map: Record<number, ProductOverride>): Promise<void> {
    await setJSON(K.overrides, map)
  }

  async getCart(): Promise<CartItem[]> {
    const arr = await getJSON<CartItem[]>(K.cart, [])
    return arr.filter(i => mockProducts.some(p => p.id === i.productId) && i.qty > 0)
  }

  async saveCart(items: CartItem[]): Promise<void> {
    await setJSON(K.cart, items)
  }

  async getGiftSetSelection(): Promise<number | null> {
    return getJSON<number | null>(K.giftSet, null)
  }

  async saveGiftSetSelection(id: number | null): Promise<void> {
    if (id === null) await removeKey(K.giftSet)
    else await setJSON(K.giftSet, id)
  }

  async getWishlist(): Promise<number[]> {
    const arr = await getJSON<number[]>(K.wishlist, [])
    return Array.isArray(arr) ? arr.filter(n => typeof n === 'number') : []
  }

  async saveWishlist(ids: number[]): Promise<void> {
    await setJSON(K.wishlist, ids)
  }

  async getOrders(): Promise<OnlineOrder[]> {
    return getJSON<OnlineOrder[]>(K.orders, [])
  }

  async saveOrders(list: OnlineOrder[]): Promise<void> {
    await setJSON(K.orders, list)
  }

  async getStoredBookings(): Promise<ServiceBooking[]> {
    return getJSON<ServiceBooking[]>(K.bookings, [])
  }

  async saveStoredBookings(list: ServiceBooking[]): Promise<void> {
    await setJSON(K.bookings, list)
  }

  getDemoBookings(): ServiceBooking[] {
    return demoBookings
  }
}

/* Текущий источник данных. Позже заменить на ApiDataSource. */
export const repo: DataSource = new LocalDataSource()
