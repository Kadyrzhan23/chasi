# CHASI.UZ — Full Design Specification

Luxury wristwatch boutique (Tashkent). Dark premium aesthetic. React SPA — storefront + customer account + CRM. Two switchable design themes with identical functionality and data.

---

## 1. Overall Concept

- **Mood:** expensive, restrained, "dark luxury." Lots of whitespace, thin lines, gold/accent on black.
- **UI language:** Russian (copy), but the design system is language-agnostic.
- **Two themes**, toggled by a button in the header (1 / 2):
  - **V1 · Noir** — black-and-gold classic, serif typography, SVG watch graphics, sharp corners (radius 0).
  - **V2 · Onyx** — pure black + silver and crimson, grotesque type, product photos, rounded corners (radius 22px, pill-shaped buttons).
- Key storefront mechanic: **prices are hidden (blurred) for guests**, revealed after login. Cart and purchasing are for authenticated users only.

---

## 2. Color Tokens (CSS variables)

### V1 · Noir (default theme)

| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#0a0a0d` | main background |
| `--bg2` | `#101016` | secondary background (sections, footer) |
| `--panel` | `#14141c` | cards, panels |
| `--panel2` | `#191922` | second-level panel |
| `--line` | `rgba(212,175,106,.18)` | gold dividers |
| `--line2` | `rgba(234,231,224,.1)` | neutral dividers |
| `--gold` | `#d4af6a` | primary accent (gold) |
| `--gold2` | `#f0d9a8` | light gold (headings, prices) |
| `--gold3` | `#b8934f` | dark gold (gradients) |
| `--ongold` | `#0a0a0d` | text on gold |
| `--text` | `#eae7e0` | primary text |
| `--muted` | `#8d8b96` | muted text |
| `--green` | `#7fc97f` | status "original / in stock" |
| `--red` | `#e07a7a` | status "backorder / low / delete" |
| `--blue` | `#6ab3d4` | status "replica / info" |
| `--soft` | `rgba(234,231,224,.22)` | ghost-button border |
| `--wash` | `rgba(234,231,224,.07)` | light fill |
| `--shadow` | `0 30px 60px rgba(0,0,0,.5)` | hover shadow |
| `--rad` | `0px` | block radius |
| `--btnrad` | `0px` | button radius |
| `--imgrad` | `10px` | image radius |

### V2 · Onyx

| Token | Value |
|---|---|
| `--bg` | `#000000` |
| `--bg2` | `#0a0a0c` |
| `--panel` | `#101014` |
| `--panel2` | `#141419` |
| `--line` | `rgba(229,72,77,.35)` |
| `--line2` | `rgba(255,255,255,.1)` |
| `--gold` (accent) | `#e5484d` (crimson) |
| `--gold2` | `#ececf2` (silver/light) |
| `--gold3` | `#9c2b30` |
| `--ongold` | `#ffffff` |
| `--text` | `#d9d9e0` |
| `--muted` | `#77777f` |
| `--green` | `#5ad18e` |
| `--red` | `#ff7a7f` |
| `--blue` | `#6ab8e8` |
| `--soft` | `rgba(255,255,255,.28)` |
| `--wash` | `rgba(255,255,255,.06)` |
| `--shadow` | `0 30px 70px rgba(229,72,77,.14)` |
| `--rad` | `22px` |
| `--btnrad` | `999px` (pills) |
| `--imgrad` | `22px` |

In Onyx, h2 headings are UPPERCASE, weight 700; the logo has wide tracking; accent elements are crimson instead of gold.

---

## 3. Typography

Fonts loaded from Google Fonts:

- **V1 Noir:** serif `Cormorant Garamond` (headings, prices, large numerals) + grotesque `Manrope` (body, UI).
- **V2 Onyx:** `Syne` (headings) + `Space Grotesk` (body).
- Also loaded: `Prata`, `Jost` (fallback/reserve).

