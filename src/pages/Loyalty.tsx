import { Link } from 'react-router-dom'
import {
  EARN_RULES, POINTS_PER_DOLLAR, POINTS_PER_USD, POINTS_TTL_MONTHS,
  SPEND_ITEMS, SPEND_RULES, TIERS, WARRANTY_SERVICE,
} from '../data/loyalty'

export default function Loyalty() {
  return (
    <>
      <section style={{ padding: '50px 4vw 6px' }}>
        <span className="sec-label">Программа лояльности</span>
        <h1 className="big" style={{ fontSize: 'clamp(2.2rem,4.5vw,4rem)' }}>Баллы <em>CHASI.UZ</em></h1>
        <p className="muted" style={{ maxWidth: 680, marginTop: 16, lineHeight: 1.7, fontWeight: 300 }}>
          Копите баллы с каждой покупки и меняйте их на сервис, аксессуары и подарочные наборы.
          Курс простой: <b style={{ color: 'var(--gold2)' }}>{POINTS_PER_USD} баллов = $1</b>,
          начисляем <b style={{ color: 'var(--gold2)' }}>{POINTS_PER_DOLLAR} балла за каждый $1</b> покупки.
        </p>
      </section>

      {/* акцент: баллы vs скидка */}
      <section style={{ padding: '10px 4vw' }}>
        <div className="loyalty-note">
          ✦ Баллы <b>не начисляются на товары со скидкой</b> — на такие модели вы уже получаете выгоду ценой.
          Баллы копятся только с покупок по полной цене.
        </div>
      </section>

      {/* Как начисляются */}
      <section style={{ padding: '20px 4vw' }}>
        <span className="sec-label">Как копить</span>
        <h2 style={{ marginBottom: 24 }}>За что начисляются баллы</h2>
        <div className="loy-grid">
          {EARN_RULES.map(r => (
            <div className="loy-card" key={r.title}>
              <span className="loy-ico">{r.icon}</span>
              <div className="loy-title">{r.title}</div>
              <div className="loy-value">{r.value}</div>
              {r.note && <div className="muted loy-note-sm">{r.note}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* На что потратить */}
      <section style={{ padding: '20px 4vw' }}>
        <span className="sec-label">Как потратить</span>
        <h2 style={{ marginBottom: 8 }}>На что можно обменять баллы</h2>
        <p className="muted" style={{ fontSize: '.85rem', fontWeight: 300, marginBottom: 24 }}>
          Баллами оплачиваются услуги и аксессуары — но не сами часы.
        </p>
        <div className="loy-grid">
          {SPEND_ITEMS.map(s => (
            <div className="loy-card spend" key={s.title}>
              <span className="loy-ico">{s.icon}</span>
              <div className="loy-title">{s.title}</div>
              <div className="loy-value">{s.cost.toLocaleString('ru-RU')} баллов</div>
              <div className="muted loy-note-sm">≈ ${s.usd}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Бесплатное ТО по гарантии */}
      <section style={{ padding: '20px 4vw' }}>
        <div className="panel">
          <h3 style={{ marginBottom: 6 }}>Бесплатное ТО по гарантии</h3>
          <div className="muted" style={{ fontSize: '.85rem', fontWeight: 300, marginBottom: 16 }}>
            Это отдельный бонус покупки — не за баллы. Зависит от срока гарантии на ваши часы.
          </div>
          <ul className="loy-list">
            {WARRANTY_SERVICE.map(w => <li key={w.years}>{w.text}</li>)}
          </ul>
        </div>
      </section>

      {/* Статусы */}
      <section style={{ padding: '20px 4vw' }}>
        <span className="sec-label">Статусы</span>
        <h2 style={{ marginBottom: 24 }}>Silver · Gold · Platinum</h2>
        <div className="tier-grid">
          {TIERS.map(tier => (
            <div className={`tier-card ${tier.id.toLowerCase()}`} key={tier.id}>
              <div className="tier-name">{tier.id}</div>
              <div className="tier-th muted">{tier.threshold}</div>
              <ul className="loy-list">
                {tier.perks.map(p => <li key={p}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Правила */}
      <section style={{ padding: '20px 4vw 70px' }}>
        <div className="panel">
          <h3 style={{ marginBottom: 6 }}>Правила и ограничения</h3>
          <div className="muted" style={{ fontSize: '.85rem', fontWeight: 300, marginBottom: 16 }}>
            Баллы действуют <b style={{ color: 'var(--gold2)' }}>{POINTS_TTL_MONTHS} месяца</b> с момента начисления.
          </div>
          <ul className="loy-list">
            {SPEND_RULES.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          <div className="product-actions" style={{ marginTop: 24 }}>
            <Link className="btn btn-gold" to="/catalog">В каталог</Link>
            <Link className="btn btn-ghost" to="/account">Мой кабинет</Link>
          </div>
        </div>
      </section>
    </>
  )
}
