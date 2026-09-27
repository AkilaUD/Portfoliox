import { useState, type ReactNode } from 'react'
import { experience } from '../../data/experience'
import { profile } from '../../data/profile'
import { formatYearMonth } from '../../lib/dates'
import { SectionLabel } from '../common/SectionLabel'
import { Reveal } from '../motion/Reveal'

const annotations = [
  { n: 1, term: 'APIs', detail: 'ASP.NET Core 8 · Web API · RESTful endpoints' },
  { n: 2, term: 'Application logic', detail: '.NET business logic for financial products' },
  { n: 3, term: 'Databases', detail: 'SQL Server · Oracle DB · T-SQL · PL/SQL' },
  { n: 4, term: 'UAT', detail: 'Client acceptance testing and feedback loops' },
  { n: 5, term: 'Production releases', detail: 'Jenkins CI/CD · UAT to live production' },
]

const firstFullTime = experience.find((e) => e.weight === 'primary')!
const current = experience.find((e) => e.end === null)!

/** Word, footnote number and trailing punctuation never wrap apart; the underline sits under the word only. */
function Mark({
  n,
  active,
  after = '',
  children,
}: {
  n: number
  active: number | null
  after?: string
  children: ReactNode
}) {
  return (
    <span
      className={`whitespace-nowrap transition-colors duration-300 ${
        active === null || active === n ? 'text-paper' : 'text-paper/50'
      }`}
    >
      <span className="relative">
        <span
          className={`absolute inset-x-0 -bottom-[0.06em] h-[2px] transition-colors duration-500 ${
            active === n ? 'bg-ember' : 'bg-line'
          }`}
          aria-hidden="true"
        />
        {children}
      </span>
      <sup
        className="relative -top-[1.25em] ml-[0.08em] font-mono text-[0.38em] leading-none font-medium tracking-normal text-ember"
        aria-hidden="true"
      >
        {n}
      </sup>
      {after}
    </span>
  )
}

export function EngineeringSignature() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="signature" aria-labelledby="signature-title" className="page-x py-28 lg:py-44">
      <div className="ledger-grid gap-y-10">
        <div className="col-span-full flex flex-col gap-6 lg:col-span-3">
          <SectionLabel index="01">Engineering signature</SectionLabel>
          <dl className="label hidden flex-col gap-2 text-dim lg:flex">
            <div>
              <dt className="inline">Full-time since</dt>
              <dd className="inline text-fog"> / {formatYearMonth(firstFullTime.start)}</dd>
            </div>
            <div>
              <dt className="inline">Now</dt>
              <dd className="inline text-fog"> / {current.shortName}</dd>
            </div>
          </dl>
          <figure className="hidden border-l border-ember/60 pl-3 lg:block">
            <figcaption className="label text-dim">LinkedIn / headline</figcaption>
            <ul className="meta mt-2 flex flex-col gap-0.5 text-fog">
              {profile.linkedinHeadline.split('|').map((part) => (
                <li key={part}>{part.trim()}</li>
              ))}
            </ul>
          </figure>
        </div>

        <div className="col-span-full lg:col-span-9">
          <h2
            id="signature-title"
            tabIndex={-1}
            className="max-w-[22ch] text-[clamp(1.85rem,0.9rem+3vw,4rem)] leading-[1.06] font-medium tracking-[-0.035em] outline-none"
          >
            I build and maintain financial software across{' '}
            <Mark n={1} active={active} after=",">
              APIs
            </Mark>{' '}
            <Mark n={2} active={active} after=",">
              application logic
            </Mark>{' '}
            <Mark n={3} active={active} after=",">
              databases
            </Mark>{' '}
            <Mark n={4} active={active}>
              UAT
            </Mark>{' '}
            and{' '}
            <Mark n={5} active={active} after=".">
              production releases
            </Mark>
          </h2>

          <ol className="mt-14 grid grid-cols-1 border-t border-line sm:grid-cols-2 sm:gap-x-8 lg:mt-20 lg:grid-cols-5 lg:gap-x-0">
            {annotations.map((a, i) => (
              <Reveal
                as="li"
                key={a.n}
                delay={i * 0.06}
                className="border-b border-line lg:border-r lg:border-b-0 lg:px-4 lg:first:pl-0 lg:last:border-r-0"
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(a.n)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(a.n)}
                  onBlur={() => setActive(null)}
                  aria-label={`${a.term}: ${a.detail}`}
                  className="group flex h-full w-full flex-col gap-3 py-5 text-left"
                >
                  <span className="label flex items-baseline gap-2 text-dim">
                    <span className="text-ember tabular-nums">[{a.n}]</span>
                    <span className="transition-colors group-hover:text-paper group-focus-visible:text-paper">
                      {a.term}
                    </span>
                  </span>
                  <span className="meta text-fog">{a.detail}</span>
                </button>
              </Reveal>
            ))}
          </ol>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:mt-20">
            <Reveal>
              <p className="max-w-[58ch] text-fog">{profile.summary}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="flex max-w-[48ch] gap-3 text-fog">
                <span
                  aria-hidden="true"
                  className="signal-pulse mt-2.5 block size-1.5 shrink-0 rounded-full bg-gold"
                />
                {profile.currentWork}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
