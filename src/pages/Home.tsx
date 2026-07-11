import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WatchSVG from '../components/WatchSVG'
import WatchVisual from '../components/WatchVisual'
import { useAuth, useTheme } from '../App'
import { effectivePrice, isLowStock, useProducts } from '../store/products'
import EarnBadge from '../components/EarnBadge'
import ServiceBooking from '../components/ServiceBooking'
import { useI18n } from '../i18n/engine'
import { useReveal, useCardTilt } from '../hooks/cardMotion'

const HERO_PHOTO: Record<string, string> = {
  onyx: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=80',
}
const FOUNDER_PHOTO = 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80'

const FEATURED_IDS = [1, 2, 3, 7]
const brandsRow = ['ROLEX', 'AUDEMARS PIGUET', 'PATEK PHILIPPE', 'TISSOT', 'LONGINES', 'FRÉDÉRIQUE CONSTANT', 'ALPINA', 'ORIENT']

function Counter({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [v, setV] = useState(0)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)
  useEffect(() => {
    if (!ref) return
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const run = (t: number) => {
        const k = Math.min((t - t0) / 1800, 1)
        setV(Math.round(end * (1 - Math.pow(1 - k, 3))))
        if (k < 1) requestAnimationFrame(run)
      }
      requestAnimationFrame(run)
    }, { threshold: 0.6 })
    io.observe(ref)
    return () => io.disconnect()
  }, [ref, end])
  return <div className="v" ref={setRef} style={{ fontFamily: 'var(--serif)', fontSize: '3.2rem', color: 'var(--gold2)' }}>{v.toLocaleString('ru-RU')}{suffix}</div>
}

export default function Home() {
  const navigate = useNavigate()
  const { authed } = useAuth()
  const { theme } = useTheme()
  const { t } = useI18n()
  const shopProducts = useProducts()
  const featured = shopProducts.filter(p => FEATURED_IDS.includes(p.id))
  useReveal(featured.length)
  useCardTilt(featured.length)

  const openProduct = (id: number) => navigate(`/product/${id}`)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div>
          <span className="hero-tag hero-in d1">{t('home.heroTag')}</span>
          <h1 className="big hero-in d2">{t('home.heroTitle1')}<br />{t('home.heroTitle2')} <em>{t('home.heroTitleEm')}</em>{t('home.heroTitle3') && <>,<br />{t('home.heroTitle3')}</>}</h1>
          <p className="hero-in d3">{t('home.heroText')}</p>
          <div className="hero-cta hero-in d4">
            <Link to="/catalog" className="btn btn-gold">{t('home.ctaCollection')}</Link>
            <Link to="/gift-sets" className="btn btn-ghost">{t('nav.gifts')}</Link>
          </div>
        </div>
        <div className="hero-watch hero-watch-in">
          {theme === 'noir'
            ? <WatchSVG dial={['#1d2430', '#0b0e14']} accent="#d4af6a" live />
            : <img className="hero-img" src={HERO_PHOTO[theme]} alt="CHASI.UZ" />}
        </div>
      </section>

      {/* BRANDS */}
      <div className="marquee">
        <div className="marquee-track">
          {[...brandsRow, ...brandsRow].map((b, i) => <span key={i}>{b} <b>·</b></span>)}
        </div>
      </div>

      {/* FEATURED */}
      <section>
        <div className="sec-head reveal">
          <div><span className="sec-label">{t('home.featuredLabel')}</span><h2>{t('home.featuredTitle')}</h2></div>
          <Link to="/catalog" className="btn btn-ghost btn-sm">{t('home.allCatalog')}</Link>
        </div>
        <div className="grid4">
          {featured.map((p, i) => (
            <div key={p.id} className="card tilt-card reveal" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => openProduct(p.id)}>
              <div className="card-corner left">
                <span className={`cbadge ${p.category === 'original' ? 'orig' : 'copy'}`}>{t(`enum.catShort.${p.category}`)}</span>
                {p.discount > 0 && <span className="cbadge gold">−{p.discount}%</span>}
              </div>
              <div className="card-corner right">
                {!p.inStock
                  ? <span className="cbadge stock-order">{t('enum.stockOrder')}</span>
                  : isLowStock(p)
                    ? <span className="cbadge stock-low">{t('enum.stockLeft', { n: p.stock })}</span>
                    : <span className="cbadge stock-ok">{t('enum.stockIn')}</span>}
              </div>
              <div className="w"><WatchVisual product={p} /></div>
              <h3>{p.name}</h3>
              <div className="cat">{t(`enum.style.${p.style}`)}</div>
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

      {/* STATS */}
      <section>
        <div className="grid3" style={{ textAlign: 'center' }}>
          <div className="reveal" style={{ padding: '46px 20px', border: '1px solid var(--line)' }}>
            <Counter end={50000} suffix="+" />
            <div className="muted" style={{ fontSize: '.74rem', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 10 }}>{t('home.statClients')}</div>
          </div>
          <div className="reveal" style={{ padding: '46px 20px', border: '1px solid var(--line)', transitionDelay: '.12s' }}>
            <Counter end={10} />
            <div className="muted" style={{ fontSize: '.74rem', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 10 }}>{t('home.statYears')}</div>
          </div>
          <div className="reveal" style={{ padding: '46px 20px', border: '1px solid var(--line)', transitionDelay: '.24s' }}>
            <Counter end={24} />
            <div className="muted" style={{ fontSize: '.74rem', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 10 }}>{t('home.statWarranty')}</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section>
        <div className="sec-head reveal">
          <div><span className="sec-label">{t('home.whyLabel')}</span><h2>{t('home.whyTitle')}</h2></div>
        </div>
        <div className="svc svc-3">
          <div className="svc-item reveal"><span className="ico">✦</span><h3>{t('home.svc1t')}</h3><p>{t('home.svc1d')}</p></div>
          <div className="svc-item reveal" style={{ transitionDelay: '.1s' }}><span className="ico">✦</span><h3>{t('home.svc2t')}</h3><p>{t('home.svc2d')}</p></div>
          <div className="svc-item reveal" style={{ transitionDelay: '.2s' }}><span className="ico">✦</span><h3>{t('home.svc4t')}</h3><p>{t('home.svc4d')}</p></div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ background: 'var(--bg2)', borderBlock: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 60, alignItems: 'center' }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
          {theme === 'noir'
            ? <WatchSVG dial={['#241d10', '#0e0b06']} accent="#f0d9a8" live className="" />
            : <img className="founder-img" src={FOUNDER_PHOTO} alt="CHASI.UZ" />}
        </div>
        <div className="reveal" style={{ transitionDelay: '.15s' }}>
          <span className="sec-label">{t('home.founderLabel')}</span>
          <blockquote style={{ fontFamily: 'var(--serif)', fontSize: '1.55rem', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--gold2)', marginBottom: 24 }}>
            {t('home.founderQuote')}
          </blockquote>
          <p className="muted" style={{ lineHeight: 1.85, fontWeight: 300, marginBottom: 14 }}>
            {t('home.founderText')}
          </p>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--gold)', letterSpacing: '.1em', marginTop: 8 }}>{t('home.founderName')}</div>
        </div>
      </section>

      {/* ЗАПИСЬ НА ТО */}
      <section className="reveal">
        <ServiceBooking />
      </section>
    </>
  )
}
