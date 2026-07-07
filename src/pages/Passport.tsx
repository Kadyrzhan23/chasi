import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QR from '../components/QR'
import WatchVisual from '../components/WatchVisual'
import { CATEGORY_LABEL, myPurchases, passports, products, STYLE_LABEL } from '../data/mock'
import { toast } from '../toast'

const TODAY = new Date(2026, 6, 3) // дата демо: 03.07.2026

function parseD(d: string) { const [dd, mm, yy] = d.split('.').map(Number); return new Date(yy, mm - 1, dd) }
function addMonths(d: Date, m: number) { const r = new Date(d); r.setMonth(r.getMonth() + m); return r }
function fmt(d: Date) { return d.toLocaleDateString('ru-RU') }

/* Полное ТО механических часов — классический регламент */
const FULL_SERVICE = [
  'Полная разборка механизма до отдельных деталей',
  'Ультразвуковая чистка в специальных растворах',
  'Замена изношенных деталей при необходимости',
  'Смазка часовыми маслами Moebius по карте смазки',
  'Демагнитизация механизма',
  'Регулировка точности хода на тайминг-машине',
  'Замена прокладок заводной головки и задней крышки',
  'Тест водонепроницаемости под давлением',
  'Чистка и полировка корпуса и браслета',
  'Финальный контроль точности хода 48–72 часа',
]

