import { AnimatePresence, m } from 'motion/react'
import { useEffect, useRef } from 'react'
import { eFinancials } from '../../data/projects'
import { useChoreography } from '../../hooks/useMediaQuery'
import { track } from '../../lib/analytics'
import { EASE_LEDGER, useScrollChoreography, useScrollStep } from '../../lib/motion'
import { CaseFileHeader, CaseRecord, InlineList } from './CaseFile'

const statusByStep = ['Defect open', 'Diagnosis', 'Fix in progress', 'Validating', 'In UAT', 'Released']
const FLAGGED_ROW = 2
const steps = eFinancials.incident

function Redacted({ w }: { w: string }) {
  return <span aria-hidden="true" className="inline-block h-2.5 translate-y-px bg-ink/12" style={{ width: w }} />
}

function LedgerTable({ step }: { step: number }) {
  const released = step === steps.length - 1
  return (
    <div className="relative">
      <table className="w-full border-collapse text-left">
        <caption className="label mb-3 text-left text-ink-muted">
          Structural view · illustrative record layout, no client data
        </caption>
        <thead>
          <tr className="label border-y border-ink/70 text-ink-muted">
            <th scope="col" className="py-2.5 pr-3 font-normal">Rec</th>
            <th scope="col" className="py-2.5 pr-3 font-normal">Module</th>
            <th scope="col" className="hidden py-2.5 pr-3 font-normal sm:table-cell">Entity</th>
            <th scope="col" className="hidden py-2.5 pr-3 font-normal md:table-cell">Values</th>
            <th scope="col" className="py-2.5 text-right font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {eFinancials.workAreas.map((row, i) => {
            const flagged = i === FLAGGED_ROW
            return (
              <tr
                key={row.module}
                className={`meta border-b border-rule transition-colors duration-500 ${
                  flagged && !released ? 'bg-ember/[0.09]' : ''
                }`}
              >
                <td className="py-3 pr-3 text-ink-muted tabular-nums">R-{String(i + 1).padStart(3, '0')}</td>
                <td className="py-3 pr-3 text-ink">{row.module}</td>
                <td className="label hidden py-3 pr-3 text-ink-muted sm:table-cell">{row.entity}</td>
                <td className="hidden py-3 pr-3 md:table-cell">
                  <span className="flex gap-2">
                    <Redacted w={`${38 + ((i * 17) % 30)}px`} />
                    <Redacted w={`${22 + ((i * 11) % 18)}px`} />
                    <Redacted w={`${46 - ((i * 7) % 20)}px`} />
                  </span>
                </td>
                <td className="py-3 text-right">
                  {flagged ? (
                    <span
                      className={`label inline-flex items-center gap-2 ${released ? 'text-gold-deep' : 'text-ember-deep'}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`block size-1.5 rounded-full ${released ? 'bg-gold-deep' : 'bg-ember-deep'}`}
                      />
                      {statusByStep[step]}
                    </span>
                  ) : (
                    <span className="label text-ink-muted">—</span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function IncidentRail({ step }: { step: number | null }) {
  const active = step ?? steps.length - 1
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="label text-ink-muted">Incident → release</p>
        {step !== null && (
          <p className="label text-ink-muted tabular-nums">
            Step {String(active + 1).padStart(2, '0')} / {String(steps.length).padStart(2, '0')}
          </p>
        )}
      </div>

      <ol className={`mt-5 ${step === null ? 'flex flex-col' : 'relative grid grid-cols-6'}`}>
        {step !== null && (
          <>
            <span aria-hidden="true" className="absolute top-[5px] right-[8%] left-[8%] h-px bg-rule" />
            <span
              aria-hidden="true"
              data-ef-fill
              className="absolute top-[5px] left-[8%] h-px w-[84%] origin-left bg-ink"
              style={{ transform: 'scaleX(0)' }}
            />
          </>
        )}
        {steps.map((s, i) => {
          const state = i === active ? 'active' : i < active ? 'done' : 'next'
          return step === null ? (
            <li key={s.step} className="relative grid grid-cols-[1.5rem_1fr] gap-x-3 pb-6 last:pb-0">
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="absolute top-3 bottom-0 left-[5px] w-px bg-rule" />
              )}
              <span
                aria-hidden="true"
                className={`mt-1 block size-[11px] rotate-45 border ${
                  i === steps.length - 1 ? 'border-gold-deep bg-gold-deep' : 'border-ink bg-paper'
                }`}
              />
              <div>
                <p className="label text-ink">
                  <span className="mr-2 text-ink-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  {s.step}
                </p>
                <p className="mt-1.5 max-w-[56ch] text-[0.95rem] leading-relaxed text-ink-muted">{s.detail}</p>
              </div>
            </li>
          ) : (
            <li key={s.step} className="relative flex flex-col items-center gap-3 text-center" aria-current={state === 'active' ? 'step' : undefined}>
              <span
                aria-hidden="true"
                className={`relative z-10 block size-[11px] rotate-45 border transition-colors duration-300 ${
                  state === 'active'
                    ? i === steps.length - 1
                      ? 'border-gold-deep bg-gold-deep'
                      : 'border-ember-deep bg-ember-deep'
                    : state === 'done'
                      ? 'border-ink bg-ink'
                      : 'border-ink/50 bg-paper'
                }`}
              />
              <span
                className={`label transition-colors duration-300 ${state === 'next' ? 'text-ink-muted' : 'text-ink'}`}
              >
                {s.step}
              </span>
            </li>
          )
        })}
      </ol>

      {step !== null && (
        <div className="mt-6 min-h-[5.5rem] border-t border-rule pt-4" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p
              key={active}
              className="max-w-[60ch] text-[1.05rem] leading-relaxed text-ink"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE_LEDGER }}
            >
              <span className="label mr-3 text-ember-deep">{steps[active]!.step}</span>
              {steps[active]!.detail}
            </m.p>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}

function ReportSheets() {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {eFinancials.reports.map((report, i) => (
        <li
          key={report}
          className="relative border border-rule bg-[#fbf5ec] p-5 shadow-[0_1px_0_rgba(26,20,17,0.06)]"
          style={{ marginTop: `${i * 0.75}rem` }}
        >
          <p className="label flex justify-between text-ink-muted">
            <span>SSRS</span>
            <span className="tabular-nums">RPT-{String(i + 1).padStart(2, '0')}</span>
          </p>
          <p className="mt-6 text-xl font-semibold tracking-[-0.02em] text-ink">{report}</p>
          <div aria-hidden="true" className="mt-5 flex flex-col gap-2">
            {[88, 64, 76, 52].map((w, j) => (
              <span key={j} className="block h-px bg-rule" style={{ width: `${w - i * 4}%` }} />
            ))}
          </div>
          <p className="label mt-6 text-ink-muted">Bank compliance teams</p>
        </li>
      ))}
    </ul>
  )
}

export function EFinancialsCase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const choreographed = useChoreography()
  const step = useScrollStep(trackRef, choreographed, steps.length, 'top 20%')

  useScrollChoreography(trackRef, choreographed, ({ gsap }, root) => {
    gsap.fromTo(
      root.querySelector('[data-ef-fill]'),
      { scaleX: 0 },
      { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root, start: 'top 20%', end: 'bottom bottom', scrub: 0.6 } },
    )
  })

  useScrollChoreography(sectionRef, choreographed, ({ gsap }, root) => {
    gsap.fromTo(
      root,
      { clipPath: 'inset(0% 5% 0% 5% round 28px)' },
      {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top bottom', end: 'top 15%', scrub: 0.4 },
      },
    )
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          track('case_file_open', { case: eFinancials.slug })
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="efinancials"
      ref={sectionRef}
      data-ground="paper"
      data-tone="plum"
      aria-labelledby="efinancials-title"
      className="relative bg-paper text-ink"
    >
      <div className="page-x label flex justify-between border-b border-rule py-3 text-ink-muted">
        <span>Archive / production system</span>
        <span className="hidden sm:inline">Confidential platform · structural illustration only</span>
      </div>

      <div ref={trackRef} className="choreo:h-[300vh]">
        <div className="page-x py-24 choreo:sticky choreo:top-0 choreo:flex choreo:h-screen choreo:flex-col choreo:justify-center choreo:pt-(--spacing-nav) choreo:pb-6 lg:py-32">
          <div className="ledger-grid items-start gap-y-14">
            <div className="col-span-full flex flex-col gap-8 lg:col-span-4">
              <CaseFileHeader
                caseNumber={eFinancials.caseNumber}
                title={eFinancials.title}
                domain={eFinancials.domain}
                titleId="efinancials-title"
                tone="paper"
              />
              <p className="max-w-[42ch] text-ink-muted">{eFinancials.summary}</p>
              <InlineList items={eFinancials.stack} className="meta text-ink-muted" />
              <dl className="grid grid-cols-2 border-t border-rule">
                <div className="border-r border-b border-rule py-4 pr-4">
                  <dt className="label text-ink-muted">Defects resolved</dt>
                  <dd className="mt-1 text-4xl font-semibold tracking-[-0.04em]">100+</dd>
                </div>
                <div className="border-b border-rule py-4 pl-4">
                  <dt className="label text-ink-muted">Financial companies</dt>
                  <dd className="mt-1 text-4xl font-semibold tracking-[-0.04em]">20+</dd>
                </div>
              </dl>
            </div>

            <div className="col-span-full flex flex-col gap-12 lg:col-span-8 lg:pl-6">
              <LedgerTable step={step ?? steps.length - 1} />
              <IncidentRail step={step} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-x pb-28 lg:pb-40">
        <div className="ledger-grid gap-y-16">
          <div className="col-span-full lg:col-span-3">
            <p className="label text-ember-deep">Report sheets</p>
            <p className="mt-4 max-w-[34ch] text-ink-muted">
              SSRS reports for audit trails, portfolio summaries and regulatory submissions.
            </p>
          </div>
          <div className="col-span-full lg:col-span-9">
            <ReportSheets />
          </div>
          <div className="col-span-full lg:col-span-8 lg:col-start-5">
            <CaseRecord
              tone="paper"
              rows={[
                { term: 'System', value: 'Enterprise web-based leasing finance platform.' },
                {
                  term: 'Domain',
                  value:
                    'Leasing workflows, asset management, installment schedules and regulatory reporting, used by 20+ financial companies and several leading Sri Lankan banks.',
                },
                { term: 'Technology', value: <InlineList items={eFinancials.stack} /> },
                {
                  term: 'Contribution',
                  value: (
                    <ul className="flex flex-col gap-1.5">
                      {eFinancials.contributions.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span aria-hidden="true" className="text-ember-deep">
                            —
                          </span>
                          {c}
                        </li>
                      ))}
                    </ul>
                  ),
                },
                {
                  term: 'Problems worked on',
                  value: '.NET business logic, stored procedures, SQL query performance and error-handling edge cases.',
                },
                {
                  term: 'Lifecycle stage',
                  value: 'Diagnosis, fixes and features, structured validation, client UAT and production releases.',
                },
                {
                  term: 'Team',
                  value: 'Internal knowledge-transfer sessions and onboarding of new team members on the eFinancials codebase.',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
