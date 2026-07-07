export type ToastMsg = {
  title: string
  text: string
  kind?: 'tg' | 'gold'   // tg = как в Telegram-боте, gold = системное
  channel?: string       // подпись канала, напр. "Telegram · CHASI.UZ Bot"
}

let listener: ((t: ToastMsg) => void) | null = null

export function onToast(fn: (t: ToastMsg) => void) {
  listener = fn
}

export function toast(t: ToastMsg) {
  listener?.(t)
}
