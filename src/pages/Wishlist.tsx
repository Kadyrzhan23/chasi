import { Link, useNavigate } from 'react-router-dom'
import WatchVisual from '../components/WatchVisual'
import EarnBadge from '../components/EarnBadge'
import { CATEGORY_LABEL } from '../data/mock'
import { useAuth } from '../App'
import { effectivePrice, isLowStock, useProducts } from '../store/products'
import { useWishlist } from '../store/wishlist'
import { useI18n } from '../i18n/engine'

export default function Wishlist() {
  const { authed } = useAuth()
  const navigate = useNavigate()
  const { t } = useI18n()
  const { ids, remove } = useWishlist()
  const shopProducts = useProducts()

  const items = ids
    .map(id => shopProducts.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p)

  if (items.length === 0) {
    return (
      <section style={{ padding: '90px 4vw', textAlign: 'center' }}>
        <span className="sec-label">{t('wish.label')}</span>
        <div style={{ fontSize: '2.6rem', marginBottom: 10 }}>♡</div>
        <h1 className="big" style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}>{t('wish.empty')}</h1>
        <p className="muted" style={{ margin: '18px auto 28px', maxWidth: 440, fontWeight: 300 }}>{t('wish.emptyText')}</p>
        <Link className="btn btn-gold" to="/catalog">{t('wish.toCatalog')}</Link>
      </section>
    )
  }

  return (
    <>
      <section style={{ padding: '50px 4vw 10px' }}>
        <span className="sec-label">{t('wish.label')}</span>
        <h1 className="big" style={{ fontSize: 'clamp(2.4rem,4.5vw,4rem)' }}>{t('wish.title')} <em>{t('wish.titleEm')}</em></h1>
      </section>

      <section style={{ padding: '20px 4vw 70px' }}>
        <div className="grid3">
          {items.map(p => (
            <div key={p.id} className="card" onClick={() => navigate(`/product/${p.id}`)}>
              <div className="card-corner left">
                <span className={`cbadge ${p.category === 'original' ? 'orig' : 'copy'}`}>{CATEGORY_LABEL[p.category]}</span>
                {p.discount > 0 && <span className="cbadge gold">−{p.discount}%</span>}
              </div>
              <div className="card-corner right">
                <button className="wish-remove" title={t('wish.remove')} onClick={e => { e.stopPropagation(); remove(p.id) }}>✕</button>
              </div>
              <div className="w"><WatchVisual product={p} /></div>
              <h3>{p.name}</h3>
              <div className="cat">
                {p.brand} · ⌀{p.diameter}мм
                {!p.inStock ? <span className="pill r" style={{ marginLeft: 8 }}>под заказ</span>
                  : isLowStock(p) ? <span className="pill r" style={{ marginLeft: 8 }}>осталось {p.stock}</span>
                    : <span className="pill g" style={{ marginLeft: 8 }}>в наличии</span>}
              </div>
              <div className={`price ${authed ? '' : 'locked'}`} style={{ marginTop: 12 }}>
                {p.discount > 0
                  ? <><s className="muted" style={{ fontSize: '.85rem', marginRight: 8 }}>{p.price.toLocaleString('ru-RU')} $</s>{effectivePrice(p).toLocaleString('ru-RU')} $</>
                  : <>{p.price.toLocaleString('ru-RU')} $</>}
              </div>
              <div className="lock-note">{t('common.priceLocked')}</div>
              <EarnBadge product={p} />
              <div className="card-cta muted">{t('common.openCard')}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
