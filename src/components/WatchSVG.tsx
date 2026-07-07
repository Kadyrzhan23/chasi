import { useEffect, useId, useRef } from 'react'

type Props = {
  dial: [string, string]
  accent?: string
  live?: boolean
  brand?: string
  className?: string
}

/** Премиальные часы, нарисованные кодом: корпус, безель, циферблат, стрелки */
export default function WatchSVG({ dial, accent = '#d4af6a', live = false, brand = 'CHASI.UZ', className }: Props) {
  const uid = useId().replace(/[:]/g, '')
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!live || !ref.current) return
    let raf = 0
    const el = ref.current
    const tick = () => {
      const n = new Date()
      const s = n.getSeconds() + n.getMilliseconds() / 1000
      const m = n.getMinutes() + s / 60
      const h = (n.getHours() % 12) + m / 60
      const q = (sel: string) => el.querySelector<SVGGElement>(sel)
      q('.h-sec')!.style.transform = `rotate(${s * 6}deg)`
      q('.h-min')!.style.transform = `rotate(${m * 6}deg)`
      q('.h-hour')!.style.transform = `rotate(${h * 30}deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [live])

  const ticks = []
  for (let i = 0; i < 60; i++) {
    const a = (i * 6 * Math.PI) / 180
    const maj = i % 5 === 0
    const r1 = maj ? 150 : 158
    ticks.push(
      <line
        key={i}
        x1={200 + r1 * Math.sin(a)} y1={200 - r1 * Math.cos(a)}
        x2={200 + 170 * Math.sin(a)} y2={200 - 170 * Math.cos(a)}
        stroke={maj ? accent : 'rgba(234,231,224,.35)'}
        strokeWidth={maj ? 3 : 1}
      />,
    )
  }

  // фиксированное «витринное» время 10:08:37 для не-живых часов
  const H = 10 + 8 / 60, M = 8, S = 37

  return (
    <svg ref={ref} viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0d9a8" /><stop offset=".5" stopColor="#8a6d3b" /><stop offset="1" stopColor="#d4af6a" />
        </linearGradient>
        <radialGradient id={`${uid}d`} cx=".35" cy=".3" r="1">
          <stop offset="0" stopColor={dial[0]} /><stop offset="1" stopColor={dial[1]} />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="196" fill={`url(#${uid}c)`} />
      <circle cx="200" cy="200" r="182" fill="#0c0c10" />
      <circle cx="200" cy="200" r="176" fill={`url(#${uid}d)`} />
      {ticks}
      <text x="200" y="120" textAnchor="middle" fill={accent} fontFamily="Cormorant Garamond,serif" fontSize="16" letterSpacing="4">{brand}</text>
      <text x="200" y="292" textAnchor="middle" fill="rgba(234,231,224,.5)" fontFamily="Manrope,sans-serif" fontSize="9" letterSpacing="3">SWISS MADE</text>
      <g className="h-hour" style={{ transformOrigin: '200px 200px', transform: live ? undefined : `rotate(${H * 30}deg)` }}>
        <rect x="196" y="105" width="8" height="100" rx="4" fill={accent} />
      </g>
      <g className="h-min" style={{ transformOrigin: '200px 200px', transform: live ? undefined : `rotate(${M * 6}deg)` }}>
        <rect x="197.5" y="70" width="5" height="135" rx="2.5" fill="#eae7e0" />
      </g>
      <g className="h-sec" style={{ transformOrigin: '200px 200px', transform: live ? undefined : `rotate(${S * 6}deg)` }}>
        <rect x="199" y="52" width="2" height="168" fill={accent} />
        <circle cx="200" cy="200" r="7" fill={accent} />
      </g>
      <circle cx="200" cy="200" r="3" fill="#0c0c10" />
    </svg>
  )
}
