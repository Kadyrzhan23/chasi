export type ToastMsg = {
  title: string
  text: string
  kind?: 'tg' | 'gold' // tg = как в Telegram-боте, gold = системное
  channel?: string // подпись канала, напр. "Telegram · CHASI.UZ Bot"
}

type Listener = (t: ToastMsg) => void
const listeners = new Set<Listener>()

export function onToast(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function toast(t: ToastMsg) {
  listeners.forEach(fn => fn(t))
}
