import { useEffect } from 'react'

/* Появление секций/карточек при попадании в вьюпорт (работает и на мобиле).
   Передавай меняющийся ключ (напр. длину списка), чтобы пере-навесить наблюдатель
   на новые элементы после фильтрации. */
export function useReveal(dep: unknown = 0) {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) }
      }),
      { threshold: 0.12 },
    )
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep])
}

/* 3D-tilt по курсору для .tilt-card (Taste depth + Emil: rAF-lerp, не мгновенно).
   Только на устройствах с настоящей мышью; на touch/reduced-motion не навешивается
   (там работают появление + tap-press из CSS). */
export function useCardTilt(count: number) {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (reduce || !fine) return

    const cards = Array.from(document.querySelectorAll<HTMLElement>('.tilt-card'))
    const cleanups: Array<() => void> = []
    const MAX = 6 // максимальный наклон, градусы

    cards.forEach(card => {
      let tRx = 0, tRy = 0, tTy = 0            // цели
      let rx = 0, ry = 0, ty = 0               // текущие
      let raf = 0, running = false

      const tick = () => {
        rx += (tRx - rx) * 0.15
        ry += (tRy - ry) * 0.15
        ty += (tTy - ty) * 0.15
        card.style.setProperty('--rx', rx.toFixed(2) + 'deg')
        card.style.setProperty('--ry', ry.toFixed(2) + 'deg')
        card.style.setProperty('--ty', ty.toFixed(2) + 'px')
        if (Math.abs(tRx - rx) + Math.abs(tRy - ry) + Math.abs(tTy - ty) > 0.04) {
          raf = requestAnimationFrame(tick)
        } else { running = false }
      }
      const start = () => { if (!running) { running = true; raf = requestAnimationFrame(tick) } }

      const onMove = (e: PointerEvent) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width - 0.5   // -0.5..0.5
        const py = (e.clientY - r.top) / r.height - 0.5
        tRy = px * MAX * 2   // rotateY следует за X
        tRx = -py * MAX * 2  // rotateX следует за Y (инвертирован)
        start()
      }
      const onEnter = () => { tTy = -10; start() }
      const onLeave = () => { tRx = 0; tRy = 0; tTy = 0; start() }

      card.addEventListener('pointerenter', onEnter)
      card.addEventListener('pointermove', onMove)
      card.addEventListener('pointerleave', onLeave)
      cleanups.push(() => {
        cancelAnimationFrame(raf)
        card.removeEventListener('pointerenter', onEnter)
        card.removeEventListener('pointermove', onMove)
        card.removeEventListener('pointerleave', onLeave)
        card.style.removeProperty('--rx')
        card.style.removeProperty('--ry')
        card.style.removeProperty('--ty')
      })
    })
    return () => cleanups.forEach(f => f())
  }, [count])
}
