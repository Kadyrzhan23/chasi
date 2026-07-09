import { useState } from 'react'
import { useI18n } from '../i18n/engine'
import { addBooking } from '../store/bookings'
import { toast } from '../toast'

/**
 * Секция «Записаться на ТО»: сначала инфо о ТО и гарантии + кнопка.
 * По клику раскрывается форма (CSS-анимация). Заявка уходит в CRM.
 * variant: 'section' — на главной; 'card' — компактно в кабинете.
 */
export default function ServiceBooking({ variant = 'section' }: { variant?: 'section' | 'card' }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [watch, setWatch] = useState('')
  const [year, setYear] = useState('')
  const [date, setDate] = useState('')

  const phoneOk = phone.replace(/\D/g, '').length >= 9
  const canSubmit = name.trim().length >= 2 && phoneOk && watch.trim().length >= 2 && !!date

  const submit = () => {
    if (!canSubmit) return
    addBooking({ name: name.trim(), phone: phone.trim(), watch: watch.trim(), year: Number(year) || 0, date })
    toast({ kind: 'gold', title: t('book.success'), text: t('book.successText', { date: date.split('-').reverse().join('.') }) })
    setName(''); setPhone(''); setWatch(''); setYear(''); setDate(''); setOpen(false)
  }

  return (
    <div className={`svc-book ${variant}`}>
      <span className="sec-label">{t('book.label')}</span>
      <h2 style={{ marginBottom: 12 }}>{t('book.title')}</h2>
      <p className="muted" style={{ maxWidth: 560, lineHeight: 1.7, fontWeight: 300, marginBottom: 18 }}>{t('book.text')}</p>

      <ul className="svc-feats">
        <li>{t('book.f1')}</li>
        <li>{t('book.f2')}</li>
        <li>{t('book.f3')}</li>
      </ul>

      <button className={`btn ${open ? 'btn-ghost' : 'btn-gold'}`} style={{ marginTop: 22 }} onClick={() => setOpen(o => !o)}>
        {open ? t('book.close') : t('book.open')}
      </button>

      <div className={`svc-form-wrap ${open ? 'open' : ''}`}>
        <div className="svc-form">
          <input className="search-inp" placeholder={t('book.name')} value={name} onChange={e => setName(e.target.value)} />
          <input className="search-inp" placeholder={t('book.phone')} value={phone} onChange={e => setPhone(e.target.value)} />
          <input className="search-inp" placeholder={t('book.watch')} value={watch} onChange={e => setWatch(e.target.value)} />
          <input className="search-inp" type="number" placeholder={t('book.year')} min={1950} max={2026} value={year} onChange={e => setYear(e.target.value)} />
          <div className="svc-date">
            <label className="muted">{t('book.date')}</label>
            <input className="search-inp" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <button className="btn btn-gold" style={{ opacity: canSubmit ? 1 : 0.45 }} disabled={!canSubmit} onClick={submit}>
            {t('book.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
