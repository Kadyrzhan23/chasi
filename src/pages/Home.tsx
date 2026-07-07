import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import WatchSVG from '../components/WatchSVG'
import WatchVisual from '../components/WatchVisual'
import { products } from '../data/mock'
import { toast } from '../toast'
import { useAuth, useTheme } from '../App'

const HERO_PHOTO: Record<string, string> = {
  onyx: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1000&q=80',
}
const FOUNDER_PHOTO = 'https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=900&q=80'

const featured = products.filter(p => [1, 2, 3, 7].includes(p.id))
const brandsRow = ['ROLEX', 'AUDEMARS PIGUET', 'PATEK PHILIPPE', 'TISSOT', 'LONGINES', 'FRÉDÉRIQUE CONSTANT', 'ALPINA', 'ORIENT']

/* плавное появление секций */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.15 },
    )
    document.querySelectorAll('.reveal').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

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
  useReveal()
  const navigate = useNavigate()
  const { authed } = useAuth()
  const { theme } = useTheme()
  const [wl, setWl] = useState(37)
  const [wlInput, setWlInput] = useState('')

  const openProduct = (id: number) => navigate(`/product/${id}`)

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div>
          <span className="hero-tag">Бутик часов · Ташкент</span>
          <h1 className="big">Время —<br />это <em>искусство</em>,<br />которое вы носите</h1>
          <p>Оригинальные швейцарские часы и реплики высшего класса: Rolex, Audemars Piguet, Patek Philippe, Tissot, Longines. Более 50 000 клиентов за 10 лет.</p>
          <div className="hero-cta">
            <Link to="/catalog" className="btn btn-gold">Смотреть коллекцию</Link>
            <a href="#waitlist" className="btn btn-ghost">Лист ожидания</a>
          </div>
        </div>
        <div className="hero-watch">
          {theme === 'noir'
            ? <WatchSVG dial={['#1d2430', '#0b0e14']} accent="#d4af6a" live />
            : <img className="hero-img" src={HERO_PHOTO[theme]} alt="Часы CHASI.UZ" />}
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
          <div><span className="sec-label">Избранное</span><h2>Коллекция сезона</h2></div>
          <Link to="/catalog" className="btn btn-ghost btn-sm">Весь каталог →</Link>
        </div>
        <div className="grid4">
          {featured.map((p, i) => (
            <div key={p.id} className="card reveal" style={{ transitionDelay: `${i * 0.1}s` }} onClick={() => openProduct(p.id)}>
              {!p.inStock && <div className="badge red">под заказ</div>}
              <div className="w"><WatchVisual product={p} /></div>
              <h3>{p.name}</h3>
              <div className="cat">{p.style === 'diver' ? 'Дайверские' : p.style === 'dress' ? 'Классика' : 'Спорт'} · Оригинал</div>
              <div className={`price ${authed ? '' : 'locked'}`}>{p.price.toLocaleString('ru-RU')} $</div>
              <div className="lock-note">🔒 Войдите, чтобы увидеть цену</div>
              <div className="card-cta muted">Открыть карточку →</div>
            </div>
          ))}
        </div>
      </section>

      {/* WAITLIST */}
      <section className="waitband" id="waitlist">
        <div className="reveal">
          <span className="sec-label">Предзаказ</span>
          <h2>Нужной модели нет в наличии?</h2>
          <p>Встаньте в лист ожидания — мы привезём модель под вас и сообщим в Telegram в день поступления. Клиенты с депозитом получают приоритет и фиксацию цены.</p>
          <form className="wl-form" onSubmit={e => {
            e.preventDefault()
            if (!wlInput.trim()) return
            setWl(n => n + 1)
            toast({ title: 'Вы в списке ✦', text: `«${wlInput}» добавлена в лист ожидания. Владелец уже видит ваш запрос в панели спроса CRM.` })
            setWlInput('')
          }}>
            <input value={wlInput} onChange={e => setWlInput(e.target.value)} placeholder="Модель, которую вы ищете (напр. Rolex Submariner)" required />
            <button className="btn btn-gold" type="submit">Встать в очередь</button>
          </form>
          <div style={{ marginTop: 24, fontSize: '.78rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--gold)' }}>
            Сейчас в листе ожидания: <b style={{ fontSize: '1.05rem' }}>{wl}</b> человек
          </div>
        </div>
      </section>

      {/* STATS */}
      <section>
        <div className="grid3" style={{ textAlign: 'center' }}>
          <div className="reveal" style={{ padding: '46px 20px', border: '1px solid var(--line)' }}>
            <Counter end={50000} suffix="+" />
            <div className="muted" style={{ fontSize: '.74rem', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 10 }}>довольных клиентов</div>
          </div>
          <div className="reveal" style={{ padding: '46px 20px', border: '1px solid var(--line)', transitionDelay: '.12s' }}>
            <Counter end={10} />
            <div className="muted" style={{ fontSize: '.74rem', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 10 }}>лет на рынке часов</div>
          </div>
          <div className="reveal" style={{ padding: '46px 20px', border: '1px solid var(--line)', transitionDelay: '.24s' }}>
            <Counter end={24} />
            <div className="muted" style={{ fontSize: '.74rem', letterSpacing: '.25em', textTransform: 'uppercase', marginTop: 10 }}>месяца гарантии на механизм</div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section>
        <div className="sec-head reveal">
          <div><span className="sec-label">Почему мы</span><h2>Больше, чем магазин</h2></div>
        </div>
        <div className="svc">
          <div className="svc-item reveal"><span className="ico">✦</span><h3>Цифровой паспорт часов</h3><p>Каждая покупка получает паспорт: серийный номер, гарантия, история обслуживания — всё в личном кабинете.</p></div>
          <div className="svc-item reveal" style={{ transitionDelay: '.1s' }}><span className="ico">✦</span><h3>Напоминание о ТО</h3><p>Через год после покупки мы сами напомним, что механизму пора на профилактику, и запишем вас на удобное время.</p></div>
          <div className="svc-item reveal" style={{ transitionDelay: '.2s' }}><span className="ico">✦</span><h3>Trade-in</h3><p>Обменяйте свои часы на новую модель с доплатой. Сфотографируйте их в кабинете — оценим за 24 часа.</p></div>
          <div className="svc-item reveal" style={{ transitionDelay: '.3s' }}><span className="ico">✦</span><h3>Программа лояльности</h3><p>Баллы с каждой покупки, уровни Silver / Gold / Platinum и привилегии за рекомендации друзьям.</p></div>
        </div>
      </section>

      {/* FOUNDER */}
      <section style={{ background: 'var(--bg2)', borderBlock: '1px solid var(--line)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 60, alignItems: 'center' }}>
        <div className="reveal" style={{ display: 'flex', justifyContent: 'center' }}>
          {theme === 'noir'
            ? <WatchSVG dial={['#241d10', '#0e0b06']} accent="#f0d9a8" live className="" />
            : <img className="founder-img" src={FOUNDER_PHOTO} alt="Мастерская" />}
        </div>
        <div className="reveal" style={{ transitionDelay: '.15s' }}>
          <span className="sec-label">Основатель</span>
          <blockquote style={{ fontFamily: 'var(--serif)', fontSize: '1.55rem', fontStyle: 'italic', lineHeight: 1.5, color: 'var(--gold2)', marginBottom: 24 }}>
            «Часы — это не механизм. Это искусство, отражающее мастерство, традиции и инновации.»
          </blockquote>
          <p className="muted" style={{ lineHeight: 1.85, fontWeight: 300, marginBottom: 14 }}>
            Меня зовут Сардор. Уже десять лет я занимаюсь часами: путешествую по миру, изучаю новейшие тенденции и привожу своим клиентам лучшие модели.
          </p>
          <div style={{ fontFamily: 'var(--serif)', fontSize: '1.25rem', color: 'var(--gold)', letterSpacing: '.1em', marginTop: 8 }}>— Сардор</div>
        </div>
      </section>
    </>
  )
}
