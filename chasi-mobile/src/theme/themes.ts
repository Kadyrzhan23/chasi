/* ============ Дизайн-темы CHASI.UZ (noir / onyx) ============
   Перенос CSS-переменных из веба в токены StyleSheet.
   V1 · Noir — чёрное золото, классическая типографика (Cormorant / Manrope).
   V2 · Onyx — чистый чёрный, серебро и алый, гротеск (Syne / Space Grotesk). */

export type ThemeId = 'noir' | 'onyx'

export interface ThemeFonts {
  logo: string
  display: string // крупные заголовки (h1)
  heading: string // h2 / h3
  body: string
  bodyLight: string
  bodyMedium: string
  bodySemibold: string
  bodyBold: string
}

export interface Theme {
  id: ThemeId
  // цвета
  bg: string
  bg2: string
  panel: string
  panel2: string
  line: string
  line2: string
  gold: string
  gold2: string
  gold3: string
  ongold: string
  text: string
  muted: string
  hdrbg: string
  wash: string
  shadowColor: string
  // геометрия
  rad: number
  btnrad: number
  imgrad: number
  // типографика
  uppercaseHeadings: boolean
  fonts: ThemeFonts
}

const noirFonts: ThemeFonts = {
  logo: 'CormorantGaramond_600SemiBold',
  display: 'CormorantGaramond_500Medium',
  heading: 'CormorantGaramond_600SemiBold',
  body: 'Manrope_400Regular',
  bodyLight: 'Manrope_300Light',
  bodyMedium: 'Manrope_500Medium',
  bodySemibold: 'Manrope_600SemiBold',
  bodyBold: 'Manrope_700Bold',
}

const onyxFonts: ThemeFonts = {
  logo: 'Syne_700Bold',
  display: 'Syne_700Bold',
  heading: 'Syne_600SemiBold',
  body: 'SpaceGrotesk_400Regular',
  bodyLight: 'SpaceGrotesk_300Light',
  bodyMedium: 'SpaceGrotesk_500Medium',
  bodySemibold: 'SpaceGrotesk_600SemiBold',
  bodyBold: 'SpaceGrotesk_500Medium',
}

export const NOIR: Theme = {
  id: 'noir',
  bg: '#0a0a0d',
  bg2: '#101016',
  panel: '#14141c',
  panel2: '#191922',
  line: 'rgba(212,175,106,0.18)',
  line2: 'rgba(234,231,224,0.1)',
  gold: '#d4af6a',
  gold2: '#f0d9a8',
  gold3: '#b8934f',
  ongold: '#0a0a0d',
  text: '#eae7e0',
  muted: '#8d8b96',
  hdrbg: 'rgba(10,10,13,0.92)',
  wash: 'rgba(234,231,224,0.07)',
  shadowColor: '#000000',
  rad: 0,
  btnrad: 0,
  imgrad: 10,
  uppercaseHeadings: false,
  fonts: noirFonts,
}

export const ONYX: Theme = {
  id: 'onyx',
  bg: '#000000',
  bg2: '#0a0a0c',
  panel: '#101014',
  panel2: '#141419',
  line: 'rgba(229,72,77,0.35)',
  line2: 'rgba(255,255,255,0.1)',
  gold: '#e5484d',
  gold2: '#ececf2',
  gold3: '#9c2b30',
  ongold: '#ffffff',
  text: '#d9d9e0',
  muted: '#77777f',
  hdrbg: 'rgba(0,0,0,0.92)',
  wash: 'rgba(255,255,255,0.06)',
  shadowColor: '#e5484d',
  rad: 22,
  btnrad: 999,
  imgrad: 22,
  uppercaseHeadings: true,
  fonts: onyxFonts,
}

export const THEMES: { id: ThemeId; n: string; label: string; sub: string }[] = [
  { id: 'noir', n: '1', label: 'V1 · Noir', sub: 'Чёрное золото, классическая типографика' },
  { id: 'onyx', n: '2', label: 'V2 · Onyx', sub: 'Чистый чёрный, серебро и алый, гротеск' },
]

export const THEME_MAP: Record<ThemeId, Theme> = { noir: NOIR, onyx: ONYX }
