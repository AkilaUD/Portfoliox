import { m } from 'motion/react'
import { strengths, workingSequence } from '../../data/strengths'
import type { Strength } from '../../data/types'
import { EASE_LEDGER } from '../../lib/motion'
import { SectionHeading } from '../common/SectionHeading'

const inView = { once: true, amount: 0.6 } as const

/** Small schematic per strength: a sequence, a stack or a loop. Decorative; the statement carries the meaning. */
function EvidenceVisual({ strength }: { strength: Strength }) {
  const { markers, visual } = strength

  if (visual === 'stack') {
    return (
      <div aria-hidden="true" className="relative flex w-full max-w-[16rem] flex-col gap-1.5 pl-5">
        <m.span
          className="absolute top-1 bottom-1 left-[3px] w-px origin-top bg-ember/70"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={inView}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE_LEDGER }}
        />
        {markers.map((mk, i) => (
          <m.span
            key={mk}
            className="label border border-line px-3 py-1.5 text-fog"
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={inView}
            transition={{ duration: 0.5, delay: 0.25 + i * 0.1, ease: EASE_LEDGER }}
          >
            {mk}
          </m.span>
        ))}
      </div>
    )
  }

  if (visual === 'team') {
    return (
      <div aria-hidden="true" className="relative w-full max-w-[20rem] pt-1 pb-5">
        <m.span
          className="absolute right-3 bottom-0 left-3 h-4 origin-left rounded-b-md border-x border-b border-line"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inView}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE_LEDGER }}
        />
        <div className="relative flex justify-between">
          {markers.map((mk, i) => (
            <m.span
              key={mk}
              className="label flex flex-col items-center gap-2 bg-ground px-1 text-fog"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={inView}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <span className="block size-2 rotate-45 border border-fog/70" />
              {mk}
            </m.span>
          ))}
        </div>
      </div>
    )
  }

  const last = markers.length - 1
  const crowded = markers.length > 3
  return (
    <div aria-hidden="true" className="relative w-full max-w-[25rem] pt-1">
      <span className="absolute top-[0.55rem] right-2 left-2 h-px bg-line" />
      <m.span
        className="absolute top-[0.55rem] right-2 left-2 h-px origin-left bg-ember"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={inView}
        transition={{ duration: 1.1, delay: 0.25, ease: EASE_LEDGER }}
      />
      <div className="relative flex justify-between gap-1 sm:gap-3">
        {markers.map((mk, i) => (
          <m.span
            key={mk}
            className="label flex max-w-[6.5rem] min-w-0 flex-col items-center gap-2 text-center text-fog first:items-start first:text-left last:items-end last:text-right"
            initial={{ opacity: 0, y: 4 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={inView}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
          >
            <span
              className={`block size-2 rotate-45 border ${
                i === last
                  ? visual === 'release'
                    ? 'border-gold bg-gold'
                    : 'border-ember bg-ember'
                  : 'border-fog/70 bg-ground'
              }`}
            />
            <span className={crowded && i % 2 === 1 ? 'max-sm:mt-8' : undefined}>{mk}</span>
          </m.span>
        ))}
      </div>
    </div>
  )
}

export function EvidenceWall() {
  return (
    <section id="evidence" aria-labelledby="evidence-title" className="page-x py-28 lg:py-40">
      <SectionHeading index="07" label="Evidence" id="evidence-title">
        Six engineering signals, each with its evidence.
      </SectionHeading>

      <ol className="mt-16 border-t border-line lg:mt-24">
        {strengths.map((s) => (
          <li
            key={s.index}
            className="ledger-grid items-center gap-y-6 border-b border-line py-9 lg:py-11"
          >
            <m.h3
              className="col-span-full flex items-baseline gap-4 lg:col-span-3"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={inView}
              transition={{ duration: 0.5 }}
            >
              <span className="label text-ember tabular-nums">{s.index}</span>
              <span className="text-xl font-semibold tracking-[-0.02em] text-paper">{s.label}</span>
            </m.h3>
            <div className="col-span-full md:col-span-4 lg:col-span-4">
              <EvidenceVisual strength={s} />
            </div>
            <m.p
              className="col-span-full max-w-[46ch] text-fog md:col-span-4 lg:col-span-5"
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.6, delay: 0.35, ease: EASE_LEDGER }}
            >
              {s.statement}
            </m.p>
          </li>
        ))}
      </ol>

      <div className="ledger-grid mt-28 gap-y-10 lg:mt-36">
        <div className="col-span-full lg:col-span-3">
          <p className="label text-ember">07.1 / How I work</p>
        </div>
        <div className="col-span-full lg:col-span-9">
          <h3 className="text-[clamp(1.6rem,1rem+1.8vw,2.6rem)] leading-[1.05] font-semibold tracking-[-0.035em]">
            The full lifecycle, not one slice of it.
          </h3>
          <ol className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-2 lg:grid-cols-6">
            {workingSequence.map((w, i) => (
              <m.li
                key={w.step}
                className="relative border-b border-line py-6 pr-4 lg:border-b-0 lg:py-7"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -top-[5px] left-0 block size-[9px] rotate-45 border border-ember bg-ground"
                />
                <p className="label flex items-center gap-2 text-paper">
                  <span className="text-dim tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {w.step}
                  {i < workingSequence.length - 1 && (
                    <span aria-hidden="true" className="hidden text-ember lg:inline">
                      →
                    </span>
                  )}
                </p>
                <p className="meta mt-3 text-fog">{w.detail}</p>
              </m.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
