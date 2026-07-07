import { useEffect, useMemo, useState } from 'react'
import { clients, Client, demand, DISCOUNT_PIN, giftSets, GIFT_BOX, interests, OnlineOrder, PAYMENT_LABEL, products, Sale, salesMock, serviceDue, tradeIns, views7d, dailyVisits } from '../data/mock'
import { updateOrderStatus, useOrders } from '../store/orders'
import { toast } from '../toast'

type Tab = 'dash' | 'weborders' | 'neworder' | 'sales' | 'interest' | 'demand' | 'tradein' | 'service' | 'clients'

type Prefill = { productId: number; clientId: number; orderId?: string }

const DEMO_TODAY = '2026-07-03'
const money = (n: number) => n.toLocaleString('ru-RU') + ' $'

const prod = (id: number) => products.find(p => p.id === id)!
const client = (id: number) => clients.find(c => c.id === id)!

function Bars({ rows }: { rows: { name: string; value: number }[] }) {
  const [go, setGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGo(true), 120); return () => clearTimeout(t) }, [])
  const max = Math.max(...rows.map(r => r.value))
  return (
    <div>
      {rows.map(r => (
        <div className="bar-row" key={r.name}>
          <div className="nm">{r.name}</div>
          <div className="bar-wrap"><div className="bar" style={{ width: go ? `${(r.value / max) * 100}%` : 0 }} /></div>
          <div className="vv">{r.value}</div>
        </div>
      ))}
    </div>
  )
}

