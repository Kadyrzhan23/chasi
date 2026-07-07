import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WatchVisual from '../components/WatchVisual'
import {
  giftSets, GIFT_BOX, OnlineOrder, PaymentMethod,
} from '../data/mock'
import { useAuth } from '../App'
import { useCart } from '../store/cart'
import { effectivePrice, useProducts } from '../store/products'
import { addOrder, makeOrderId } from '../store/orders'
import { useI18n } from '../i18n/engine'
import { giftSetText, GIFT_BOX_TR } from '../i18n/giftsets'
import { toast } from '../toast'

const money = (n: number) => n.toLocaleString('ru-RU') + ' $'
const PAY_METHODS: PaymentMethod[] = ['payme', 'click', 'cod']

export default function Cart() {
  const navigate = useNavigate()
  const { authed, toggle } = useAuth()
  const { t, lang } = useI18n()
  const { items, setQty, remove, clear, giftSetId, setGiftSetId } = useCart()
  const shopProducts = useProducts()
  const prod = (id: number) => shopProducts.find(p => p.id === id)!
  const payLabel = (m: PaymentMethod) => (m === 'cod' ? t('pay.cod') : m === 'payme' ? 'Payme' : 'Click')

  const [giftBox, setGiftBox] = useState(false)
  const [payment, setPayment] = useState<PaymentMethod>('payme')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [comment, setComment] = useState('')
  const [placed, setPlaced] = useState<OnlineOrder | null>(null)

  const giftSet = giftSets.find(g => g.id === giftSetId) ?? null
  const giftSetTr = giftSet ? giftSetText(lang, giftSet.id, { name: giftSet.name, tagline: giftSet.tagline, items: giftSet.items }) : null
  const giftBoxTr = GIFT_BOX_TR[lang]

  const itemsTotal = useMemo(() => items.reduce((a, i) => a + effectivePrice(prod(i.productId)) * i.qty, 0), [items, shopProducts])
  const extrasTotal = (giftBox ? GIFT_BOX.price : 0) + (giftSet ? giftSet.price : 0)
  const total = itemsTotal + extrasTotal

  const phoneOk = phone.replace(/\D/g, '').length >= 9
  const canOrder = items.length > 0 && name.trim().length >= 2 && phoneOk

  const submit = () => {
    if (!canOrder) return
    const order: OnlineOrder = {
      id: makeOrderId(),
      createdAt: new Date().toISOString(),
      items: items.map(i => ({ productId: i.productId, qty: i.qty })),
      giftBox,
      giftSetId,
      payment,
      customer: { name: name.trim(), phone: phone.trim(), address: address.trim(), comment: comment.trim() },
      itemsTotal, extrasTotal, total,
      status: 'новый',
    }
    addOrder(order)
    clear()
    setPlaced(order)
    toast({
      kind: 'gold',
      title: `Заказ ${order.id} оформлен ✦`,
      text: `${order.customer.name.split(' ')[0]}, спасибо! Оплата: ${payLabel(payment)}. Менеджер видит заказ в CRM и свяжется с вами. — так клиент получит подтверждение в Telegram.`,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* ---------- Гейт: корзина только для авторизованных ---------- */
  if (!authed) {
    return (
      <section style={{ padding: '90px 4vw', maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <span className="sec-label">{t('cart.title')}</span>
        <div style={{ fontSize: '2.6rem', marginBottom: 12 }}>🔒</div>
        <h1 className="big" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>{t('cart.authTitle')}</h1>
        <p className="muted" style={{ margin: '18px auto 28px', maxWidth: 480, lineHeight: 1.7, fontWeight: 300 }}>
          {t('cart.authText')}
        </p>
        <div className="product-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-gold" onClick={toggle}>{t('cart.authLogin')}</button>
          <button className="btn btn-ghost" onClick={() => navigate('/catalog')}>{t('cart.authBack')}</button>
        </div>
      </section>
    )
  }

  /* ---------- Экран «заказ оформлен» ---------- */
  if (placed) {
    return (
      <section style={{ padding: '90px 4vw', maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <span className="sec-label">{t('cart.placedLabel')}</span>
        <div style={{ fontSize: '3rem', marginBottom: 10 }}>✦</div>
        <h1 className="big" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>{t('cart.placedTitle', { id: placed.id })}</h1>
        <p className="muted" style={{ margin: '18px auto 28px', maxWidth: 520, lineHeight: 1.7, fontWeight: 300 }}>
          {t('cart.placedText', { pay: payLabel(placed.payment), sum: money(placed.total) })}
        </p>
        <div className="product-actions" style={{ justifyContent: 'center' }}>
          <button className="btn btn-gold" onClick={() => navigate('/catalog')}>{t('cart.continue')}</button>
          <button className="btn btn-ghost" onClick={() => navigate('/admin')}>{t('cart.openCrm')}</button>
        </div>
      </section>
    )
  }

  /* ---------- Пустая корзина ---------- */
  if (items.length === 0) {
    return (
      <section style={{ padding: '90px 4vw', textAlign: 'center' }}>
        <span className="sec-label">{t('cart.title')}</span>
        <h1 className="big" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>{t('cart.empty')}</h1>
        <p className="muted" style={{ margin: '18px 0 28px', fontWeight: 300 }}>{t('cart.emptyText')}</p>
        <div className="product-actions" style={{ justifyContent: 'center' }}>
          <Link className="btn btn-gold" to="/catalog">{t('cart.toCatalog')}</Link>
          <Link className="btn btn-ghost" to="/gift-sets">{t('cart.toGifts')}</Link>
        </div>
      </section>
    )
  }

  return (
    <>
      <section style={{ padding: '50px 4vw 10px' }}>
        <span className="sec-label">{t('cart.checkoutLabel')}</span>
        <h1 className="big" style={{ fontSize: 'clamp(2.2rem,4vw,3.4rem)' }}>{t('cart.title')}</h1>
      </section>

      <div className="cart">
        {/* ---- Левая колонка: товары + опции ---- */}
        <div className="cart-main">
          {items.map(i => {
            const p = prod(i.productId)
            return (
              <div className="cart-row" key={i.productId}>
                <div className="cart-thumb"><WatchVisual product={p} /></div>
                <div className="cart-row-info">
                  <h3>{p.name}</h3>
                  <div className="cat">{p.brand} · ⌀{p.diameter}мм{p.discount > 0 && <span className="pill y" style={{ marginLeft: 8 }}>−{p.discount}%</span>}</div>
                  <button className="link-del" onClick={() => remove(i.productId)}>{t('cart.remove')}</button>
                </div>
                <div className="qty">
                  <button onClick={() => setQty(i.productId, i.qty - 1)}>−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => setQty(i.productId, i.qty + 1)}>+</button>
                </div>
                <div className="cart-price">
                  {p.discount > 0 && <s className="muted" style={{ display: 'block', fontSize: '.8rem' }}>{money(p.price * i.qty)}</s>}
                  {money(effectivePrice(p) * i.qty)}
                </div>
              </div>
            )
          })}

          {/* Подарочный бокс */}
          <div className="opt-block">
            <label className="opt-head">
              <input type="checkbox" checked={giftBox} onChange={e => setGiftBox(e.target.checked)} />
              <span>{t('cart.giftBoxAdd')} <b style={{ color: 'var(--gold2)' }}>+{money(GIFT_BOX.price)}</b></span>
            </label>
            <p className="muted opt-desc">{giftBoxTr.desc}</p>
          </div>

          {/* Подарочный набор */}
          <div className="opt-block">
            <div className="opt-head" style={{ cursor: 'default' }}>
              <span>{t('cart.giftSetTitle')}</span>
            </div>
            {giftSet && giftSetTr ? (
              <div className="giftset-chosen">
                <div>
                  <b style={{ color: 'var(--gold2)' }}>{giftSetTr.name}</b> · +{money(giftSet.price)}
                  <div className="muted" style={{ fontSize: '.76rem', marginTop: 4 }}>{giftSetTr.items.join(' · ')}</div>
                </div>
                <button className="link-del" onClick={() => setGiftSetId(null)}>{t('cart.giftRemove')}</button>
              </div>
            ) : (
              <p className="muted opt-desc">
                {t('cart.giftSetNone')} <Link to="/gift-sets" style={{ color: 'var(--gold2)' }}>{t('cart.chooseSet')}</Link>
              </p>
            )}
          </div>
        </div>

        {/* ---- Правая колонка: контакты, оплата, итог ---- */}
        <aside className="cart-side">
          <div className="panel">
            <h3 style={{ marginBottom: 16 }}>{t('cart.contactsTitle')}</h3>
            <input className="search-inp" placeholder={t('cart.namePh')} value={name} onChange={e => setName(e.target.value)} />
            <input className="search-inp" placeholder={t('cart.phonePh')} value={phone} onChange={e => setPhone(e.target.value)} />
            <input className="search-inp" placeholder={t('cart.addressPh')} value={address} onChange={e => setAddress(e.target.value)} />
            <input className="search-inp" style={{ marginBottom: 0 }} placeholder={t('cart.commentPh')} value={comment} onChange={e => setComment(e.target.value)} />
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 16 }}>{t('cart.payTitle')}</h3>
            {PAY_METHODS.map(m => (
              <label key={m} className={`pay-opt ${payment === m ? 'on' : ''}`}>
                <input type="radio" name="pay" checked={payment === m} onChange={() => setPayment(m)} />
                <span>{payLabel(m)}</span>
                <span className="muted pay-hint">
                  {m === 'cod' ? t('cart.payCash') : t('cart.payOnline')}
                </span>
              </label>
            ))}
          </div>

          <div className="panel summary">
            <div className="sum-row"><span>{t('cart.sumItems', { n: items.reduce((a, i) => a + i.qty, 0) })}</span><span>{money(itemsTotal)}</span></div>
            {giftBox && <div className="sum-row"><span>{t('cart.sumBox')}</span><span>+{money(GIFT_BOX.price)}</span></div>}
            {giftSet && giftSetTr && <div className="sum-row"><span>{t('cart.sumSet', { name: giftSetTr.name })}</span><span>+{money(giftSet.price)}</span></div>}
            <div className="sum-row total"><span>{t('cart.total')}</span><span>{money(total)}</span></div>
            <button className="btn btn-gold" style={{ width: '100%', marginTop: 16, opacity: canOrder ? 1 : 0.45 }} disabled={!canOrder} onClick={submit}>
              {t('cart.placeOrder')}
            </button>
            {!canOrder && <div className="muted" style={{ fontSize: '.72rem', marginTop: 10, textAlign: 'center' }}>{t('cart.fillNamePhone')}</div>}
          </div>
        </aside>
      </div>
    </>
  )
}
