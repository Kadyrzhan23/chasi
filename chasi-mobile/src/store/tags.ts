import { CATEGORY_LABEL, Product, STYLE_LABEL } from '../data/mock'

/* ============ Теги и фильтры каталога ============
   Теги НЕ хранятся отдельно — они выводятся из полей товара.
   Один источник правды: правишь характеристику → тег меняется сам.
   В нативной версии тег ведёт в каталог, передавая объект-параметры
   навигации (вместо URL-строки из веба). */

export type CatalogParams = {
  q?: string
  brand?: string
  cat?: string // точная категория (original / clone-swiss / …)
  type?: string // укрупнённо: orig | replica
  style?: string // diver / dress / sport / pilot / chrono
  movement?: string // автоподзавод / кварц / механика
  stock?: string // in | order
}

export type Tag = { label: string; params: CatalogParams }

/* Теги для страницы товара: бренд, класс, стиль, механизм. */
export function productTags(p: Product): Tag[] {
  return [
    { label: p.brand, params: { brand: p.brand } },
    { label: CATEGORY_LABEL[p.category], params: { cat: p.category } },
    { label: STYLE_LABEL[p.style], params: { style: p.style } },
    { label: p.movement, params: { movement: p.movement } },
  ]
}

/* Похожие модели: тот же бренд или тот же стиль (кроме самого товара). */
export function relatedProducts(p: Product, all: Product[], limit = 4): Product[] {
  return all
    .filter(x => x.id !== p.id && (x.brand === p.brand || x.style === p.style))
    .sort((a, b) => {
      const score = (x: Product) => (x.brand === p.brand ? 2 : 0) + (x.style === p.style ? 1 : 0)
      return score(b) - score(a)
    })
    .slice(0, limit)
}
