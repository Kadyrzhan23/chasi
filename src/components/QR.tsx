import { useMemo } from 'react'

/* мок-QR: детерминированный узор из серийного номера */
export default function QR({ seed, size = 96 }: { seed: string; size?: number }) {
  const cells = useMemo(() => {
    let h = 0
    for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
    const out: boolean[] = []
    for (let i = 0; i < 121; i++) { h = (h * 1103515245 + 12345) >>> 0; out.push(h % 100 < 46) }
    return out
  }, [seed])
  return (
    <svg viewBox="0 0 110 110" style={{ width: size, background: '#eae7e0', padding: 6 }}>
      {cells.map((on, i) => on && <rect key={i} x={(i % 11) * 10} y={Math.floor(i / 11) * 10} width="9" height="9" fill="#0a0a0d" />)}
    </svg>
  )
}
