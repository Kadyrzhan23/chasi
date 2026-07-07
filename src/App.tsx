import { createContext, useContext, useEffect, useState } from 'react'
import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import GiftSets from './pages/GiftSets'
import Cart from './pages/Cart'
import Account from './pages/Account'
import Admin from './pages/Admin'
import Passport from './pages/Passport'
import { CartProvider, useCart } from './store/cart'
import { onToast, toast, ToastMsg } from './toast'

/* ---------- auth (демо) ---------- */
const AuthCtx = createContext<{ authed: boolean; toggle: () => void }>({ authed: false, toggle: () => {} })
export const useAuth = () => useContext(AuthCtx)

/* ---------- дизайн-версии ---------- */
export type Theme = 'noir' | 'onyx'
export const THEMES: { id: Theme; n: string; label: string }[] = [
  { id: 'noir', n: '1', label: 'V1 · Noir — чёрное золото, классическая типографика, графика' },
  { id: 'onyx', n: '2', label: 'V2 · Onyx — чистый чёрный, серебро и алый, гротеск, фото' },
]
const ThemeCtx = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({ theme: 'noir', setTheme: () => {} })
export const useTheme = () => useContext(ThemeCtx)

/* ---------- toast host ---------- */
function ToastHost() {
  const [msg, setMsg] = useState<ToastMsg | null>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    onToast(t => {
      setMsg(t)
      setShow(true)
      clearTimeout(timer)
      timer = setTimeout(() => setShow(false), 5600)
    })
  }, [])
  if (!msg) return null
  const tg = msg.kind !== 'gold'
  return (
    <div className={`toast ${tg ? '' : 'gold'} ${show ? 'show' : ''}`}>
      <div className="t-head">
        {tg ? '✈' : '✦'} {msg.channel ?? (tg ? 'Telegram · CHASI.UZ Bot' : 'CHASI.UZ')}
      </div>
      <div className="t-body">
        <div className="t-title">{msg.title}</div>
        <div className="t-text">{msg.text}</div>
      </div>
    </div>
  )
}

const LINKS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/catalog', label: 'Каталог' },
  { to: '/gift-sets', label: 'Наборы' },
  { to: '/account', label: 'Кабинет' },
  { to: '/admin', label: 'CRM · демо' },
]

function Header() {
  const { authed, toggle } = useAuth()
  const { theme, setTheme } = useTheme()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')
  return (
    <>
      <header className="hdr">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>CHASI<span>.UZ</span></NavLink>
        <nav className="nav">
          {LINKS.map(l => <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{l.label}</NavLink>)}
        </nav>
        <div className="hdr-right">
          <div className="vswitch" title="Переключить дизайн-версию">
            {THEMES.map(t => (
              <button key={t.id} className={theme === t.id ? 'on' : ''} title={t.label} onClick={() => setTheme(t.id)}>
                {t.n}
              </button>
            ))}
          </div>
          <NavLink to="/cart" className="cart-link" title="Корзина" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 7.5h15l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.45H7.2a1.6 1.6 0 0 1-1.6-1.45L4.5 7.5Z" />
              <path d="M8.6 7.5V6.4a3.4 3.4 0 0 1 6.8 0v1.1" />
              <path d="M9.4 11v1.1a2.6 2.6 0 0 0 5.2 0V11" opacity="0.75" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </NavLink>
          <button className={`auth-btn ${authed ? 'on' : ''}`} onClick={toggle}>
            {authed ? 'Азиз ✦' : 'Войти'}
          </button>
          <button className="burger" aria-label="Меню" onClick={() => setOpen(o => !o)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>
      <nav className={`mmenu ${open ? 'open' : ''}`}>
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} className={cls} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}

function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <span className="logo">CHASI<span>.UZ</span></span>
          <p className="muted" style={{ fontSize: '.85rem', lineHeight: 1.8, marginTop: 18, fontWeight: 300 }}>
            Бутик часов в центре Ташкента. Оригиналы и качественные реплики мировых брендов.
          </p>
        </div>
        <div>
          <h4>Магазин</h4>
          <div className="fi">Улица Мирабад, дом 12</div>
          <div className="fi">Между Grand Mir Hotel и МВД</div>
          <div className="fi">Пн – Вс, 11:30 – 21:00</div>
          <a href="tel:+998909030004">+998 90 903 00 04</a>
        </div>
        <div>
          <h4>Мы на связи</h4>
          <a href="https://t.me/chasiuz" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://www.instagram.com/chasi.uz3/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 CHASI.UZ · Демонстрационный прототип</span>
        <span>Оплата: Click · Payme · Visa · Mastercard</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(false)
  const [theme, setThemeState] = useState<Theme>(() => {
    const t = localStorage.getItem('chasi-theme') as Theme
    return THEMES.some(x => x.id === t) ? t : 'noir'
  })
  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('chasi-theme', t)
    const info = THEMES.find(x => x.id === t)!
    toast({ kind: 'gold', title: `Дизайн: ${info.label.split(' — ')[0]}`, text: info.label.split(' — ')[1] + '. Функционал и данные во всех версиях одинаковые.' })
  }
  const toggle = () => {
    setAuthed(a => {
      const next = !a
      toast(
        next
          ? { kind: 'gold', title: 'Добро пожаловать, Азиз!', text: 'Цены открыты. Система запоминает, какие модели вас интересуют, и подберёт персональное предложение.' }
          : { kind: 'gold', title: 'Вы вышли', text: 'Цены снова скрыты — они доступны только авторизованным клиентам.' },
      )
      return next
    })
  }
  return (
    <AuthCtx.Provider value={{ authed, toggle }}>
      <ThemeCtx.Provider value={{ theme, setTheme }}>
      <HashRouter>
        <CartProvider>
        <div className={authed ? 'authed' : ''} data-theme={theme}>
          <Header />
          <div className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/gift-sets" element={<GiftSets />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/passport/:serial" element={<Passport />} />
            </Routes>
            <Footer />
          </div>
          <ToastHost />
        </div>
        </CartProvider>
      </HashRouter>
      </ThemeCtx.Provider>
    </AuthCtx.Provider>
  )
}