| Element | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| H1 `.big` | serif | `clamp(2.8rem, 5.6vw, 5.2rem)` | 500, `em` = italic/accent color | — |
| H2 | serif | `clamp(1.9rem, 3.4vw, 3rem)` | 500 | — |
| H3 | serif | ~1.22rem | 500 | — |
| `.sec-label` (eyebrow) | sans | `.72rem` | UPPERCASE, color `--gold` | `.32em` |
| Body | sans | ~.85–.9rem | 300 (thin) | — |
| Buttons | sans | `.78rem` | UPPERCASE, 600 | `.16em` |
| Table head | sans | `.66rem` | UPPERCASE, `--gold` | `.2em` |
| KPI number | serif | `2.2rem`, color `--gold2` | — | — |

Base text rules: thin weight (300) for paragraphs, `line-height` ~1.7–1.8, generous UPPERCASE labels with wide tracking as the premium accent.

---

## 4. Grid, Spacing, Responsive

- **Page horizontal padding:** `4vw`.
- **Header:** fixed to top, ~76px tall, `backdrop-filter: blur(14px)`, semi-transparent `--hdrbg` background, bottom border `--line`.
- **Main grid layouts:**
  - `.grid4` — 4 columns (featured on home), gap 24px.
  - `.grid3` — 3 columns (catalog, gift sets), gap 24px.
  - Catalog: `290px | 1fr` (filter sidebar + grid).
  - Product: `1fr | 1.05fr` (sticky media + info).
  - Cart: `1.5fr | 1fr` (items + sticky summary).
  - CRM: `240px | 1fr` (tab sidebar + content).
- **Breakpoints:**
  - `≤1000px` — nav collapses into a burger menu; all two-column layouts → single column; grid4/grid3 → 2 columns; CRM sidebar → horizontal tabs.
  - `≤760px` — passport/spec grids in 1–2 columns.
  - `≤560px` — everything single column; reduced heading/table sizes.

---

## 5. Components

### Header
Logo `CHASI.UZ` (serif, tracking `.3em`, `.UZ` muted) on the left · nav in the center (Home / Catalog / Gift Sets / Account / CRM · demo) · on the right: theme switcher (two round pill buttons 1/2), cart icon with counter, "Log in" button. Active nav item is underlined in gold.

### Buttons
- `.btn-gold` — gold gradient `135deg, --gold → --gold3`, text `--ongold`, on hover lifts `-2px` + soft gold glow.
- `.btn-ghost` — transparent, `--soft` border, gold border on hover.
- `.btn-sm` — smaller variant.
- Padding 15×34px, UPPERCASE, tracking `.16em`, radius `--btnrad` (0 in Noir / pill in Onyx).

### Product Card `.card`
Background `--panel`, transparent border, padding `30×24×26`. On hover: lift `-8px`, gold border, `--shadow`, a "sheen" sweeps across the card (skew gradient), the watch icon scales up and rotates slightly. Contents: watch visual → name (serif) → brand·diameter → price (blurred if not logged in) → "Open card →".

**Corner badges** (`.card-corner` left/right, stacked):
- Top-left: product type — `Original` (green) / `1:1 clone` (blue), plus gold discount badge `−N%`.
- Top-right: availability — `in stock` (green) / `backorder` (red) / `N left` (red, if ≤3).

### Chips `.chip`
Pill with `--line2` border, gold border on hover; active (`.on`) — gold fill, `--ongold` text. Used in filters, discount/status/payment selection.

### Tags / Status Pills
- `.tag.orig` (green) / `.tag.copy` (blue) — product class.
- `.pill.g/r/b/y` — colored capsules (green/red/blue/gold) for statuses in tables and cards.

### Tables `.tbl`
Head: small UPPERCASE gold text, bottom gold line. Rows: thin weight, `--line2` dividers, subtle gold row highlight on hover.

### KPI Cards `.kpi`
`--line` border, faint gold gradient fill from the top. Large serif numeral `--gold2` + small UPPERCASE label + delta (green/red).

