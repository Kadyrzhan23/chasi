import { Link, useNavigate, useParams } from 'react-router-dom'
import WatchVisual from '../components/WatchVisual'
import { CATEGORY_LABEL, Category, DISCOUNT_OPTIONS, STYLE_LABEL, Style } from '../data/mock'
import { effectivePrice, hasOverride, resetProduct, updateProduct, useProduct } from '../store/products'
import { productTags } from '../store/tags'
import { toast } from '../toast'

const CATS: Category[] = ['original', 'clone-swiss', 'clone-mech', 'aaaa', 'aaa']
const STYLES = Object.keys(STYLE_LABEL) as Style[]
const GENDERS = ['муж', 'жен', 'унисекс'] as const
const MOVEMENTS = ['автоподзавод', 'кварц', 'механика'] as const
const GLASSES = ['сапфировое', 'минеральное'] as const
const money = (n: number) => n.toLocaleString('ru-RU') + ' $'

export default function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const pid = Number(id)
  const p = useProduct(pid)

  if (!p) {
    return (
      <section style={{ padding: '120px 4vw', textAlign: 'center' }}>
        <span className="sec-label">CRM · товар</span>
        <h1 className="big" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Товар не найден</h1>
        <Link className="btn btn-gold" to="/admin" style={{ marginTop: 20 }}>← В CRM</Link>
      </section>
    )
  }

  const set = (patch: Parameters<typeof updateProduct>[1]) => updateProduct(pid, patch)
  const num = (v: string) => Math.max(0, Number(v) || 0)

  const reset = () => {
    resetProduct(pid)
    toast({ kind: 'gold', title: 'Сброшено ✦', text: `«${p.name}» возвращён к исходным данным из базы.` })
  }

  const tags = productTags(p)

  return (
    <section style={{ padding: '40px 4vw 80px', maxWidth: 1080, margin: '0 auto' }}>
      <div className="crumbs" style={{ marginBottom: 18 }}>
        <Link to="/admin">CRM</Link> <span>/</span> <Link to="/admin">Товары</Link> <span>/</span> <b>{p.name}</b>
      </div>

      <div className="edit-head">
        <div>
          <span className="sec-label">CRM · редактирование товара</span>
          <h2>{p.name}</h2>
          <div className="muted" style={{ fontSize: '.8rem', marginTop: 4 }}>
            {hasOverride(pid) ? 'Есть изменения относительно базы' : 'Данные из базы'}
          </div>
        </div>
        <div className="product-actions">
          <Link className="btn btn-ghost btn-sm" to={`/product/${p.id}`}>На витрине →</Link>
          <button className="btn btn-ghost btn-sm" onClick={reset} disabled={!hasOverride(pid)}>Сбросить к исходному</button>
        </div>
      </div>

      <div className="edit-layout">
        {/* ---- форма ---- */}
        <div className="panel">
          <div className="edit-form">
            <div className="edit-field" style={{ gridColumn: '1 / -1' }}>
              <label>Название</label>
              <input className="search-inp" value={p.name} onChange={e => set({ name: e.target.value })} />
            </div>

            <div className="edit-field">
              <label>Бренд</label>
              <input className="search-inp" value={p.brand} onChange={e => set({ brand: e.target.value })} />
            </div>
            <div className="edit-field">
              <label>Настоящая цена, $</label>
              <input className="search-inp" type="number" min={0} value={p.price} onChange={e => set({ price: num(e.target.value) })} />
            </div>

            <div className="edit-field">
              <label>Класс товара</label>
              <select className="select" style={{ width: '100%' }} value={p.category} onChange={e => set({ category: e.target.value as Category })}>
                {CATS.map(c => <option key={c} value={c}>{CATEGORY_LABEL[c]}</option>)}
              </select>
            </div>
            <div className="edit-field">
              <label>Стиль</label>
              <select className="select" style={{ width: '100%' }} value={p.style} onChange={e => set({ style: e.target.value as Style })}>
                {STYLES.map(s => <option key={s} value={s}>{STYLE_LABEL[s]}</option>)}
              </select>
            </div>

            <div className="edit-field">
              <label>Механизм</label>
              <select className="select" style={{ width: '100%' }} value={p.movement} onChange={e => set({ movement: e.target.value as typeof MOVEMENTS[number] })}>
                {MOVEMENTS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="edit-field">
              <label>Для кого</label>
              <select className="select" style={{ width: '100%' }} value={p.gender} onChange={e => set({ gender: e.target.value as typeof GENDERS[number] })}>
                {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="edit-field">
              <label>Диаметр, мм</label>
              <input className="search-inp" type="number" min={0} step={0.5} value={p.diameter} onChange={e => set({ diameter: num(e.target.value) })} />
            </div>
            <div className="edit-field">
              <label>Водозащита, м</label>
              <input className="search-inp" type="number" min={0} step={10} value={p.water} onChange={e => set({ water: num(e.target.value) })} />
            </div>

            <div className="edit-field">
              <label>Запас хода, ч (0 = кварц)</label>
              <input className="search-inp" type="number" min={0} value={p.reserve} onChange={e => set({ reserve: num(e.target.value) })} />
            </div>
            <div className="edit-field">
              <label>Стекло</label>
              <select className="select" style={{ width: '100%' }} value={p.glass} onChange={e => set({ glass: e.target.value as typeof GLASSES[number] })}>
                {GLASSES.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="edit-field">
              <label>Остаток на складе, шт.</label>
              <div className="stepper">
                <button onClick={() => set({ stock: Math.max(0, p.stock - 1) })} disabled={p.stock <= 0}>−</button>
                <span>{p.stock} шт.</span>
                <button onClick={() => set({ stock: p.stock + 1 })}>+</button>
              </div>
              <div className="muted" style={{ fontSize: '.68rem', marginTop: 6 }}>
                статус: {p.stock === 0 ? 'под заказ' : p.stock <= 3 ? `в наличии · осталось ${p.stock}` : 'в наличии'}
              </div>
            </div>
            <div className="edit-field">
              <label>Скидка на модель</label>
              <div className="chips">
                {DISCOUNT_OPTIONS.map(d => (
                  <button key={d} className={`chip ${p.discount === d ? 'on' : ''}`} onClick={() => set({ discount: d })}>
                    {d === 0 ? 'Нет' : `−${d}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---- превью ---- */}
        <aside className="edit-preview">
          <div className="panel">
            <h3 style={{ marginBottom: 14 }}>Превью карточки</h3>
            <div className="card" style={{ cursor: 'default' }}>
              <div className="card-corner right">
                {p.stock === 0
                  ? <span className="cbadge stock-order">под заказ</span>
                  : p.stock <= 3
                    ? <span className="cbadge stock-low">осталось {p.stock}</span>
                    : <span className="cbadge stock-ok">в наличии</span>}
              </div>
              <div className="w"><WatchVisual product={p} /></div>
              <h3>{p.name}</h3>
              <div className="cat">{p.brand} · ⌀{p.diameter}мм</div>
              <div className="price" style={{ marginTop: 12 }}>
                {p.discount > 0
                  ? <><s className="muted" style={{ fontSize: '.85rem', marginRight: 8 }}>{money(p.price)}</s>{money(effectivePrice(p))}</>
                  : money(p.price)}
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginBottom: 6 }}>Теги (авто)</h3>
            <div className="muted" style={{ fontSize: '.76rem', marginBottom: 14, fontWeight: 300 }}>
              Выводятся из полей выше. Клик ведёт в каталог с фильтром — так это увидит клиент.
            </div>
            <div className="tagrow">
              {tags.map(t => (
                <Link key={t.label} to={t.to} className="tagchip">{t.label}</Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

      <div className="product-actions" style={{ marginTop: 8 }}>
        <button className="btn btn-gold" onClick={() => navigate('/admin')}>Готово · в CRM</button>
      </div>
    </section>
  )
}
