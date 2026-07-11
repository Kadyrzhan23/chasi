import type { CatalogParams } from '../store/tags'

/* Типы параметров навигации. Экраны каталога принимают фильтры
   (аналог query-параметров веба), товар/паспорт — идентификаторы. */

export type RootStackParamList = {
  Tabs: undefined
  Product: { id: number }
  Passport: { serial: string }
  Loyalty: undefined
  Wishlist: undefined
}

export type TabParamList = {
  Home: undefined
  Catalog: CatalogParams | undefined
  GiftSets: undefined
  Cart: undefined
  Account: undefined
}
