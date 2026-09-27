import { m } from 'motion/react'
import { signals } from '../../data/strengths'
import { EASE_LEDGER } from '../../lib/motion'
import { SectionHeading } from '../common/SectionHeading'
import { CountUp } from '../motion/CountUp'

const sources = ['eFinancials', 'eFinancials', 'eFinancials', 'FINAP · role scope']

export function ProductionSignals() {
  return (
    <section id="signals" aria-labelledby="signals-title" className="page-x py-24 lg:py-36">
      <SectionHeading
        index="02"
        label="Production signals"
        id="signals-title"
        aside={
          <p className="meta max-w-[52ch] text-dim">
            Figures exactly as stated on the CV. Nothing here is estimated, derived or rounded up.
          </p>
        }
      >
        Signals from production work.
      </SectionHeading>

      <ul className="mt-16 border-t border-line lg:mt-24">
        {signals.map((signal, i) => (
          <li key={signal.value} className="ledger-grid items-center gap-y-4 border-b border-line">
            <span className="label col-span-full pt-8 text-dim lg:col-span-3 lg:pt-0">
              SIG {String(i + 1).padStart(2, '0')} / {sources[i]}
            </span>

            <div className="relative col-span-full self-stretch py-6 pl-8 md:col-span-4 lg:col-span-5 lg:py-10 lg:pl-12">
              <m.span
                aria-hidden="true"
                className="absolute inset-y-0 left-[5px] w-px origin-top bg-line"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE_LEDGER }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 left-0 block size-[11px] -translate-y-1/2 rotate-45 border border-ember bg-ground"
              />
              <CountUp
                value={signal.value}
                className={`text-numeral block font-semibold tabular-nums ${
                  i === 0 ? 'text-ember-gradient ember-sweep pr-[0.05em]' : 'text-paper'
                }`}
              />
            </div>

            <span className="meta col-span-full max-w-[38ch] pb-8 pl-8 text-fog md:col-span-4 md:pb-0 md:pl-0 lg:col-span-4">
              {signal.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
