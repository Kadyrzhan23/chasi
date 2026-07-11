import { Product } from './mock'

/* ============ Программа лояльности CHASI.UZ ============
   Уровень щедрости — ~3%: 3 балла за $1, курс 100 баллов = $1.
   Баллы НЕ начисляются на товары со скидкой. */

export const POINTS_PER_DOLLAR = 3      // начисление
export const POINTS_PER_USD = 100       // курс траты: 100 баллов = $1
export const FIRST_PURCHASE_BONUS = 500 // разовый бонус за первую покупку
export const POINTS_MATURE_DAYS = 14    // «в ожидании» до списания
export const POINTS_TTL_MONTHS = 24     // срок жизни баллов
export const NEXT_ORDER_CAP_PCT = 10    // потолок оплаты баллами следующего заказа

/** Баллы за покупку товара. На скидочные товары — 0 (баллы не начисляются). */
export const earnedPoints = (p: Product): number =>
  p.discount > 0 ? 0 : Math.round(p.price * POINTS_PER_DOLLAR)

/** Перевод баллов в доллары по курсу траты. */
export const pointsToUsd = (pts: number): number => Math.round(pts / POINTS_PER_USD)

/* ---------- За что начисляются баллы ---------- */
export type EarnRule = { icon: string; title: string; value: string; note?: string }
export const EARN_RULES: EarnRule[] = [
  { icon: '⌚', title: 'Покупка часов', value: '3 балла за каждый $1', note: 'Не начисляется на товары со скидкой' },
  { icon: '✦', title: 'Первая покупка', value: '+500 баллов', note: 'Приветственный бонус' },
  { icon: '✍', title: 'Отзыв о покупке', value: '+300 баллов' },
  { icon: '👥', title: 'Приглашение друга', value: '+1 000 баллов', note: 'Когда друг совершит первую покупку' },
  { icon: '♡', title: 'Добавление в избранное и активность', value: '+50 баллов' },
  { icon: '🎂', title: 'День рождения', value: '+500 баллов', note: 'Раз в год' },
]

/* ---------- На что можно потратить баллы ---------- */
export type SpendItem = { icon: string; title: string; cost: number; usd: number }
export const SPEND_ITEMS: SpendItem[] = [
  { icon: '🧴', title: 'Набор для чистки', cost: 1500, usd: 15 },
  { icon: '🎁', title: 'Подарочный бокс', cost: 2500, usd: 25 },
  { icon: '⌚', title: 'Ремешок (кожа / каучук)', cost: 3500, usd: 35 },
  { icon: '🛠', title: 'Внеплановое ТО', cost: 5000, usd: 50 },
  { icon: '⚙', title: 'Полная чистка механизма', cost: 9000, usd: 90 },
  { icon: '💳', title: 'Кредит на следующую покупку', cost: 100, usd: 1 },
]

/* ---------- Правила / ограничения ---------- */
export const SPEND_RULES: string[] = [
  'Баллы нельзя потратить на первую покупку и на тот же заказ, за который они начислены.',
  `Баллы становятся доступными через ${POINTS_MATURE_DAYS} дней после покупки (после срока возврата).`,
  'Баллами нельзя купить сами часы — только услуги, аксессуары и подарочные наборы.',
  `Кредитом на покупку можно оплатить не более ${NEXT_ORDER_CAP_PCT}% чека.`,
  `Баллы действуют ${POINTS_TTL_MONTHS} месяца с момента начисления.`,
  'На товары со скидкой баллы не начисляются — вы уже получаете выгоду скидкой.',
]

/* ---------- Бесплатное ТО по гарантии (перк покупки, не баллы) ---------- */
export const WARRANTY_SERVICE: { years: number; text: string }[] = [
  { years: 1, text: 'Гарантия 1 год — 1 бесплатное плановое ТО' },
  { years: 2, text: 'Гарантия 2 года — 2 бесплатных ТО или 1 полная чистка механизма' },
]

/* ---------- Статусы клиента ---------- */
export type TierInfo = { id: 'Silver' | 'Gold' | 'Platinum'; threshold: string; perks: string[] }
export const TIERS: TierInfo[] = [
  { id: 'Silver', threshold: 'после регистрации', perks: ['Цифровой паспорт часов', 'Напоминания о ТО', 'Начисление баллов'] },
  { id: 'Gold', threshold: 'от $2 000 покупок', perks: ['Ранний доступ к новинкам', 'Приоритет в листе ожидания'] },
  { id: 'Platinum', threshold: 'от $7 000 покупок', perks: ['Бесплатное ежегодное ТО', 'Подарочный бокс в подарок', 'VIP-приоритет и закрытые события'] },
]
