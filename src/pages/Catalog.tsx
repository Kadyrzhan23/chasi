import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import WatchVisual from '../components/WatchVisual'
import { brands, CATEGORY_LABEL, Category, products, Style, STYLE_LABEL } from '../data/mock'
import { useAuth } from '../App'
import { effectivePrice, isLowStock, useProducts } from '../store/products'
import { catalogLink } from '../store/tags'

type Wrist = 'any' | 'slim' | 'mid' | 'wide'
const WRIST_LABEL: Record<Wrist, string> = {
  any: 'Не важно', slim: 'До 16 см (⌀ ≤ 39мм)', mid: '16–18 см (⌀ 39–42мм)', wide: 'От 18 см (⌀ 42мм+)',
}

type PType = 'all' | 'orig' | 'replica'
type Avail = 'all' | 'in' | 'order'

const CATS: (Category | 'all')[] = ['all', 'original', 'clone-swiss', 'clone-mech', 'aaaa', 'aaa']
const catLabel = (c: Category | 'all') => (c === 'all' ? 'Все' : CATEGORY_LABEL[c])

// короткий ярлык статуса товара для угла карточки
const CARD_CAT: Record<Category, string> = {
  original: 'Оригинал', 'clone-swiss': '1:1 клон', 'clone-mech': '1:1 клон', aaaa: 'AAAA копия', aaa: 'AAA копия',
}

