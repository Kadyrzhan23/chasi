import { useMemo, useState } from 'react'
import WatchVisual from '../components/WatchVisual'
import { brands, CATEGORY_LABEL, Category, Product, products, Style, STYLE_LABEL } from '../data/mock'
import { toast } from '../toast'
import { useAuth } from '../App'

type Wrist = 'any' | 'slim' | 'mid' | 'wide'
const WRIST_LABEL: Record<Wrist, string> = {
  any: 'Не важно', slim: 'До 16 см (⌀ ≤ 39мм)', mid: '16–18 см (⌀ 39–42мм)', wide: 'От 18 см (⌀ 42мм+)',
}

const CATS: (Category | 'all')[] = ['all', 'original', 'clone-swiss', 'clone-mech', 'aaaa', 'aaa']
const catLabel = (c: Category | 'all') => (c === 'all' ? 'Все' : CATEGORY_LABEL[c])

export default function Catalog() {
  const { authed } = useAuth()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<Category | 'all'>('all')
  const [selBrands, setSelBrands] = useState<string[]>([])
  const [gender, setGender] = useState<'все' | 'муж' | 'жен' | 'унисекс'>('все')
  const [styles, setStyles] = useState<Style[]>([])
  const [pMin, setPMin] = useState(''); const [pMax, setPMax] = useState('')
  const [wrist, setWrist] = useState<Wrist>('any')
  const [water300, setWater300] = useState(false)
  const [reserve60, setReserve60] = useState(false)
  const [sapphire, setSapphire] = useState(false)
  const [stockOnly, setStockOnly] = useState(false)
  const [sort, setSort] = useState('pop')
  const [modal, setModal] = useState<Product | null>(null)
  const [views, setViews] = useState<Record<number, number>>({})

  const list = useMemo(() => {
    let r = products.filter(p => {
      if (q && !(p.name + ' ' + p.brand).toLowerCase().includes(q.toLowerCase())) return false
      if (cat !== 'all' && p.category !== cat) return false
      if (selBrands.length && !selBrands.includes(p.brand)) return false
      if (gender !== 'все' && p.gender !== gender) return false
      if (styles.length && !styles.includes(p.style)) return false
      if (pMin && p.price < +pMin) return false
      if (pMax && p.price > +pMax) return false
      if (wrist === 'slim' && p.diameter > 39) return false
      if (wrist === 'mid' && (p.diameter < 39 || p.diameter > 42)) return false
      if (wrist === 'wide' && p.diameter < 42) return false
      if (water300 && p.water < 300) return false
      if (reserve60 && p.reserve < 60) return false
      if (sapphire && p.glass !== 'сапфировое') return false
      if (stockOnly && !p.inStock) return false
      return true
    })
    if (sort === 'asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'dia') r = [...r].sort((a, b) => a.diameter - b.diameter)
    return r
  }, [q, cat, selBrands, gender, styles, pMin, pMax, wrist, water300, reserve60, sapphire, stockOnly, sort])

  const brandCount = (b: string) => products.filter(p => p.brand === b).length

  const openModal = (p: Product) => {
    setModal(p)
    setViews(v => {
      const n = (v[p.id] ?? 0) + 1
      if (n === 3) setTimeout(() => toast({
        title: 'Персональное предложение ✦',
        text: `Вы открыли «${p.name}» уже 3 раза. Скидка −10% на эту модель, действует 48 часов. Промокод: ${p.brand.slice(0, 3).toUpperCase()}-10.`,
      }), 600)
      return { ...v, [p.id]: n }
    })
  }

  const reset = () => {
    setQ(''); setCat('all'); setSelBrands([]); setGender('все'); setStyles([])
    setPMin(''); setPMax(''); setWrist('any'); setWater300(false); setReserve60(false); setSapphire(false); setStockOnly(false)
  }

  return (
    <>
      <section style={{ padding: '50px 4vw 10px' }}>
        <span className="sec-label">Каталог</span>
        <h1 className="big" style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)' }}>Найдите <em>свои</em> часы</h1>
      </section>

      <div className="catalog">
        {/* -------- ФИЛЬТРЫ -------- */}
        <aside className="filters">
          <input className="search-inp" placeholder="Поиск: модель или бренд…" value={q} onChange={e => setQ(e.target.value)} />

          <div className="fgroup">
            <h4>Класс товара</h4>
            <div className="chips">
              {CATS.map(c => (
                <button key={c} className={`chip ${cat === c ? 'on' : ''}`} onClick={() => setCat(c)}>{catLabel(c)}</button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <h4>Подбор по запястью ✦</h4>
            <select className="select" style={{ width: '100%' }} value={wrist} onChange={e => setWrist(e.target.value as Wrist)}>
              {(Object.keys(WRIST_LABEL) as Wrist[]).map(w => <option key={w} value={w}>{WRIST_LABEL[w]}</option>)}
            </select>
            <div className="muted" style={{ fontSize: '.7rem', marginTop: 10, lineHeight: 1.6 }}>
              Укажите обхват запястья — покажем модели, которые сядут идеально.
            </div>
          </div>

          <div className="fgroup">
            <h4>Бренд</h4>
            {brands.map(b => (
              <label key={b} className="fitem">
                <input type="checkbox" checked={selBrands.includes(b)}
                  onChange={() => setSelBrands(s => (s.includes(b) ? s.filter(x => x !== b) : [...s, b]))} />
                {b}<span className="cnt">{brandCount(b)}</span>
              </label>
            ))}
          </div>

          <div className="fgroup">
            <h4>Стиль</h4>
            <div className="chips">
              {(Object.keys(STYLE_LABEL) as Style[]).map(s => (
                <button key={s} className={`chip ${styles.includes(s) ? 'on' : ''}`}
                  onClick={() => setStyles(x => (x.includes(s) ? x.filter(y => y !== s) : [...x, s]))}>
                  {STYLE_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <h4>Для кого</h4>
            <div className="chips">
              {(['все', 'муж', 'жен', 'унисекс'] as const).map(g => (
                <button key={g} className={`chip ${gender === g ? 'on' : ''}`} onClick={() => setGender(g)}>
                  {g === 'все' ? 'Все' : g === 'муж' ? 'Мужские' : g === 'жен' ? 'Женские' : 'Унисекс'}
                </button>
              ))}
            </div>
          </div>

          <div className="fgroup">
            <h4>Цена, $</h4>
            <div className="range-row">
              <input type="number" placeholder="от" value={pMin} onChange={e => setPMin(e.target.value)} />
              <span className="muted">—</span>
              <input type="number" placeholder="до" value={pMax} onChange={e => setPMax(e.target.value)} />
            </div>
          </div>

          <div className="fgroup">
            <h4>Особые фильтры ✦</h4>
            <label className="fitem"><input type="checkbox" checked={water300} onChange={e => setWater300(e.target.checked)} />Для плавания (300м+)</label>
            <label className="fitem"><input type="checkbox" checked={reserve60} onChange={e => setReserve60(e.target.checked)} />Запас хода 60ч+ («на выходные»)</label>
            <label className="fitem"><input type="checkbox" checked={sapphire} onChange={e => setSapphire(e.target.checked)} />Только сапфировое стекло</label>
            <label className="fitem"><input type="checkbox" checked={stockOnly} onChange={e => setStockOnly(e.target.checked)} />Только в наличии</label>
          </div>

          <button className="reset-btn" onClick={reset}>Сбросить все фильтры</button>
        </aside>

        {/* -------- СПИСОК -------- */}
        <div>
          <div className="cat-top">
            <div className="muted" style={{ fontSize: '.82rem' }}>Найдено моделей: <b style={{ color: 'var(--gold2)' }}>{list.length}</b></div>
            <select className="select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="pop">По популярности</option>
              <option value="asc">Цена: по возрастанию</option>
              <option value="desc">Цена: по убыванию</option>
              <option value="dia">По диаметру</option>
            </select>
          </div>

          {list.length === 0 && (
            <div className="empty">
              Ничего не нашлось. Ослабьте фильтры — или встаньте в <b style={{ color: 'var(--gold2)' }}>лист ожидания</b>, и мы привезём модель под вас.
            </div>
          )}

          <div className="grid3">
            {list.map(p => (
              <div key={p.id} className="card" onClick={() => openModal(p)}>
                {(views[p.id] ?? 0) >= 3 && <div className="badge gold">−10% для вас</div>}
                {!p.inStock && <div className="badge red">нет в наличии</div>}
                {p.inStock && (views[p.id] ?? 0) > 0 && <div className="badge">просмотров: {views[p.id]}</div>}
                <div className="w"><WatchVisual product={p} /></div>
                <h3>{p.name}</h3>
                <div className="cat">{p.brand} · ⌀{p.diameter}мм</div>
                <div style={{ marginBottom: 12 }}>
                  <span className={`tag ${p.category === 'original' ? 'orig' : 'copy'}`}>{CATEGORY_LABEL[p.category]}</span>
                </div>
                <div className={`price ${authed ? '' : 'locked'}`}>{p.price.toLocaleString('ru-RU')} $</div>
                <div className="lock-note">🔒 Войдите, чтобы увидеть цену</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* -------- МОДАЛКА ТОВАРА -------- */}
      {modal && (
        <div className="overlay" onClick={() => setModal(null)}>
          <div className="modal" style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button className="m-close" onClick={() => setModal(null)}>×</button>
            <div className="m-left"><WatchVisual product={modal} /></div>
            <div className="m-right">
              <span className="sec-label">{CATEGORY_LABEL[modal.category]}</span>
              <h2 style={{ fontSize: '1.9rem' }}>{modal.name}</h2>
              <div className="muted" style={{ fontSize: '.8rem', marginTop: 6 }}>
                Вы открывали эту модель: <b style={{ color: 'var(--gold2)' }}>{views[modal.id] ?? 1}</b> раз
                {(views[modal.id] ?? 0) >= 3 && <span style={{ color: 'var(--gold)' }}> · активна скидка −10%</span>}
              </div>
              <table className="spec-table">
                <tbody>
                  <tr><td>Механизм</td><td>{modal.movement}</td></tr>
                  {modal.reserve > 0 && <tr><td>Запас хода</td><td>до {modal.reserve} ч</td></tr>}
                  <tr><td>Водонепроницаемость</td><td>до {modal.water} м</td></tr>
                  <tr><td>Стекло</td><td>{modal.glass}</td></tr>
                  <tr><td>Диаметр</td><td>{modal.diameter} мм</td></tr>
                  <tr><td>Гарантия</td><td>2 года на механизм</td></tr>
                </tbody>
              </table>
              <div className={`price ${authed ? '' : 'locked'}`} style={{ fontSize: '1.7rem', marginBottom: 6 }}>
                {(views[modal.id] ?? 0) >= 3
                  ? <>
                      <s className="muted" style={{ fontSize: '1.1rem', marginRight: 10 }}>{modal.price.toLocaleString('ru-RU')} $</s>
                      {Math.round(modal.price * 0.9).toLocaleString('ru-RU')} $
                    </>
                  : <>{modal.price.toLocaleString('ru-RU')} $</>}
              </div>
              <div className="lock-note" style={{ marginBottom: 18 }}>🔒 Авторизуйтесь, чтобы увидеть цену</div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
                {modal.inStock ? (
                  <button className="btn btn-gold" onClick={() => toast({ kind: 'gold', title: 'Добавлено в корзину', text: `${modal.name} ждёт вас в корзине. Оплата: Click, Payme, карта или рассрочка.` })}>В корзину</button>
                ) : (
                  <button className="btn btn-gold" onClick={() => toast({ title: 'Вы в листе ожидания ✦', text: `«${modal.name}» — сообщим в Telegram в день поступления. Внесите депозит, чтобы зафиксировать цену и приоритет.` })}>Встать в очередь</button>
                )}
                <button className="btn btn-ghost" onClick={() => toast({ kind: 'gold', title: 'В wishlist ✦', text: `«${modal.name}» добавлены в список желаний. Владелец видит спрос на модель в CRM.` })}>♡ В wishlist</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
