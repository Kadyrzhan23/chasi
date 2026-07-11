import { Lang } from './engine'

/* Переводы контент-данных: подарочные наборы и подарочный бокс.
   Ключ — id набора из mock. Фолбэк — русские значения из mock. */

export type GiftSetText = { name: string; tagline: string; items: string[] }

const RU: Record<number, GiftSetText> = {
  101: { name: 'Набор «Джентльмен»', tagline: 'Классика для делового подарка', items: ['Подарочный бокс с ложементом', 'Кожаный чехол для часов', 'Салфетка из микрофибры', 'Открытка с пожеланием'] },
  102: { name: 'Набор «Дайвер»', tagline: 'Для активных и спортивных', items: ['Влагозащищённый бокс', 'Запасной каучуковый ремешок', 'Инструмент для смены ремешка', 'Фирменная наклейка'] },
  103: { name: 'Набор «Престиж»', tagline: 'Максимально презентабельно', items: ['Премиальный бокс из эко-кожи', 'Шкатулка-подставка для часов', 'Средство для чистки', 'Сертификат подлинности в рамке', 'Открытка + лента'] },
  104: { name: 'Набор «Она»', tagline: 'Нежный подарок для неё', items: ['Подарочный бокс пастельных тонов', 'Мини-шкатулка для украшений', 'Открытка с пожеланием', 'Фирменная лента'] },
}

const EN: Record<number, GiftSetText> = {
  101: { name: 'The Gentleman Set', tagline: 'A classic business gift', items: ['Gift box with insert', 'Leather watch pouch', 'Microfibre cloth', 'Greeting card'] },
  102: { name: 'The Diver Set', tagline: 'For the active and sporty', items: ['Water-resistant box', 'Spare rubber strap', 'Strap-change tool', 'Branded sticker'] },
  103: { name: 'The Prestige Set', tagline: 'As presentable as it gets', items: ['Premium eco-leather box', 'Watch stand case', 'Cleaning solution', 'Framed certificate of authenticity', 'Card + ribbon'] },
  104: { name: 'The Her Set', tagline: 'A tender gift for her', items: ['Pastel-tone gift box', 'Mini jewellery case', 'Greeting card', 'Branded ribbon'] },
}

const UZ: Record<number, GiftSetText> = {
  101: { name: '«Janob» toʻplami', tagline: 'Ishbilarmon sovgʻa uchun klassika', items: ['Ichki tutqichli sovgʻa qutisi', 'Charm soat gʻilofi', 'Mikrofibra salfetka', 'Tabrik otkritkasi'] },
  102: { name: '«Dayver» toʻplami', tagline: 'Faol va sport uslub uchun', items: ['Namdan himoyalangan quti', 'Zaxira kauchuk tasma', 'Tasma almashtirish asbobi', 'Firma stikeri'] },
  103: { name: '«Prestij» toʻplami', tagline: 'Imkon qadar koʻrkam', items: ['Eko-charm premium quti', 'Soat qoʻyish shkatulkasi', 'Tozalash vositasi', 'Ramkadagi haqiqiylik sertifikati', 'Otkritka + lenta'] },
  104: { name: '«Ayol» toʻplami', tagline: 'U uchun nozik sovgʻa', items: ['Pastel rangdagi sovgʻa qutisi', 'Mini taqinchoq shkatulkasi', 'Tabrik otkritkasi', 'Firma lentasi'] },
}

const TABLE: Record<Lang, Record<number, GiftSetText>> = { ru: RU, en: EN, uz: UZ }

export function giftSetText(lang: Lang, id: number, fallback: GiftSetText): GiftSetText {
  return TABLE[lang]?.[id] ?? fallback
}

/* Подарочный бокс (доп. услуга) */
export const GIFT_BOX_TR: Record<Lang, { title: string; desc: string }> = {
  ru: {
    title: 'Подарочный бокс CHASI.UZ',
    desc: 'Премиальная коробка с ложементом, фирменная лента, открытка с рукописным пожеланием и пакет для переноски. Часы будут выглядеть презентабельно как подарок.',
  },
  en: {
    title: 'CHASI.UZ Gift Box',
    desc: 'A premium box with insert, branded ribbon, a card with a handwritten wish and a carry bag. The watch will look presentable as a gift.',
  },
  uz: {
    title: 'CHASI.UZ sovgʻa qutisi',
    desc: 'Ichki tutqichli premium quti, firma lentasi, qoʻlda yozilgan tilakli otkritka va olib yurish paketi. Soat sovgʻa sifatida koʻrkam koʻrinadi.',
  },
}
