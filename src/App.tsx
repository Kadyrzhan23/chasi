import { createContext, useContext, useEffect, useState } from 'react'
import { HashRouter, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import Product from './pages/Product'
import GiftSets from './pages/GiftSets'
import Cart from './pages/Cart'
import Account from './pages/Account'
import Admin from './pages/Admin'
import ProductEdit from './pages/ProductEdit'
import Loyalty from './pages/Loyalty'
import WishlistPage from './pages/Wishlist'
import Passport from './pages/Passport'
import { CartProvider, useCart } from './store/cart'
import { WishlistProvider, useWishlist } from './store/wishlist'
import { I18nProvider, LANGS, useI18n } from './i18n/engine'
import { initTelegram, isTelegram } from './telegram'
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

/* ---------- сброс скролла наверх при смене страницы ---------- */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

/* ---------- глобальная полоса «демо-версия» (над хедером, на всех страницах) ---------- */
function DemoBar() {
  const { t } = useI18n()
  return (
    <div className="demo-bar" role="note">
      <div className="demo-track">
        {[0, 1, 2, 3, 4, 5].map(i => <span key={i}>⚠ {t('home.demoWarn')} <b>✦</b></span>)}
      </div>
    </div>
  )
}

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
  { to: '/', key: 'nav.home', end: true },
  { to: '/catalog', key: 'nav.catalog' },
  { to: '/gift-sets', key: 'nav.gifts' },
  { to: '/account', key: 'nav.account' },
  { to: '/admin', key: 'nav.crm' },
]

function Header() {
  const { authed, toggle } = useAuth()
  const { theme, setTheme } = useTheme()
  const { count } = useCart()
  const { count: wishCount } = useWishlist()
  const { lang, setLang, t } = useI18n()
  const [open, setOpen] = useState(false)
  const cls = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')
  return (
    <>
      <header className="hdr">
        <NavLink to="/" className="logo" onClick={() => setOpen(false)}>CHASI<span>.UZ</span></NavLink>
        <nav className="nav">
          {LINKS.map(l => <NavLink key={l.to} to={l.to} end={l.end} className={cls}>{t(l.key)}</NavLink>)}
        </nav>
        <div className="hdr-right">
          <div className="vswitch lang" title="Язык · Language · Til">
            {LANGS.map(l => (
              <button key={l.id} className={lang === l.id ? 'on' : ''} onClick={() => setLang(l.id)}>
                {l.label}
              </button>
            ))}
          </div>
          <div className="vswitch" title="Переключить дизайн-версию">
            {THEMES.map(t => (
              <button key={t.id} className={theme === t.id ? 'on' : ''} title={t.label} onClick={() => setTheme(t.id)}>
                {t.n}
              </button>
            ))}
          </div>
          <NavLink to="/wishlist" className="cart-link" title={t('wish.label')} onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 20.5s-7.5-4.7-9.7-9.2C.9 8.5 2.2 5.4 5.2 5c1.9-.2 3.5.9 4.3 2.3L12 10l2.5-2.7C15.3 5.9 16.9 4.8 18.8 5c3 .4 4.3 3.5 2.9 6.3-2.2 4.5-9.7 9.2-9.7 9.2Z" />
            </svg>
            {wishCount > 0 && <span className="cart-count">{wishCount}</span>}
          </NavLink>
          <NavLink to="/cart" className="cart-link" title="Корзина" onClick={() => setOpen(false)}>
            <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4.5 7.5h15l-1.1 11.2a1.6 1.6 0 0 1-1.6 1.45H7.2a1.6 1.6 0 0 1-1.6-1.45L4.5 7.5Z" />
              <path d="M8.6 7.5V6.4a3.4 3.4 0 0 1 6.8 0v1.1" />
              <path d="M9.4 11v1.1a2.6 2.6 0 0 0 5.2 0V11" opacity="0.75" />
            </svg>
            {count > 0 && <span className="cart-count">{count}</span>}
          </NavLink>
          <button className={`auth-btn ${authed ? 'on' : ''}`} onClick={toggle}>
            {authed ? 'Азиз ✦' : t('common.login')}
          </button>
          <button className="burger" aria-label="Меню" onClick={() => setOpen(o => !o)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </header>
      <nav className={`mmenu ${open ? 'open' : ''}`}>
        {LINKS.map(l => (
          <NavLink key={l.to} to={l.to} end={l.end} className={cls} onClick={() => setOpen(false)}>
            {t(l.key)}
          </NavLink>
        ))}
        <div className="mmenu-lang">
          {LANGS.map(l => (
            <button key={l.id} className={lang === l.id ? 'on' : ''} onClick={() => { setLang(l.id); setOpen(false) }}>
              {l.label}
            </button>
          ))}
        </div>
      </nav>
    </>
  )
}

function Footer() {
  const { t } = useI18n()
  return (
    <footer>
      <div className="foot-grid">
        <div>
          <span className="logo">CHASI<span>.UZ</span></span>
          <p className="muted" style={{ fontSize: '.85rem', lineHeight: 1.8, marginTop: 18, fontWeight: 300 }}>
            {t('footer.blurb')}
          </p>
        </div>
        <div>
          <h4>{t('footer.shop')}</h4>
          <div className="fi">{t('footer.addr1')}</div>
          <div className="fi">{t('footer.addr2')}</div>
          <div className="fi">{t('footer.hours')}</div>
          <a href="tel:+998909030004">+998 90 903 00 04</a>
          <NavLink to="/loyalty">{t('footer.loyalty')}</NavLink>
        </div>
        <div>
          <h4>{t('footer.contact')}</h4>
          <a href="https://t.me/chasiuz" target="_blank" rel="noreferrer">Telegram</a>
          <a href="https://www.instagram.com/chasi.uz3/" target="_blank" rel="noreferrer">Instagram</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>{t('footer.copyright')}</span>
        <span>{t('footer.payments')}</span>
      </div>
    </footer>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(false)

  // Telegram Mini App: инициализация + автологин, если открыто внутри Telegram
  useEffect(() => {
    initTelegram()
    if (isTelegram()) setAuthed(true)
  }, [])

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
      <I18nProvider>
      <HashRouter>
        <CartProvider>
        <WishlistProvider>
        <ScrollToTop />
        <div className={authed ? 'authed' : ''} data-theme={theme}>
          <DemoBar />
          <Header />
          <div className="page">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/product/:id" element={<Product />} />
              <Route path="/gift-sets" element={<GiftSets />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/product/:id" element={<ProductEdit />} />
              <Route path="/passport/:serial" element={<Passport />} />
            </Routes>
            <Footer />
          </div>
          <ToastHost />
        </div>
        </WishlistProvider>
        </CartProvider>
      </HashRouter>
      </I18nProvider>
      </ThemeCtx.Provider>
    </AuthCtx.Provider>
  )
}
