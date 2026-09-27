import { useEffect, useRef, type CSSProperties, type RefObject } from 'react'
import { profile } from '../../data/profile'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { HeroMetadata } from './HeroMetadata'
import { HeroCanvas } from '../gl/HeroCanvas'
import { HeroName } from './HeroName'
import { HeroPortrait } from './HeroPortrait'
import { SystemTrace } from './SystemTrace'

const headline = ['Building software', 'for systems that', 'have to work.']

const PROXIMITY_RADIUS = 220
const MAX_SHIFT = 3

/** One rAF loop drives the trace signal, coordinates, artifact parallax and label proximity. */
function useHeroPointer(rootRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return

    const band = root.querySelector<HTMLElement>('[data-trace-band]')
    const dot = root.querySelector<HTMLElement>('[data-trace-dot]')
    const coords = root.querySelector<HTMLElement>('[data-trace-coords]')
    const proxEls = Array.from(root.querySelectorAll<HTMLElement>('[data-prox]'))
    if (!band || !dot || !coords) return

    let rootRect = root.getBoundingClientRect()
    let bandRect = band.getBoundingClientRect()
    let centers = proxEls.map((el) => {
      const r = el.getBoundingClientRect()
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
    })
    const measure = () => {
      const offsets = proxEls.map((el) => el.style.transform)
      proxEls.forEach((el) => (el.style.transform = ''))
      rootRect = root.getBoundingClientRect()
      bandRect = band.getBoundingClientRect()
      centers = proxEls.map((el) => {
        const r = el.getBoundingClientRect()
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
      })
      proxEls.forEach((el, i) => (el.style.transform = offsets[i] ?? ''))
    }

    let target = { x: bandRect.width * 0.08, y: 0 }
    const current = { ...target }
    let pointer: { x: number; y: number } | null = null
    let frame = 0

    const tick = () => {
      frame = 0
      current.x += (target.x - current.x) * 0.18
      current.y += (target.y - current.y) * 0.18
      const bandX = Math.max(0, Math.min(bandRect.width, current.x - bandRect.left + rootRect.left))
      dot.style.transform = `translate3d(${bandX - 4}px, -50%, 0)`
      coords.style.transform = `translate3d(${Math.min(bandX + 10, bandRect.width - 120)}px, 0, 0)`

      if (pointer) {
        const localX = Math.round(pointer.x - rootRect.left)
        const localY = Math.round(pointer.y - rootRect.top)
        coords.textContent = `X ${String(localX).padStart(4, '0')} · Y ${String(localY).padStart(4, '0')}`
        root.style.setProperty(
          '--px',
          ((pointer.x - rootRect.left) / rootRect.width - 0.5).toFixed(3),
        )
        root.style.setProperty(
          '--py',
          ((pointer.y - rootRect.top) / rootRect.height - 0.5).toFixed(3),
        )

        proxEls.forEach((el, i) => {
          const c = centers[i]!
          const horizontalOnly = el.dataset.prox === 'x'
          const dx = (horizontalOnly ? current.x : pointer!.x) - c.x
          const dy = horizontalOnly ? 0 : pointer!.y - c.y
          const dist = Math.hypot(dx, dy) || 1
          const influence = Math.max(0, 1 - dist / PROXIMITY_RADIUS)
          const shift = influence * MAX_SHIFT
          el.style.transform = horizontalOnly
            ? `translate3d(0, ${-shift}px, 0)`
            : `translate3d(${(dx / dist) * shift}px, ${(dy / dist) * shift}px, 0)`
          el.toggleAttribute('data-near', influence > 0.35)
        })
      }

      if (Math.abs(target.x - current.x) > 0.3 || Math.abs(target.y - current.y) > 0.3) {
        frame = requestAnimationFrame(tick)
      }
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
      pointer = { x: event.clientX, y: event.clientY }
      target = { x: event.clientX, y: event.clientY }
      coords.style.opacity = '1'
      schedule()
    }
    const onLeave = () => {
      pointer = null
      coords.style.opacity = '0'
      root.style.setProperty('--px', '0')
      root.style.setProperty('--py', '0')
      proxEls.forEach((el) => {
        el.style.transform = ''
        el.removeAttribute('data-near')
      })
    }
    const onLayoutChange = () => measure()

    root.addEventListener('pointermove', onMove)
    root.addEventListener('pointerleave', onLeave)
    root.addEventListener('pointerenter', onLayoutChange)
    window.addEventListener('resize', onLayoutChange)
    window.addEventListener('scroll', onLayoutChange, { passive: true })
    schedule()

    return () => {
      cancelAnimationFrame(frame)
      root.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      root.removeEventListener('pointerenter', onLayoutChange)
      window.removeEventListener('resize', onLayoutChange)
      window.removeEventListener('scroll', onLayoutChange)
      onLeave()
    }
  }, [rootRef, enabled])
}

