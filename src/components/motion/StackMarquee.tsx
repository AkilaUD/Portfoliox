import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { onScrollVelocity } from '../../lib/smoothScroll'

const rows = [
  ['C#', '.NET', 'ASP.NET Core 8', 'Angular 17+', 'SQL Server', 'Oracle DB', 'Entity Framework Core'],
  ['T-SQL', 'PL/SQL', 'Azure SQL', 'Web API', 'Jenkins', 'Azure DevOps', 'SSRS', 'Microservices'],
]

/**
 * Two counter-running rails of the CV stack in outline type. Scroll speed pushes and skews them.
 * Decorative: the same entries are listed and explained in the systems map.
 */
export function StackMarquee() {
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion) return
    const tracks = Array.from(root.querySelectorAll<HTMLElement>('[data-track]'))
    const offsets = tracks.map(() => 0)
    let boost = 0
    let skew = 0
    let frame = 0
    let last = performance.now()

    const stopVelocity = onScrollVelocity((v) => {
      boost = Math.max(-18, Math.min(18, v))
    })

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)
      const dt = Math.min(64, now - last) / 16.67
      last = now
      boost *= 0.92
      skew += (boost * 0.6 - skew) * 0.12
      tracks.forEach((track, i) => {
        const dir = i % 2 === 0 ? -1 : 1
        const half = track.scrollWidth / 2
        offsets[i] = (offsets[i]! + dir * (0.6 + Math.abs(boost) * 0.5) * dt) % half
        if (dir > 0 && offsets[i]! > 0) offsets[i]! -= half
        track.style.transform = `translate3d(${offsets[i]}px,0,0) skewX(${-skew * dir}deg)`
      })
    }

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(frame)
      if (entry?.isIntersecting) {
        last = performance.now()
        frame = requestAnimationFrame(tick)
      }
    })
    io.observe(root)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      stopVelocity()
    }
  }, [reducedMotion])

  return (
    <div ref={rootRef} aria-hidden="true" className="relative overflow-clip border-y border-line py-6 select-none lg:py-10">
      {rows.map((row, ri) => (
        <div key={ri} className="flex whitespace-nowrap">
          <div data-track className="flex shrink-0 items-center will-change-transform">
            {[...row, ...row].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center">
                <span
                  className={`px-6 text-[clamp(2.5rem,1.5rem+4vw,6.5rem)] leading-[1.05] font-semibold tracking-[-0.045em] lg:px-10 ${
                    (i + ri) % 3 === 0 ? 'text-ember-gradient ember-sweep' : 'marquee-outline'
                  }`}
                >
                  {item}
                </span>
                <span className="block size-3 shrink-0 rotate-45 border border-ember/70" />
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
