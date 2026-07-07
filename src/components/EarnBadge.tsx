import { useAuth } from '../App'
import { Product } from '../data/mock'
import { earnedPoints, FIRST_PURCHASE_BONUS } from '../data/loyalty'
import { useI18n } from '../i18n/engine'
import { useOrders } from '../store/orders'

/**
 * Бейдж начисляемых баллов за конкретные часы.
 * Показывается только авторизованным. На скидочные товары баллы не начисляются.
 * Если у пользователя ещё нет покупок — добавляет «+500» за первую покупку
 * с подсказкой (наведение мышки / тап на экране), не раскрывая суть сразу.
 * variant: 'card' — маленький бейдж под ценой; 'page' — строка на странице товара.
 */
export default function EarnBadge({ product, variant = 'card' }: { product: Product; variant?: 'card' | 'page' }) {
  const { authed } = useAuth()
  const { t } = useI18n()
  const orders = useOrders()

  if (!authed) return null

  const pts = earnedPoints(product)            // 0 у товаров со скидкой
  // на скидочных часах баллы не начисляются — ничего не показываем
  if (pts === 0) return null
  const firstBuy = orders.length === 0          // ещё не покупал в магазине

  const fmt = (n: number) => n.toLocaleString('ru-RU')
  const bonus = firstBuy ? (
    <span
      className="first-bonus"
      tabIndex={0}
      data-tip={t('common.firstBonusTip')}
      title={t('common.firstBonusTip')}
    >
      +{fmt(FIRST_PURCHASE_BONUS)}
      <span className="fb-i">?</span>
    </span>
  ) : null

  if (variant === 'page') {
    return (
      <div className="earn-note">
        {pts > 0 && <>✦ {t('common.earnNote', { n: fmt(pts) })}</>}
        {pts > 0 && bonus && ' · '}
        {bonus}
      </div>
    )
  }

  return (
    <div className="earn-pts">
      {pts > 0 && <>{t('common.earnPoints', { n: fmt(pts) })}</>}
      {pts > 0 && bonus && ' '}
      {bonus}
    </div>
  )
}