function Tagline() {
  return (
    <p className="text-[clamp(1.6rem,0.9rem+3.2vw,3.25rem)] leading-[0.98] font-semibold tracking-[-0.045em] lg:text-[calc(var(--name-size)*0.15)]">
      {headline.map((line, i) => (
        <span key={line} className="line-mask">
          <span className="line-rise" style={{ '--i': i + 3 } as CSSProperties}>
            {i === headline.length - 1 ? (
              <>
                {line.slice(0, line.lastIndexOf(' ') + 1)}
                <span className="ember-sweep text-ember-gradient pr-[0.04em]">
                  {line.slice(line.lastIndexOf(' ') + 1)}
                </span>
              </>
            ) : (
              line
            )}
          </span>
        </span>
      ))}
    </p>
  )
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  useHeroPointer(rootRef, finePointer && !reducedMotion)

  return (
    <section
      ref={rootRef}
      id="top"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip pt-(--spacing-nav)"
    >
      <HeroCanvas rootRef={rootRef} />
      <div className="page-x relative z-10 flex flex-1 flex-col pt-6 pb-8 lg:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <p className="label boot-in text-ember" style={{ '--i': 0 } as CSSProperties}>
            {profile.label}
          </p>
          <p
            className="label boot-in flex items-center gap-2 text-dim"
            style={{ '--i': 1 } as CSSProperties}
          >
            <span aria-hidden="true" className="signal-pulse block size-1.5 rounded-full bg-gold" />
            Ledger 00 · System online
          </p>
        </div>

        {/* One size drives the name, the portrait and how far it climbs into the letters. The portrait may
            cover the lower part of letters, never a whole one: the name must stay legible. */}
        <div className="relative mt-8 [--name-size:26vw] md:[--name-size:23vw] lg:mt-6 lg:[--name-size:16.5vw] 2xl:[--name-size:min(16.5vw,21rem)]">
          <HeroName />
          <div className="flex flex-col lg:flex-row lg:items-end">
            <HeroPortrait className="relative z-10 mx-auto mt-[calc(var(--name-size)*-0.4)] w-full shrink-0 md:mt-[calc(var(--name-size)*-0.3)] md:w-[calc(var(--name-size)*3.1)] lg:mx-0 lg:mt-[calc(var(--name-size)*-0.97)] lg:ml-[2%] lg:w-[calc(var(--name-size)*2.45)]" />
            <div className="border-t border-line pt-8 lg:flex-1 lg:border-t-0 lg:pt-0 lg:pb-[calc(var(--name-size)*0.1)] lg:pl-[4%]">
              <Tagline />
            </div>
          </div>
        </div>

        <div className="ledger-grid relative z-10 gap-y-6 pt-6 lg:border-t lg:border-line lg:pt-8">
          <p
            className="label boot-in hidden self-end text-dim lg:col-span-6 lg:block"
            style={{ '--i': 4 } as CSSProperties}
          >
            <span className="text-ember">Fig. 00</span> / {profile.name} · {profile.location}
          </p>
          <p
            className="boot-in col-span-full max-w-[36ch] self-end text-lede text-fog md:col-span-6 lg:col-span-5 lg:col-start-8"
            style={{ '--i': 3 } as CSSProperties}
          >
            {profile.intro}
          </p>
        </div>
      </div>

      <SystemTrace />
      <HeroMetadata />
    </section>
  )
}
