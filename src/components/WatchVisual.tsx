import { useState } from 'react'
import WatchSVG from './WatchSVG'
import { Product } from '../data/mock'
import { useTheme } from '../App'

/**
 * Визуал товара, зависящий от дизайн-версии:
 * V1 (noir) — SVG-графика; V2/V3 (ivory/emerald) — реальные фото (Unsplash).
 * Если фото не загрузилось — автоматический откат на SVG.
 */
const POOL = [
  'photo-1523170335258-f5ed11844a49',
  'photo-1547996160-81dfa63595aa',
  'photo-1524805444758-089113d48a6d',
  'photo-1522312346375-d1a52e2b99b3',
  'photo-1594534475808-b18fc33b045e',
  'photo-1622434641406-a158123450f9',
  'photo-1587836374828-4dbafa94cf0e',
  'photo-1526045431048-f857369baa09',
  'photo-1539874754764-5a96559165b0',
  'photo-1434056886845-dac89ffe9b56',
]

export const photoUrl = (id: number, w = 800) =>
  `https://images.unsplash.com/${POOL[id % POOL.length]}?auto=format&fit=crop&w=${w}&q=80`

export default function WatchVisual({ product, live = false, className }: { product: Product; live?: boolean; className?: string }) {
  const { theme } = useTheme()
  const [err, setErr] = useState(false)
  if (theme === 'noir' || err) {
    return <WatchSVG dial={product.dial} accent={product.accent} live={live} brand={product.brand.toUpperCase().slice(0, 14)} className={className} />
  }
  return (
    <img
      className={`wimg ${className ?? ''}`}
      src={photoUrl(product.id)}
      alt={product.name}
      loading="lazy"
      onError={() => setErr(true)}
    />
  )
}
