import type { CSSProperties } from 'react'

const markers = [
  { label: 'Requirements', short: 'REQ', at: 12 },
  { label: 'Build', short: 'BUILD', at: 37 },
  { label: 'UAT', short: 'UAT', at: 63 },
  { label: 'Production', short: 'PROD', at: 88 },
]

/**
 * The hero's horizontal delivery trace. Pointer behaviour is driven by the parent Hero
 * through the data-trace-* hooks so a single rAF loop owns all hero motion.
 */
export function SystemTrace() {
  return (
    <div className="page-x relative z-10" aria-hidden="true">
      <div data-trace-band className="relative h-24">
        <div
          className="absolute inset-x-0 top-1/2 h-2.5 -translate-y-1/2 opacity-60"
          style={{
            backgroundImage:
              'repeating-linear-gradient(to right, var(--color-line) 0 1px, transparent 1px 24px), repeating-linear-gradient(to right, var(--color-dim) 0 1px, transparent 1px 120px)',
            backgroundSize: '100% 40%, 100% 100%',
            backgroundRepeat: 'repeat-x',
            backgroundPosition: 'left center, left center',
          }}
        />
        <div className="trace-draw absolute inset-x-0 top-1/2 h-px bg-fog/50" />

        <span
          className="label boot-in absolute top-1 left-0 text-dim"
          style={{ '--i': 6 } as CSSProperties}
        >
          Trace 00
        </span>
        <span
          className="label boot-in absolute top-1 right-0 text-dim"
          style={{ '--i': 7 } as CSSProperties}
        >
          Dev → Prod
        </span>

        {markers.map((m, i) => (
          <span
            key={m.short}
            data-prox="x"
            className="group absolute top-1/2 flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${m.at}%` }}
          >
            <span
              className="label boot-in -mt-8 mb-3 text-dim transition-colors duration-300 group-data-near:text-paper"
              style={{ '--i': 8 + i } as CSSProperties}
            >
              {m.short}
            </span>
            <span className="h-3 w-px -translate-y-[0.4rem] bg-fog/60 transition-colors duration-300 group-data-near:bg-ember" />
          </span>
        ))}

        <span
          data-trace-dot
          className="absolute top-1/2 left-0 block size-2 rounded-full bg-ember shadow-[0_0_0_4px_rgba(255,106,43,0.18)]"
          style={{ transform: 'translate3d(0, -50%, 0)' }}
        />
        <span
          data-trace-coords
          className="label absolute top-[calc(50%+0.9rem)] left-0 whitespace-nowrap text-ember opacity-0 transition-opacity duration-300"
        >
          X 0000 · Y 0000
        </span>
      </div>
    </div>
  )
}