export default function Catalog() {
  const { authed } = useAuth()
  const navigate = useNavigate()
  const [sp] = useSearchParams()
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
  const [avail, setAvail] = useState<Avail>('all')
  const [ptype, setPType] = useState<PType>('all')
  const [movement, setMovement] = useState('')
  const [sort, setSort] = useState('pop')

  // Применяем фильтры из URL (?brand=, ?cat=, ?style=, ?stock=, ?type=, ?movement=).
  // Работает и при переходе по тегу на уже открытый каталог.
  useEffect(() => {
    setQ(sp.get('q') ?? '')
    const c = sp.get('cat') as Category | null
    setCat(c && CATS.includes(c) ? c : 'all')
    setSelBrands(sp.getAll('brand'))
    const st = sp.get('style') as Style | null
    setStyles(st && st in STYLE_LABEL ? [st] : [])
    const s = sp.get('stock')
    setAvail(s === 'in' ? 'in' : s === 'order' ? 'order' : 'all')
    const t = sp.get('type')
    setPType(t === 'orig' ? 'orig' : t === 'replica' ? 'replica' : 'all')
    setMovement(sp.get('movement') ?? '')
  }, [sp])

  const shopProducts = useProducts()

  const list = useMemo(() => {
    let r = shopProducts.filter(p => {
      if (q && !(p.name + ' ' + p.brand).toLowerCase().includes(q.toLowerCase())) return false
      if (cat !== 'all' && p.category !== cat) return false
      if (ptype === 'orig' && p.category !== 'original') return false
      if (ptype === 'replica' && p.category === 'original') return false
      if (movement && p.movement !== movement) return false
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
      if (avail === 'in' && !p.inStock) return false
      if (avail === 'order' && p.inStock) return false
      return true
    })
    if (sort === 'asc') r = [...r].sort((a, b) => a.price - b.price)
    if (sort === 'desc') r = [...r].sort((a, b) => b.price - a.price)
    if (sort === 'dia') r = [...r].sort((a, b) => a.diameter - b.diameter)
    return r
  }, [shopProducts, q, cat, ptype, movement, selBrands, gender, styles, pMin, pMax, wrist, water300, reserve60, sapphire, avail, sort])

  const brandCount = (b: string) => products.filter(p => p.brand === b).length

  const reset = () => {
    setQ(''); setCat('all'); setSelBrands([]); setGender('все'); setStyles([])
    setPMin(''); setPMax(''); setWrist('any'); setWater300(false); setReserve60(false); setSapphire(false)
    setAvail('all'); setPType('all'); setMovement('')
  }

  // Активные фильтры-теги — снимаемые чипы над списком
  const activeFilters: { label: string; clear: () => void }[] = []
  if (q) activeFilters.push({ label: `Поиск: ${q}`, clear: () => setQ('') })
  if (ptype !== 'all') activeFilters.push({ label: ptype === 'orig' ? 'Оригинал' : 'Реплика', clear: () => setPType('all') })
  if (cat !== 'all') activeFilters.push({ label: CATEGORY_LABEL[cat], clear: () => setCat('all') })
  selBrands.forEach(b => activeFilters.push({ label: b, clear: () => setSelBrands(s => s.filter(x => x !== b)) }))
  styles.forEach(s => activeFilters.push({ label: STYLE_LABEL[s], clear: () => setStyles(x => x.filter(y => y !== s)) }))
  if (movement) activeFilters.push({ label: movement, clear: () => setMovement('') })
  if (avail !== 'all') activeFilters.push({ label: avail === 'in' ? 'В наличии' : 'Под заказ', clear: () => setAvail('all') })
  if (gender !== 'все') activeFilters.push({ label: gender === 'муж' ? 'Мужские' : gender === 'жен' ? 'Женские' : 'Унисекс', clear: () => setGender('все') })

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
            <label className="fitem"><input type="checkbox" checked={avail === 'in'} onChange={e => setAvail(e.target.checked ? 'in' : 'all')} />Только в наличии</label>
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

          {activeFilters.length > 0 && (
            <div className="active-filters">
              <span className="muted" style={{ fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>Фильтры:</span>
              {activeFilters.map((f, i) => (
                <button key={i} className="afchip" onClick={f.clear}>{f.label} <span>✕</span></button>
              ))}
              <button className="reset-btn" style={{ marginLeft: 4 }} onClick={reset}>сбросить всё</button>
            </div>
          )}

          {list.length === 0 && (
            <div className="empty">
              Ничего не нашлось. Ослабьте фильтры — или встаньте в <b style={{ color: 'var(--gold2)' }}>лист ожидания</b>, и мы привезём модель под вас.
            </div>
          )}

          <div className="grid3">
            {list.map(p => (
              <div key={p.id} className="card" onClick={() => navigate(`/product/${p.id}`)}>
                {/* слева сверху — тип товара + скидка (клик = фильтр) */}
                <div className="card-corner left">
                  <Link className={`cbadge ${p.category === 'original' ? 'orig' : 'copy'}`} to={catalogLink({ cat: p.category })} onClick={e => e.stopPropagation()}>{CARD_CAT[p.category]}</Link>
                  {p.discount > 0 && <span className="cbadge gold">−{p.discount}%</span>}
                </div>
                {/* справа сверху — наличие / остаток (клик = фильтр) */}
                <div className="card-corner right">
                  {!p.inStock
                    ? <Link className="cbadge stock-order" to={catalogLink({ stock: 'order' })} onClick={e => e.stopPropagation()}>под заказ</Link>
                    : isLowStock(p)
                      ? <Link className="cbadge stock-low" to={catalogLink({ stock: 'in' })} onClick={e => e.stopPropagation()}>осталось {p.stock}</Link>
                      : <Link className="cbadge stock-ok" to={catalogLink({ stock: 'in' })} onClick={e => e.stopPropagation()}>в наличии</Link>}
                </div>
                <div className="w"><WatchVisual product={p} /></div>
                <h3>{p.name}</h3>
                <div className="cat">{p.brand} · ⌀{p.diameter}мм</div>
                <div className={`price ${authed ? '' : 'locked'}`} style={{ marginTop: 12 }}>
                  {p.discount > 0
                    ? <><s className="muted" style={{ fontSize: '.85rem', marginRight: 8 }}>{p.price.toLocaleString('ru-RU')} $</s>{effectivePrice(p).toLocaleString('ru-RU')} $</>
                    : <>{p.price.toLocaleString('ru-RU')} $</>}
                </div>
                <div className="lock-note">🔒 Войдите, чтобы увидеть цену</div>
                <div className="card-cta muted">Открыть карточку →</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