export default function Passport() {
  const { serial } = useParams()
  const pass = passports.find(p => p.serial === serial)
  const purchase = pass ? myPurchases.find(p => p.id === pass.purchaseId) : undefined
  const product = purchase ? products.find(p => p.id === purchase.productId) : undefined

  const [barGo, setBarGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setBarGo(true), 300); return () => clearTimeout(t) }, [])

  if (!pass || !purchase || !product) {
    return (
      <div className="pass-page">
        <div className="empty">Паспорт не найден. Проверьте QR-код или обратитесь в бутик.</div>
        <div style={{ textAlign: 'center' }}><Link className="btn btn-ghost" to="/account">← В кабинет</Link></div>
      </div>
    )
  }

  const bought = parseD(purchase.date)
  const warrEnd = addMonths(bought, pass.warrantyMonths)
  const warrPct = Math.min(100, Math.max(0, ((TODAY.getTime() - bought.getTime()) / (warrEnd.getTime() - bought.getTime())) * 100))
  const warrLeft = Math.max(0, Math.round((warrEnd.getTime() - TODAY.getTime()) / 86400000))
  const nextCheck = addMonths(bought, pass.waterCheckMonths)
  const nextFull = addMonths(bought, pass.serviceIntervalYears * 12)
  const freeLeft = pass.freeVisitsTotal - pass.freeVisitsUsed
  const hash = `${pass.recordNo}-${pass.serial}`.split('').reduce((a, c) => ((a * 33 + c.charCodeAt(0)) >>> 0), 5381).toString(16).toUpperCase()

  return (
    <div className="pass-page">
      <div className="pass-top">
        <Link to="/account">← Личный кабинет</Link>
        <span className="scan-hint">✓ открыто по QR-коду</span>
      </div>

      <div className="cert">
        {/* шапка документа */}
        <div className="cert-head">
          <div className="crest">CHASI.UZ</div>
          <div className="doc-t">Цифровой паспорт часов</div>
          <div className="rec">Запись в реестре бутика № {pass.recordNo}</div>
        </div>

        {/* подлинность + печать */}
        <div className="seal-row">
          <div className="verified">
            <div className="v-badge">✓</div>
            <div>
              <div className="v-t">Подлинность подтверждена</div>
              <div className="v-s">
                Часы проверены и внесены в реестр {pass.verifiedDate}.<br />{pass.verifiedBy}
              </div>
            </div>
          </div>
          <svg className="seal" viewBox="0 0 120 120">
            <defs><path id="circ" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" /></defs>
            <circle cx="60" cy="60" r="56" fill="none" stroke="var(--gold)" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="34" fill="none" stroke="var(--gold)" strokeWidth="1" />
            <text fontSize="10.5" letterSpacing="2.5" fill="var(--gold)">
              <textPath href="#circ">CHASI.UZ · AUTHENTICITY VERIFIED · TASHKENT ·</textPath>
            </text>
            <text x="60" y="66" textAnchor="middle" fontSize="20" fill="var(--gold2)" fontFamily="Cormorant Garamond,serif">✦</text>
          </svg>
        </div>

        {/* модель */}
        <div className="pass-hero">
          <WatchVisual product={product} className="watch" />
          <div>
            <div className="ph-brand">{product.brand} · {CATEGORY_LABEL[product.category]}</div>
            <h1>{product.name}</h1>
            <div className="muted" style={{ fontSize: '.82rem', marginTop: 10, fontWeight: 300 }}>
              Владелец: <b style={{ color: 'var(--gold2)' }}>Азиз Каримов</b> · приобретено {purchase.date} в бутике CHASI.UZ
            </div>
          </div>
        </div>

        {/* спецификация */}
        <div className="spec-grid">
          <div className="spec-cell"><div className="k">Производитель</div><div className="v">{product.brand}</div></div>
          <div className="spec-cell"><div className="k">Модель</div><div className="v">{product.name}</div></div>
          <div className="spec-cell"><div className="k">Категория</div><div className="v">{STYLE_LABEL[product.style]} · {product.gender}.</div></div>
          <div className="spec-cell"><div className="k">Артикул (референс)</div><div className="v"><b>{purchase.ref}</b></div></div>
          <div className="spec-cell"><div className="k">Серийный номер</div><div className="v"><b>{pass.serial}</b></div></div>
          <div className="spec-cell"><div className="k">Дата производства</div><div className="v">{pass.producedDate}</div></div>
          <div className="spec-cell"><div className="k">Механизм · калибр</div><div className="v">{pass.caliber}</div></div>
          <div className="spec-cell"><div className="k">Камни / частота</div><div className="v">{pass.jewels} камней · {pass.frequency}</div></div>
          <div className="spec-cell"><div className="k">Запас хода</div><div className="v">{product.reserve > 0 ? `до ${product.reserve} ч` : '—'}</div></div>
          <div className="spec-cell"><div className="k">Стекло</div><div className="v">{product.glass}</div></div>
          <div className="spec-cell"><div className="k">Водонепроницаемость</div><div className="v">до {product.water} м</div></div>
          <div className="spec-cell"><div className="k">Диаметр корпуса</div><div className="v">{product.diameter} мм</div></div>
        </div>

        {/* гарантия */}
        <div className="pass-sec">
          <h3>Гарантия — {pass.warrantyMonths} месяца</h3>
          <div className="sub">Отсчёт с даты покупки · {purchase.date} → {fmt(warrEnd)}</div>
          <div className="warr-bar"><i style={{ width: barGo ? `${warrPct}%` : 0 }} /></div>
          <div className="warr-row">
            <span>Куплено: {purchase.date}</span>
            <span style={{ color: 'var(--gold2)' }}>осталось {warrLeft} дн.</span>
            <span>До: {fmt(warrEnd)}</span>
          </div>
        </div>

        {/* сервисный план */}
        <div className="pass-sec">
          <h3>Сервисный план для этой модели</h3>
          <div className="sub">Рекомендации производителя для механизма с автоподзаводом</div>
          <div className="svc-plan">
            <div className="svc-card">
              <div className="t">Ежегодный осмотр</div>
              <div className="i">каждые {pass.waterCheckMonths} мес · следующий: {fmt(nextCheck)}</div>
              <p>Проверка точности хода, тест водонепроницаемости, состояние прокладок, чистка корпуса и браслета, регулировка застёжки. Занимает ~30 минут при вас.</p>
            </div>
            <div className="svc-card">
              <div className="t">Полное ТО механизма</div>
              <div className="i">каждые {pass.serviceIntervalYears} года · следующее: {fmt(nextFull)}</div>
              <p>Полная разборка, чистка и смазка механизма. Продлевает жизнь часов на десятилетия — как замена масла в хорошем автомобиле.</p>
            </div>
          </div>
        </div>

        {/* что входит в полное ТО */}
        <div className="pass-sec">
          <h3>Что входит в полное ТО</h3>
          <div className="sub">Классический регламент обслуживания швейцарских часов</div>
          <div className="check-list">
            {FULL_SERVICE.map(s => <div key={s}>{s}</div>)}
          </div>
        </div>

        {/* привилегии */}
        <div className="pass-sec">
          <h3>Привилегии владельца паспорта</h3>
          <div className="sub">Действуют только при наличии цифрового паспорта CHASI.UZ</div>
          <div className="coupons">
            <div className="coupon">
              <div className="c-v">{freeLeft} из {pass.freeVisitsTotal}</div>
              <div className="c-t">бесплатных сервисных визита в первый год после покупки{pass.freeVisitsUsed > 0 ? ` · ${pass.freeVisitsUsed} использован` : ''}</div>
              <div className="c-s">
                <button className="btn btn-gold btn-sm" onClick={() => toast({ kind: 'gold', title: 'Запись на сервис ✦', text: `${product.name}: визит записан. Напомним в Telegram за день. Бесплатных визитов останется: ${Math.max(0, freeLeft - 1)}.` })}>
                  Записаться
                </button>
              </div>
            </div>
            <div className="coupon">
              <div className="c-v">−20%</div>
              <div className="c-t">на первое полное ТО после окончания гарантии</div>
            </div>
            <div className="coupon">
              <div className="c-v">+5%</div>
              <div className="c-t">к стоимости при перепродаже: часы с паспортом и сервисной историей ценятся выше</div>
            </div>
          </div>
        </div>

        {/* история обслуживания */}
        <div className="pass-sec">
          <h3>Сервисная история</h3>
          <div className="sub">Каждый визит фиксируется в паспорте и повышает стоимость часов при перепродаже</div>
          {purchase.history.map((h, i) => (
            <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--line2)', fontSize: '.85rem', fontWeight: 300 }}>
              <span style={{ color: 'var(--gold)' }}>◆ {h.date}</span> — {h.what}
            </div>
          ))}
        </div>

        {/* подпись документа */}
        <div className="cert-foot">
          <QR seed={pass.serial} size={84} />
          <div className="hash">
            Криптографическая подпись записи: {hash}-{pass.serial}<br />
            Проверить подлинность: chasi.uz/verify · Реестр № {pass.recordNo}<br />
            {pass.verifiedBy} · +998 90 903 00 04
          </div>
          <div style={{ fontFamily: 'var(--serif)', color: 'var(--gold2)', fontSize: '1.05rem', letterSpacing: '.15em', textAlign: 'right' }}>
            — Сардор<br />
            <span className="muted" style={{ fontSize: '.62rem', letterSpacing: '.2em' }}>ОСНОВАТЕЛЬ БУТИКА</span>
          </div>
        </div>
      </div>
    </div>
  )
}
