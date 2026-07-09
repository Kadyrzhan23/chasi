import { useWishlist } from '../store/wishlist'
import { useI18n } from '../i18n/engine'
import { toast } from '../toast'

const Heart = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.5s-7.5-4.7-9.7-9.2C.9 8.5 2.2 5.4 5.2 5c1.9-.2 3.5.9 4.3 2.3L12 10l2.5-2.7C15.3 5.9 16.9 4.8 18.8 5c3 .4 4.3 3.5 2.9 6.3-2.2 4.5-9.7 9.2-9.7 9.2Z" />
  </svg>
)

/**
 * «В избранное» — только на странице конкретного товара.
 * Оформлена как обычная кнопка (btn-ghost) под высоту остальных кнопок.
 */
export default function WishBtn({ id, name }: { id: number; name: string }) {
  const { has, toggle } = useWishlist()
  const { t } = useI18n()
  const active = has(id)

  const onClick = () => {
    toggle(id)
    if (!active) toast({ kind: 'gold', title: t('wish.added'), text: `${name} — ${t('wish.addedText')}` })
  }

  return (
    <button className={`btn btn-ghost wish-page ${active ? 'on' : ''}`} onClick={onClick} title={active ? t('wish.remove') : t('wish.add')}>
      <Heart filled={active} />
      {active ? t('wish.inList') : t('wish.add')}
    </button>
  )
}
