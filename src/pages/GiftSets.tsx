import { useNavigate } from 'react-router-dom'
import { giftSets, GIFT_BOX } from '../data/mock'
import { useAuth } from '../App'
import { useCart } from '../store/cart'
import { toast } from '../toast'

export default function GiftSets() {
  const { authed } = useAuth()
  const navigate = useNavigate()
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
        <span className="sec-label">Каталог · подарки</span>
        <h1 className="big" style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)' }}>Подарочные <em>наборы</em></h1>
        <p className="muted" style={{ maxWidth: 640, marginTop: 16, lineHeight: 1.7, fontWeight: 300 }}>
          Дарите часы красиво. Выберите готовый набор — коробки, аксессуары и сувениры — или добавьте
          при оформлении простой подарочный бокс за {GIFT_BOX.price} $. Набор закрепляется за заказом
          и оформляется вместе с часами.
        </p>
      </section>

      <section style={{ padding: '20px 4vw 60px' }}>
        <div className="grid3">
          {giftSets.map(g => {
            const active = giftSetId === g.id
            return (
              <div key={g.id} className={`gift-card ${active ? 'on' : ''}`}>
                {g.popular && <div className="badge gold">хит</div>}
                {active && <div className="badge" style={{ left: 12, right: 'auto', color: 'var(--gold2)', borderColor: 'var(--gold)' }}>выбрано ✓</div>}
                <div className="gift-swatch" style={{ background: `linear-gradient(150deg, ${g.dial[0]}, ${g.dial[1]})`, borderColor: g.accent }}>
                  <span style={{ color: g.accent }}>✦</span>
                </div>
                <h3>{g.name}</h3>
                <div className="cat">{g.tagline}</div>
                <ul className="gift-items">
                  {g.items.map(it => <li key={it}>{it}</li>)}
                </ul>
                <div className={`price ${authed ? '' : 'locked'}`} style={{ marginBottom: 6 }}>+{g.price.toLocaleString('ru-RU')} $</div>
                <div className="lock-note">🔒 Войдите, чтобы увидеть цену</div>
                <div className="product-actions" style={{ marginTop: 16 }}>
                  {active ? (
                    <button className="btn btn-ghost" onClick={() => setGiftSetId(null)}>Убрать выбор</button>
                  ) : (
                    <button className="btn btn-gold" onClick={() => choose(g.id, g.name)}>Выбрать набор</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="panel" style={{ marginTop: 34, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h3 style={{ marginBottom: 4 }}>Как это работает</h3>
            <div className="muted" style={{ fontSize: '.85rem', fontWeight: 300, maxWidth: 520, lineHeight: 1.7 }}>
              Наборы — не отдельный товар, а дополнение к часам. Выберите часы в каталоге, добавьте набор
              здесь, а при оформлении заказа всё соберётся в один подарок.
            </div>
          </div>
          <div className="product-actions">
            <button className="btn btn-ghost" onClick={() => navigate('/catalog')}>К часам →</button>
            {count > 0 && <button className="btn btn-gold" onClick={() => navigate('/cart')}>В корзину ({count})</button>}
          </div>
        </div>
      </section>
    </>
  )
}