/* ---------- Новый заказ ---------- */
function NewOrder({ onCreate, clientList, prefill, onProcessed }: {
  onCreate: (s: Sale) => void
  clientList: Client[]
  prefill: Prefill | null
  onProcessed: (orderId: string) => void
}) {
  const [clientId, setClientId] = useState('')
  const [productId, setProductId] = useState('')
  const [pin, setPin] = useState('')
  const [pinOk, setPinOk] = useState(false)
  const [discount, setDiscount] = useState(0)

  // автозаполнение при переходе с заказа с сайта
  useEffect(() => {
    if (prefill) {
      setProductId(String(prefill.productId))
      setClientId(String(prefill.clientId))
    }
  }, [prefill])

  const p = products.find(x => x.id === +productId)
  const total = p ? Math.round(p.price * (1 - discount / 100)) : 0

  const checkPin = () => {
    if (pin === DISCOUNT_PIN) {
      setPinOk(true)
      toast({ kind: 'gold', title: 'PIN подтверждён ✦', text: 'Скидка разблокирована. Каждое применение PIN фиксируется в журнале операций.' })
    } else {
      toast({ kind: 'gold', title: 'Неверный PIN', text: 'Скидку может провести только владелец или старший менеджер. Попытка записана в журнал.' })
      setPin('')
    }
  }

  const submit = () => {
    if (!clientId || !p) return
    onCreate({
      id: Date.now(), date: DEMO_TODAY,
      time: new Date().toTimeString().slice(0, 5),
      productId: p.id, clientId: +clientId, discountPct: discount,
    })
    const c = clientList.find(x => x.id === +clientId)!
    toast({
      title: 'Заказ оформлен ✦',
      text: `${c.name.split(' ')[0]}, спасибо за покупку! ${p.name} — ${money(total)}${discount ? ` (скидка −${discount}%)` : ''}. Цифровой паспорт часов уже в вашем кабинете. — так клиент получит чек в Telegram.`,
    })
    if (prefill?.orderId) onProcessed(prefill.orderId)
    setClientId(''); setProductId(''); setDiscount(0); setPin(''); setPinOk(false)
  }

  const lbl = { fontSize: '.68rem', letterSpacing: '.2em', textTransform: 'uppercase' as const, color: 'var(--gold)', display: 'block', marginBottom: 8 }

  return (
    <>
      <span className="sec-label">CRM · касса</span>
      <h2 style={{ marginBottom: 8 }}>Новый заказ</h2>
      <p className="muted" style={{ fontSize: '.82rem', marginBottom: 26, fontWeight: 300 }}>
        Один заказ — одни часы. Выберите модель, прикрепите клиента; скидка проводится только после PIN-кода владельца.
      </p>
      {prefill?.orderId && (
        <div className="prefill-note">
          ✦ Форма заполнена из заказа с сайта <b>{prefill.orderId}</b>. Проверьте данные и оформите продажу — заказ отметится как «оформлен».
        </div>
      )}
      <div className="panel" style={{ maxWidth: 640 }}>
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>1 · Модель из магазина</label>
          <select className="select" style={{ width: '100%' }} value={productId} onChange={e => setProductId(e.target.value)}>
            <option value="">— выберите часы —</option>
            {products.filter(x => x.inStock).map(x => (
              <option key={x.id} value={x.id}>{x.brand} · {x.name} — {money(x.price)}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>2 · Аккаунт клиента</label>
          <select className="select" style={{ width: '100%' }} value={clientId} onChange={e => setClientId(e.target.value)}>
            <option value="">— выберите клиента —</option>
            {clientList.map(c => <option key={c.id} value={c.id}>{c.name} · {c.phone} · {c.level}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>3 · Скидка (по PIN-коду владельца)</label>
          {!pinOk ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <input className="search-inp" style={{ marginBottom: 0, maxWidth: 160, letterSpacing: '.4em', textAlign: 'center' }}
                type="password" inputMode="numeric" maxLength={4} placeholder="••••"
                value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ''))} />
              <button className="btn btn-ghost btn-sm" style={{ alignSelf: 'center' }} onClick={checkPin} disabled={pin.length !== 4}>Подтвердить</button>
              <span className="muted" style={{ fontSize: '.68rem', alignSelf: 'center' }}>демо-PIN: 2468</span>
            </div>
          ) : (
            <div className="chips">
              {[0, 5, 10, 15, 20].map(d => (
                <button key={d} className={`chip ${discount === d ? 'on' : ''}`} onClick={() => setDiscount(d)}>
                  {d === 0 ? 'Без скидки' : `−${d}%`}
                </button>
              ))}
            </div>
          )}
        </div>
        {p && (
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 18, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
            <span className="muted" style={{ fontSize: '.8rem' }}>{p.name}{discount > 0 && <> · скидка −{discount}%</>}</span>
            <span style={{ fontFamily: 'var(--serif)', fontSize: '1.9rem', color: 'var(--gold2)' }}>
              {discount > 0 && <s className="muted" style={{ fontSize: '1rem', marginRight: 12 }}>{money(p.price)}</s>}
              {money(total)}
            </span>
          </div>
        )}
        <button className="btn btn-gold" style={{ width: '100%', opacity: !clientId || !p ? 0.45 : 1 }} disabled={!clientId || !p} onClick={submit}>
          Оформить заказ
        </button>
      </div>
    </>
  )
}

/* ---------- Продажи за день / месяц ---------- */
function SalesReport({ sales, clientList }: { sales: Sale[]; clientList: Client[] }) {
  const [mode, setMode] = useState<'day' | 'month'>('day')
  const [day, setDay] = useState(DEMO_TODAY)
  const [month, setMonth] = useState(DEMO_TODAY.slice(0, 7))

  const rows = useMemo(
    () => sales
      .filter(s => (mode === 'day' ? s.date === day : s.date.startsWith(month)))
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time)),
    [sales, mode, day, month],
  )
  const withTotals = rows.map(s => {
    const p = products.find(x => x.id === s.productId)!
    return { ...s, p, price: p.price, total: Math.round(p.price * (1 - s.discountPct / 100)) }
  })
  const turnover = withTotals.reduce((a, s) => a + s.price, 0)
  const revenue = withTotals.reduce((a, s) => a + s.total, 0)

  return (
    <>
      <span className="sec-label">CRM · отчёт</span>
      <h2 style={{ marginBottom: 22 }}>Продажи</h2>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 26, flexWrap: 'wrap' }}>
        <div className="chips">
          <button className={`chip ${mode === 'day' ? 'on' : ''}`} onClick={() => setMode('day')}>За день</button>
          <button className={`chip ${mode === 'month' ? 'on' : ''}`} onClick={() => setMode('month')}>За месяц</button>
        </div>
        {mode === 'day'
          ? <input className="select" type="date" value={day} onChange={e => setDay(e.target.value)} />
          : <input className="select" type="month" value={month} onChange={e => setMonth(e.target.value)} />}
        <span className="muted" style={{ fontSize: '.72rem' }}>история продаж: с 1 января 2026 — есть дни с 0, 1–2 и до 9 продаж</span>
      </div>

      <div className="kpis">
        <div className="kpi"><div className="v">{rows.length}</div><div className="l">продаж</div></div>
        <div className="kpi"><div className="v">{money(turnover)}</div><div className="l">оборот (до скидок)</div></div>
        <div className="kpi"><div className="v">{money(turnover - revenue)}</div><div className="l">скидки</div></div>
        <div className="kpi"><div className="v">{money(revenue)}</div><div className="l">выручка (итог)</div></div>
      </div>

      {rows.length === 0 ? (
        <div className="empty">За выбранный период продаж нет.</div>
      ) : (
        <table className="tbl">
          <thead><tr><th>Дата · время</th><th>Товар</th><th>Клиент</th><th>Цена</th><th>Скидка</th><th>Итог</th></tr></thead>
          <tbody>
            {withTotals.map(s => {
              const c = clientList.find(x => x.id === s.clientId)
              return (
                <tr key={s.id}>
                  <td className="muted">{s.date.split('-').reverse().join('.')} · {s.time}</td>
                  <td>{s.p.brand} {s.p.name}</td>
                  <td>{c ? c.name : '—'}</td>
                  <td>{money(s.price)}</td>
                  <td>{s.discountPct > 0 ? <span className="pill y">−{s.discountPct}%</span> : <span className="muted">—</span>}</td>
                  <td style={{ color: 'var(--gold2)' }}>{money(s.total)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}

/* ---------- Заказы с сайта ---------- */
function WebOrders({ orders, onProcess }: { orders: OnlineOrder[]; onProcess: (o: OnlineOrder) => void }) {
  const fmt = (iso: string) => {
    const d = new Date(iso)
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} · ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return (
    <>
      <span className="sec-label">CRM · онлайн-канал</span>
      <h2 style={{ marginBottom: 8 }}>Заказы с сайта</h2>
      <p className="muted" style={{ fontSize: '.82rem', marginBottom: 26, fontWeight: 300 }}>
        Заявки, оформленные клиентами на сайте. Нажмите «Оформить в кассе» — откроется форма нового заказа
        с уже заполненными клиентом и моделью. Осталось подтвердить и провести продажу.
      </p>

      {orders.length === 0 ? (
        <div className="empty">Пока нет заказов с сайта. Оформите заказ в корзине — он появится здесь.</div>
      ) : (
        <div className="weborders">
          {orders.map(o => {
            const gs = giftSets.find(g => g.id === o.giftSetId)
            return (
              <div className={`panel weborder ${o.status === 'новый' ? 'is-new' : ''}`} key={o.id}>
                <div className="weborder-top">
                  <div>
                    <b style={{ color: 'var(--gold2)', fontSize: '1.05rem' }}>Заказ {o.id}</b>
                    <div className="muted" style={{ fontSize: '.72rem', marginTop: 4 }}>{fmt(o.createdAt)}</div>
                  </div>
                  {o.status === 'новый'
                    ? <span className="pill y">новый</span>
                    : <span className="pill g">оформлен ✓</span>}
                </div>

                <div className="weborder-body">
                  <div>
                    <div className="wo-label">Клиент</div>
                    <div>{o.customer.name}</div>
                    <div className="muted" style={{ fontSize: '.76rem' }}>{o.customer.phone}</div>
                    {o.customer.address && <div className="muted" style={{ fontSize: '.76rem' }}>{o.customer.address}</div>}
                    {o.customer.comment && <div className="muted" style={{ fontSize: '.72rem', marginTop: 4 }}>💬 {o.customer.comment}</div>}
                  </div>
                  <div>
                    <div className="wo-label">Состав</div>
                    {o.items.map(i => (
                      <div key={i.productId}>{prod(i.productId).brand} {prod(i.productId).name} × {i.qty}</div>
                    ))}
                    {o.giftBox && <div className="muted" style={{ fontSize: '.78rem' }}>+ {GIFT_BOX.title}</div>}
                    {gs && <div className="muted" style={{ fontSize: '.78rem' }}>+ Набор «{gs.name}»</div>}
                  </div>
                  <div>
                    <div className="wo-label">Оплата</div>
                    <div>{PAYMENT_LABEL[o.payment]}</div>
                    <div className="wo-label" style={{ marginTop: 12 }}>Сумма</div>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', color: 'var(--gold2)' }}>{money(o.total)}</div>
                  </div>
                </div>

                <div className="weborder-foot">
                  {o.status === 'новый'
                    ? <button className="btn btn-gold btn-sm" onClick={() => onProcess(o)}>Оформить в кассе →</button>
                    : <span className="muted" style={{ fontSize: '.76rem' }}>Проведён через кассу</span>}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

const digits = (s: string) => s.replace(/\D/g, '')

export default function Admin() {
  const [tab, setTab] = useState<Tab>('dash')
  const [sentDiscount, setSentDiscount] = useState<number[]>([])
  const [reminded, setReminded] = useState<number[]>([])
  const [sales, setSales] = useState<Sale[]>(salesMock)

  const webOrders = useOrders()
  const [extraClients, setExtraClients] = useState<Client[]>([])
  const [prefill, setPrefill] = useState<Prefill | null>(null)
  const allClients = useMemo(() => [...clients, ...extraClients], [extraClients])
  const newOrdersCount = webOrders.filter(o => o.status === 'новый').length

  // Клик по заказу с сайта → заполняем форму «Новый заказ»
  const processOrder = (order: OnlineOrder) => {
    let c = allClients.find(x => digits(x.phone) === digits(order.customer.phone))
    if (!c) {
      c = { id: Date.now(), name: order.customer.name, phone: order.customer.phone, level: 'Silver', points: 0, ltv: 0, lastVisit: 'сегодня' }
      setExtraClients(prev => [...prev, c!])
    }
    setPrefill({ productId: order.items[0].productId, clientId: c.id, orderId: order.id })
    setTab('neworder')
  }

  const sendDiscount = (idx: number) => {
    const it = interests[idx]
    setSentDiscount(s => [...s, idx])
    toast({
      title: 'Персональная скидка −10% ✦',
      text: `${client(it.clientId).name.split(' ')[0]}, вы ${it.views} раз смотрели «${prod(it.productId).name}». Дарим −10%, действует 48 ч. — так сообщение увидит клиент в Telegram.`,
    })
  }

  const remind = (id: number) => {
    const s = serviceDue.find(x => x.id === id)!
    setReminded(r => [...r, id])
    toast({
      title: '⌚ Пора на ТО',
      text: `${client(s.clientId).name.split(' ')[0]}, вашему ${s.model} (${s.serial}) скоро год — плановое обслуживание по гарантии бесплатно. Выберите время визита. — так уведомление придёт клиенту.`,
    })
  }

  return (
    <div className="admin">
      <aside className="admin-side">
        <button className={tab === 'dash' ? 'on' : ''} onClick={() => setTab('dash')}>▦ Дашборд · 7 дней</button>
        <button className={tab === 'weborders' ? 'on' : ''} onClick={() => setTab('weborders')}>
          🛒 Заказы с сайта {newOrdersCount > 0 && <span className="side-badge">{newOrdersCount}</span>}
        </button>
        <button className={tab === 'neworder' ? 'on' : ''} onClick={() => setTab('neworder')}>＋ Новый заказ</button>
        <button className={tab === 'sales' ? 'on' : ''} onClick={() => setTab('sales')}>▤ Продажи</button>
        <button className={tab === 'interest' ? 'on' : ''} onClick={() => setTab('interest')}>♦ Интересы клиентов</button>
        <button className={tab === 'demand' ? 'on' : ''} onClick={() => setTab('demand')}>◈ Спрос · лист ожидания</button>
        <button className={tab === 'tradein' ? 'on' : ''} onClick={() => setTab('tradein')}>⇄ Trade-in заявки</button>
        <button className={tab === 'service' ? 'on' : ''} onClick={() => setTab('service')}>⌚ Скоро ТО</button>
        <button className={tab === 'clients' ? 'on' : ''} onClick={() => setTab('clients')}>◉ Клиенты</button>
      </aside>

      <main className="admin-main">
        {tab === 'dash' && (
          <>
            <span className="sec-label">CRM · CHASI.UZ</span>
            <h2 style={{ marginBottom: 28 }}>Аналитика за 7 дней</h2>
            <div className="kpis">
              <div className="kpi"><div className="v">1 795</div><div className="l">визитов на сайт</div><div className="d" style={{ color: 'var(--green)' }}>▲ +12% к прошлой неделе</div></div>
              <div className="kpi"><div className="v">1 536</div><div className="l">просмотров товаров</div><div className="d" style={{ color: 'var(--green)' }}>▲ +8%</div></div>
              <div className="kpi"><div className="v">41</div><div className="l">заявок в лист ожидания</div><div className="d" style={{ color: 'var(--green)' }}>▲ +5 за сегодня</div></div>
              <div className="kpi"><div className="v">4,2%</div><div className="l">конверсия в заказ</div><div className="d" style={{ color: 'var(--red)' }}>▼ −0,3%</div></div>
            </div>

            <div className="panel">
              <h3>Самые просматриваемые модели</h3>
              <div className="sub">За последние 7 дней · клики по карточкам товаров</div>
              <Bars rows={views7d.map(v => ({ name: prod(v.productId).name, value: v.views }))} />
            </div>

            <div className="panel">
              <h3>Посещаемость по дням</h3>
              <div className="sub">Уникальные посетители</div>
              <Bars rows={dailyVisits.map(d => ({ name: d.day, value: d.visits }))} />
            </div>
          </>
        )}

        {tab === 'weborders' && (
          <WebOrders orders={webOrders} onProcess={processOrder} />
        )}

        {tab === 'neworder' && (
          <NewOrder
            onCreate={s => { setSales(prev => [s, ...prev]); setPrefill(null); setTab('sales') }}
            clientList={allClients}
            prefill={prefill}
            onProcessed={id => updateOrderStatus(id, 'оформлен')}
          />
        )}

        {tab === 'sales' && <SalesReport sales={sales} clientList={allClients} />}

        {tab === 'interest' && (
          <>
            <span className="sec-label">CRM · триггерный маркетинг</span>
            <h2 style={{ marginBottom: 8 }}>Интересы клиентов</h2>
            <p className="muted" style={{ fontSize: '.82rem', marginBottom: 26, fontWeight: 300 }}>
              Клиенты, которые смотрели один товар 3+ раза. Одна кнопка — и клиент получает персональную скидку в Telegram.
            </p>
            <table className="tbl">
              <thead><tr><th>Клиент</th><th>Товар</th><th>Просмотров</th><th>Последний раз</th><th>Действие</th></tr></thead>
              <tbody>
                {interests.map((it, i) => {
                  const done = it.discountSent || sentDiscount.includes(i)
                  return (
                    <tr key={i}>
                      <td>{client(it.clientId).name}<div className="muted" style={{ fontSize: '.7rem' }}>{client(it.clientId).phone}</div></td>
                      <td>{prod(it.productId).name}</td>
                      <td><span className="pill y">{it.views} раз</span></td>
                      <td className="muted">{it.lastSeen}</td>
                      <td>
                        {done
                          ? <span className="pill g">скидка отправлена ✓</span>
                          : <button className="btn btn-gold btn-sm" onClick={() => sendDiscount(i)}>Отправить −10%</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}

        {tab === 'demand' && (
          <>
            <span className="sec-label">CRM · закупки по спросу</span>
            <h2 style={{ marginBottom: 8 }}>Лист ожидания</h2>
            <p className="muted" style={{ fontSize: '.82rem', marginBottom: 26, fontWeight: 300 }}>
              Модели, которых нет в наличии, но клиенты хотят купить. Закупайте под подтверждённый спрос, а не наугад.
            </p>
            <table className="tbl">
              <thead><tr><th>Модель</th><th>В очереди</th><th>С депозитом</th><th>Средний бюджет</th><th></th></tr></thead>
              <tbody>
                {demand.map(d => (
                  <tr key={d.id}>
                    <td>{d.model}</td>
                    <td><span className="pill b">{d.queue} чел.</span></td>
                    <td>{d.deposits > 0 ? <span className="pill g">{d.deposits} · деньги внесены</span> : <span className="pill r">0</span>}</td>
                    <td style={{ color: 'var(--gold2)' }}>{d.avgBudget.toLocaleString('ru-RU')} $</td>
                    <td><button className="btn btn-ghost btn-sm" onClick={() => toast({ kind: 'gold', title: 'Поставка запланирована', text: `«${d.model}» добавлена в план закупки. При поступлении все ${d.queue} клиентов получат уведомление автоматически.` })}>Заказать поставку</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="panel" style={{ marginTop: 26 }}>
              <h3>Потенциальная выручка листа ожидания</h3>
              <div className="sub">Если привезти всё, что просят клиенты</div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: '2.6rem', color: 'var(--gold2)' }}>
                ≈ {demand.reduce((s, d) => s + d.queue * d.avgBudget, 0).toLocaleString('ru-RU')} $
              </div>
            </div>
          </>
        )}

        {tab === 'tradein' && (
          <>
            <span className="sec-label">CRM · выкуп и обмен</span>
            <h2 style={{ marginBottom: 26 }}>Trade-in заявки</h2>
            <table className="tbl">
              <thead><tr><th>Клиент</th><th>Его часы</th><th>Состояние</th><th>Хочет взамен</th><th>Оценка</th><th>Статус</th></tr></thead>
              <tbody>
                {tradeIns.map(t => (
                  <tr key={t.id}>
                    <td>{t.clientName}</td>
                    <td>{t.model} · {t.year}<div className="muted" style={{ fontSize: '.7rem' }}>фото приложено ⌚</div></td>
                    <td className="muted" style={{ maxWidth: 200 }}>{t.condition}</td>
                    <td>{t.wants}</td>
                    <td style={{ color: 'var(--gold2)' }}>{t.offer} $</td>
                    <td>
                      {t.status === 'новая' && <span className="pill y">новая</span>}
                      {t.status === 'оценена' && <span className="pill b">оценена</span>}
                      {t.status === 'сделка' && <span className="pill g">сделка ✓</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === 'service' && (
          <>
            <span className="sec-label">CRM · возврат клиентов</span>
            <h2 style={{ marginBottom: 8 }}>Приближается ТО</h2>
            <p className="muted" style={{ fontSize: '.82rem', marginBottom: 26, fontWeight: 300 }}>
              Клиенты, чьим часам скоро год. Напоминание возвращает клиента в бутик — а вернувшийся клиент часто уходит с новой покупкой.
            </p>
            <table className="tbl">
              <thead><tr><th>Клиент</th><th>Часы · серийный №</th><th>Куплено</th><th>ТО</th><th>Действие</th></tr></thead>
              <tbody>
                {serviceDue.map(s => {
                  const done = s.reminded || reminded.includes(s.id)
                  return (
                    <tr key={s.id}>
                      <td>{client(s.clientId).name}<div className="muted" style={{ fontSize: '.7rem' }}>{client(s.clientId).phone}</div></td>
                      <td>{s.model}<div className="muted" style={{ fontSize: '.7rem' }}>{s.serial}</div></td>
                      <td className="muted">{s.purchased}</td>
                      <td><span className={`pill ${s.daysLeft < 30 ? 'r' : 'y'}`}>{s.due} · через {s.daysLeft} дн.</span></td>
                      <td>
                        {done
                          ? <span className="pill g">напоминание отправлено ✓</span>
                          : <button className="btn btn-gold btn-sm" onClick={() => remind(s.id)}>Отправить напоминание</button>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}

        {tab === 'clients' && (
          <>
            <span className="sec-label">CRM · база — актив бизнеса</span>
            <h2 style={{ marginBottom: 26 }}>Клиенты</h2>
            <table className="tbl">
              <thead><tr><th>Клиент</th><th>Уровень</th><th>Баллы</th><th>LTV</th><th>Последний визит</th></tr></thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id}>
                    <td>{c.name}<div className="muted" style={{ fontSize: '.7rem' }}>{c.phone}</div></td>
                    <td>
                      <span className={`pill ${c.level === 'Platinum' ? 'b' : c.level === 'Gold' ? 'y' : 'g'}`}>{c.level}</span>
                    </td>
                    <td>{c.points.toLocaleString('ru-RU')}</td>
                    <td style={{ color: 'var(--gold2)' }}>{c.ltv.toLocaleString('ru-RU')} $</td>
                    <td className="muted">{c.lastVisit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
    </div>
  )
}
