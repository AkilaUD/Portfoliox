import { useInView } from 'motion/react'
import { useRef, type CSSProperties } from 'react'
import { stackLayers } from '../../data/skills'

const releaseMarkers = ['Dev', 'UAT', 'Prod']

/**
 * Ledger rows that separate into four application layers once scrolled into view.
 * Collapsed offsets are transform-only so the assembly never shifts layout.
 */
export function SystemArtifact({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLElement>(null)
  const assembled = useInView(ref, { once: true, amount: 0.4 })

  return (
    <figure
      ref={ref}
      data-assembled={assembled || undefined}
      className={`group/artifact relative flex w-full flex-col justify-center ${className}`}
    >
      <figcaption className="sr-only">
        Stack layers: {stackLayers.map((l) => `${l.label}: ${l.items.join(', ')}`).join('. ')}.
      </figcaption>

      <div className="relative pr-14" aria-hidden="true">
        {stackLayers.map((layer, li) => (
          <div
            key={layer.label}
            className="will-change-transform"
            style={{
              transform: `translate3d(calc(var(--px, 0) * ${(li + 1) * 2.5}px), calc(var(--py, 0) * ${(li + 1) * 1.5}px), 0)`,
            }}
          >
            <div
              className="mb-5 [transform:translateY(var(--collapse))] transition-transform duration-[900ms] ease-(--ease-ledger) group-data-assembled/artifact:[transform:none] motion-reduce:[transform:none] motion-reduce:transition-none"
              style={
                {
                  '--collapse': `${(1.5 - li) * 2.6}rem`,
                  transitionDelay: `${li * 70}ms`,
                } as CSSProperties
              }
            >
              <div className="label mb-1.5 flex items-baseline justify-between text-dim opacity-0 transition-opacity delay-500 duration-500 group-data-assembled/artifact:opacity-100 motion-reduce:opacity-100">
                <span className="text-ember">L{String(li + 1).padStart(2, '0')}</span>
                <span>{layer.label}</span>
              </div>
              <div className="border-y border-line">
                {layer.items.map((item, ii) => {
                  const row = li * layer.items.length + ii + 1
                  return (
                    <div
                      key={item}
                      className="meta flex items-baseline gap-3 border-b border-line/60 py-1.5 last:border-b-0"
                    >
                      <span className="text-dim tabular-nums">{String(row).padStart(3, '0')}</span>
                      <span className="text-fog">{item}</span>
                      <span className="mb-1 flex-1 border-b border-dotted border-line" />
                      <span className="label text-dim">{layer.label.slice(0, 3)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}

        <div className="absolute top-2 right-0 bottom-2 flex w-10 flex-col items-center">
          <span className="w-px flex-1 bg-line" />
          {releaseMarkers.map((marker, i) => (
            <div key={marker} className="flex flex-1 flex-col items-center">
              <span
                className={`block size-2 rotate-45 border ${
                  i === releaseMarkers.length - 1 ? 'border-gold bg-gold/30' : 'border-fog/60'
                }`}
              />
              <span className="label mt-1.5 text-dim">{marker}</span>
              <span className="w-px flex-1 bg-line" />
            </div>
          ))}
        </div>
      </div>
    </figure>
  )
}
