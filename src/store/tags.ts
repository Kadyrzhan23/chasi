import { CATEGORY_LABEL, Product, STYLE_LABEL } from '../data/mock'

/* ============ Теги и ссылки-фильтры каталога ============
   Теги НЕ хранятся отдельно — они выводятся из полей товара.
   Один источник правды: правишь характеристику → тег меняется сам,
   и клик по тегу всегда корректно фильтрует каталог. */

// Ключи query-параметров, которые понимает каталог
export type CatalogParams = {
  q?: string
  brand?: string
  cat?: string        // точная категория (original / clone-swiss / …)
  type?: string       // укрупнённо: orig | replica
  style?: string      // diver / dress / sport / pilot / chrono
  movement?: string   // автоподзавод / кварц / механика
  stock?: string      // in | order
}

export function catalogLink(params: CatalogParams): string {
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v) sp.set(k, String(v))
  const s = sp.toString()
  return `/catalog${s ? '?' + s : ''}`
}

export type Tag = { label: string; to: string }

/* Теги для страницы товара: бренд, класс, стиль, механизм.
   Клик ведёт в каталог с соответствующим фильтром. */
export function productTags(p: Product): Tag[] {
  return [
    { label: p.brand, to: catalogLink({ brand: p.brand }) },
    { label: CATEGORY_LABEL[p.category], to: catalogLink({ cat: p.category }) },
    { label: STYLE_LABEL[p.style], to: catalogLink({ style: p.style }) },
    { label: p.movement, to: catalogLink({ movement: p.movement }) },
  ]
}

/* Похожие модели: тот же бренд или тот же стиль (кроме самого товара). */
export function relatedProducts(p: Product, all: Product[], limit = 4): Product[] {
  return all
    .filter(x => x.id !== p.id && (x.brand === p.brand || x.style === p.style))
    .sort((a, b) => {
      // сначала совпадение и по бренду, и по стилю
      const score = (x: Product) => (x.brand === p.brand ? 2 : 0) + (x.style === p.style ? 1 : 0)
      return score(b) - score(a)
    })
    .slice(0, limit)
}
