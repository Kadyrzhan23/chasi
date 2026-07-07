import { useMemo } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import WatchVisual from '../components/WatchVisual'
import { CATEGORY_LABEL, products, STYLE_LABEL } from '../data/mock'
import { useAuth } from '../App'
import { useCart } from '../store/cart'
import { toast } from '../toast'

const GENDER_LABEL: Record<string, string> = { 'муж': 'Мужские', 'жен': 'Женские', 'унисекс': 'Унисекс' }

export default function Product() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { authed } = useAuth()
  const { add, items } = useCart()

  const product = useMemo(() => products.find(p => p.id === Number(id)), [id])
  const inCart = product ? items.find(i => i.productId === product.id)?.qty ?? 0 : 0

  if (!product) {
    return (
      <section style={{ padding: '120px 4vw', textAlign: 'center' }}>
        <span className="sec-label">Ошибка</span>
        <h1 className="big" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>Модель не найдена</h1>
        <p className="muted" style={{ margin: '18px 0 28px' }}>Возможно, товар снят с продажи.</p>
        <Link className="btn btn-gold" to="/catalog">В каталог</Link>
      </section>
    )
  }

  const p = product

  // 6–8 ключевых характеристик
  const specs: [string, string][] = [
    ['Бренд', p.brand],
    ['Модель', p.name],
    ['Класс товара', CATEGORY_LABEL[p.category]],
    ['Механизм', p.movement],
    ['Запас хода', p.reserve > 0 ? `до ${p.reserve} ч` : 'кварц — от батареи'],
    ['Водонепроницаемость', `${p.water} м${p.water >= 200 ? ' · можно плавать и нырять' : p.water >= 100 ? ' · брызги, душ, плавание' : ' · брызги и дождь'}`],
    ['Стекло', p.glass === 'сапфировое' ? 'сапфировое (не царапается)' : 'минеральное'],
    ['Диаметр корпуса', `${p.diameter} мм`],
    ['Стиль', STYLE_LABEL[p.style]],
    ['Для кого', GENDER_LABEL[p.gender] ?? p.gender],
    ['Гарантия', '2 года на механизм'],
  ]

  const addToCart = () => {
    if (!authed) {
      toast({ kind: 'gold', title: 'Нужна авторизация ✦', text: 'Корзина и цены доступны только клиентам. Нажмите «Войти» вверху справа — и добавляйте часы в корзину.' })
      return
    }
    if (!p.inStock) {
      toast({ title: 'Вы в листе ожидания ✦', text: `«${p.name}» — сообщим в Telegram в день поступления. Внесите депозит, чтобы зафиксировать цену и приоритет.` })
      return
    }
    add(p.id)
    toast({ kind: 'gold', title: 'Добавлено в корзину', text: `${p.name} — теперь в корзине. Оформите заказ с доставкой и, при желании, подарочным боксом.` })
  }

  return (
    <>
      <section style={{ padding: '40px 4vw 0' }}>
        <div className="crumbs">
          <Link to="/catalog">Каталог</Link> <span>/</span> <span>{p.brand}</span> <span>/</span> <b>{p.name}</b>
        </div>
      </section>

      <div className="product">
        <div className="product-media">
          <WatchVisual product={p} live />
          <div className="product-tags">
            <span className={`tag ${p.category === 'original' ? 'orig' : 'copy'}`}>{CATEGORY_LABEL[p.category]}</span>
            {p.inStock ? <span className="pill g">в наличии</span> : <span className="pill r">под заказ</span>}
          </div>
        </div>

        <div className="product-info">
          <span className="sec-label">{p.brand}</span>
          <h1 className="big" style={{ fontSize: 'clamp(2rem,3.6vw,3.2rem)', marginBottom: 6 }}>{p.name}</h1>
          <div className="muted" style={{ fontSize: '.82rem', letterSpacing: '.06em', marginBottom: 24 }}>
            {STYLE_LABEL[p.style]} · ⌀{p.diameter} мм · {GENDER_LABEL[p.gender] ?? p.gender}
          </div>

          <h4 className="spec-h">Характеристики</h4>
          <table className="spec-table">
            <tbody>
              {specs.map(([k, v]) => (
                <tr key={k}><td>{k}</td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>

          <div className={`price ${authed ? '' : 'locked'}`} style={{ fontSize: '2rem', marginTop: 10 }}>
            {p.price.toLocaleString('ru-RU')} $
          </div>
          <div className="lock-note" style={{ marginBottom: 22 }}>🔒 Войдите, чтобы увидеть цену</div>

          <div className="product-actions">
            <button className="btn btn-gold" onClick={addToCart}>
              {!authed ? 'Войдите, чтобы купить' : p.inStock ? (inCart ? `В корзине: ${inCart} · добавить ещё` : 'В корзину') : 'Встать в очередь'}
            </button>
            {authed && inCart > 0 && (
              <button className="btn btn-ghost" onClick={() => navigate('/cart')}>Перейти в корзину →</button>
            )}
          </div>

          <div className="product-note muted">
            Доставка по Ташкенту и всему Узбекистану. Оплата: Payme, Click или при получении.
            Можно добавить подарочный бокс и <Link to="/gift-sets" style={{ color: 'var(--gold2)' }}>подарочный набор</Link>.
          </div>
        </div>
      </div>
    </>
  )
}
