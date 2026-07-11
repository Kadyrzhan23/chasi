import type { Product } from '../data/mock'

/* Поля товара, которые можно править в CRM (оверрайды поверх базы). */
export type EditableField =
  | 'name'
  | 'brand'
  | 'category'
  | 'style'
  | 'gender'
  | 'price'
  | 'diameter'
  | 'glass'
  | 'water'
  | 'reserve'
  | 'movement'
  | 'stock'
  | 'discount'

export type ProductOverride = Partial<Pick<Product, EditableField>>
