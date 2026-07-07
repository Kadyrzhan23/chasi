import { useNavigate } from 'react-router-dom'
import { giftSets, GIFT_BOX } from '../data/mock'
import { useAuth } from '../App'
import { useCart } from '../store/cart'
import { useI18n } from '../i18n/engine'
import { giftSetText } from '../i18n/giftsets'
import { toast } from '../toast'

export default function GiftSets() {
  const { authed } = useAuth()
  const navigate = useNavigate()
  const { t, lang } = useI18n()
  const { giftSetId, setGiftSetId, count } = useCart()

  const choose = (id: number, name: string) => {
    setGiftSetId(id)
    toast({
      kind: 'gold',
      title: 'Набор выбран ✦',
      text: `«${name}» добавится к заказу при оформлении. ${count > 0 ? 'Перейдите в корзину, чтобы завершить.' : 'Добавьте часы в корзину — набор уже закреплён.'}`,
    })
  }

  return (
    <>
      <section style={{ padding: '50px 4vw 10px' }}>
        <span className="sec-label">{t('gift.label')}</span>
        <h1 className="big" style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)' }}>{t('gift.titleA')} <em>{t('gift.titleEm')}</em></h1>
        <p className="muted" style={{ maxWidth: 640, marginTop: 16, lineHeight: 1.7, fontWeight: 300 }}>
          {t('gift.intro', { price: `${GIFT_BOX.price} $` })}
        </p>
      </section>

      <section style={{ padding: '20px 4vw 60px' }}>
        <div className="grid3">
          {giftSets.map(g => {
            const active = giftSetId === g.id
            const gt = giftSetText(lang, g.id, { name: g.name, tagline: g.tagline, items: g.items })
            return (
              <div key={g.id} className={`gift-card ${active ? 'on' : ''}`}>
                {g.popular && <div className="badge gold">{t('gift.popular')}</div>}
                {active && <div className="badge" style={{ left: 12, right: 'auto', color: 'var(--gold2)', borderColor: 'var(--gold)' }}>{t('gift.chosen')}</div>}
                <div className="gift-swatch" style={{ background: `linear-gradient(150deg, ${g.dial[0]}, ${g.dial[1]})`, borderColor: g.accent }}>
                  <span style={{ color: g.accent }}>✦</span>
                </div>
                <h3>{gt.name}</h3>
                <div className="cat">{gt.tagline}</div>
                <ul className="gift-items">
                  {gt.items.map(it => <li key={it}>{it}</li>)}
                </ul>
                <div className={`price ${authed ? '' : 'locked'}`} style={{ marginBottom: 6 }}>+{g.price.toLocaleString('ru-RU')} $</div>
                <div className="lock-note">{t('common.priceLocked')}</div>
                <div className="product-actions" style={{ marginTop: 16 }}>
                  {active ? (
                    <button className="btn btn-ghost" onClick={() => setGiftSetId(null)}>{t('gift.remove')}</button>
                  ) : (
                    <button className="btn btn-gold" onClick={() => choose(g.id, gt.name)}>{t('gift.choose')}</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="panel" style={{ marginTop: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ marginBottom: 4 }}>{t('gift.howTitle')}</h3>
            <div className="muted" style={{ fontSize: '.85rem', fontWeight: 300, maxWidth: 520, lineHeight: 1.7 }}>
              {t('gift.howText')}
            </div>
          </div>
          <div className="product-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/catalog')}>{t('gift.toWatches')}</button>
            {count > 0 && <button className="btn btn-gold" onClick={() => navigate('/cart')}>{t('gift.toCart', { n: count })}</button>}
          </div>
        </div>
      </section>
    </>
  )
}