### Panel `.panel` and Bar Charts
`--line2` border, `--panel` background, padding 26px. Horizontal bars: `--wash` track, gold-gradient fill with animated width (1.2s ease-out) and value on the right.

### Toast Notifications `.toast`
Slides up from bottom-right, up to 380px wide (cubic-bezier). Two styles:
- Telegram style (dark blue `#17212b`, blue header) — mimics a bot message.
- `.gold` — branded (`--panel` bg, gold header).
Structure: channel header (icon + label) + title + body text.

### Forms
Inputs `.search-inp` / `.select`: `--bg` background, `--line2` border, gold border on focus. Payment radios `.pay-opt` — row-cards, active one with gold border and light fill. Quantity stepper `.stepper` — −/N/+ buttons with a squared-round border.

### Product Page
Left — sticky media block (radial gold glow, watch visual, status/discount/stock tags). Right — brand eyebrow, large serif title, table of 8–11 specs, price block (struck-through old + new + "you save N" when discounted), urgency banner `🔥 N left / Last one`, action buttons, delivery note.

### Cart
Left — item rows (mini visual, name, quantity stepper, discounted price), gift-box option (checkbox), selected gift set. Right sticky — contact/delivery, payment choice (Payme / Click / cash on delivery), totals summary and "Place order" button. Success screen with order number.

### CRM (Admin)
Left tab sidebar (Dashboard, Products·stock, Web orders, New order, Sales, Interests, Demand, Trade-in, Service due, Clients). Active tab — gold left bar + highlight. Content: KPIs, panels with bars, tables, order cards, product management panel (rows with status/stock/discount controls).

---

## 6. Effects & Animations

- **Scroll reveal:** sections appear bottom-up (opacity + translateY 40px, 0.9s cubic-bezier).
- **Floating watch (hero):** vertical bob `floatY` 7s + slight tilt, drop-shadow.
- **Brand marquee:** infinite horizontal scroll 28s.
- **Number counters:** animated count-up when entering the viewport (cubic ease-out ~1.8s).
- **Card sheen** on hover; **bars** fill with animated width; **toasts** slide in from the bottom.
- Project-wide easing: `cubic-bezier(.16,1,.3,1)`.

---

## 7. Iconography & Graphics

- Text logo: `CHASI` + `.UZ` (muted).
- Watches drawn as **inline SVG** (WatchSVG component) — two-color `dial` + `accent`, optional "live" second hand. In the Onyx theme, photos (Unsplash) replace the SVG, falling back to SVG on load error.
- Cart icon — thin SVG bag (stroke = currentColor, inherits gold/silver), with a counter badge.
- Decorative "spark" symbols: `✦`, `✈` (in toasts), `🔥` (urgency), `🔒` (hidden price).

---

## 8. Screens (routes)

| Route | Screen |
|---|---|
| `/` | Home: hero, brand marquee, featured, waitlist, stat counters, services, founder block |
| `/catalog` | Catalog: filter sidebar + card grid |
| `/product/:id` | Individual watch card |
| `/gift-sets` | Gift sets |
| `/cart` | Cart + checkout (auth gate) |
| `/account` | Customer account: purchases, digital passports, wishlist, notifications |
| `/admin` | CRM: dashboard, products, orders, sales, clients, etc. |
| `/passport/:serial` | Digital watch passport (via QR) |

---

## 9. Style Formula (brief for another service)

> Dark luxury watch shop. Near-black background (`#0a0a0d`), accent — gold (`#d4af6a` / light `#f0d9a8`). Serif headings Cormorant Garamond + thin grotesque Manrope. Lots of whitespace, thin semi-transparent gold lines, UPPERCASE labels with wide tracking. Cards on dark panels with a gold border and a "sheen" on hover. Prices hidden with blur until login. Statuses — colored capsules (green "in stock/original", red "backorder/low", blue "replica"). Smooth scroll reveals, easing `cubic-bezier(.16,1,.3,1)`. Alternate theme — pure black with crimson accent (`#e5484d`), Syne/Space Grotesk grotesque type, rounded corners and pill-shaped buttons.
