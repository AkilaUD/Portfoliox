import { useEffect, useRef, useState } from 'react'
import { firstMicro } from '../../data/projects'
import { useChoreography } from '../../hooks/useMediaQuery'
import { track } from '../../lib/analytics'
import { useScrollChoreography, useScrollStep } from '../../lib/motion'
import { ArchitectureFlow } from './ArchitectureFlow'
import { CaseFileHeader, CaseRecord, InlineList } from './CaseFile'

const stages = [
  'Platform',
  'Loan lifecycle',
  'API layer',
  'Data layer',
  'Interface layer',
  'Service boundaries',
  'Contributions',
]

const reveal = { opacity: 0, y: 18 }
const shown = { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }

export function FirstMicroCase() {
  const trackRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const choreographed = useChoreography()
  const [focus, setFocus] = useState<number | null>(null)
  const step = useScrollStep(trackRef, choreographed, stages.length, 'top 55%')

  useScrollChoreography(trackRef, choreographed, ({ gsap }, root) => {
    const q = (sel: string) => root.querySelectorAll(`[data-fm="${sel}"]`)
    const tl = gsap.timeline({
      scrollTrigger: { trigger: root, start: 'top 55%', end: 'bottom bottom', scrub: 0.8 },
    })
    tl.fromTo(q('title'), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 1, ease: 'power2.out' })
      .fromTo(q('tenants'), reveal, shown, '<0.3')
      .fromTo(q('lifecycle'), { opacity: 0 }, { opacity: 1, duration: 0.4 })
      .fromTo(q('flow-node'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.18, duration: 0.6 }, '<')
      .fromTo(q('flow-link'), { scaleX: 0 }, { scaleX: 1, stagger: 0.18, duration: 0.6, ease: 'none' }, '<0.2')
      .fromTo(q('api'), reveal, shown)
      .fromTo(q('data'), reveal, shown)
      .fromTo(q('interface'), reveal, shown)
      .fromTo(q('services'), reveal, shown)
      .fromTo(q('service'), { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, stagger: 0.15, duration: 0.5 }, '<0.3')
      .fromTo(q('callout'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.2, duration: 0.6 })
      .to({}, { duration: 1 })
  })

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          track('case_file_open', { case: firstMicro.slug })
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="work" ref={sectionRef} data-tone="plum" aria-labelledby="firstmicro-title" className="relative">
      <div ref={trackRef} className="choreo:h-[340vh]">
        <div className="page-x py-24 choreo:sticky choreo:top-0 choreo:flex choreo:h-screen choreo:flex-col choreo:justify-center choreo:pt-(--spacing-nav) choreo:pb-6 lg:py-32">
          <div className="ledger-grid items-start gap-y-14">
            <div data-fm="title" className="col-span-full flex flex-col gap-8 lg:col-span-4">
              <CaseFileHeader
                caseNumber={firstMicro.caseNumber}
                title={firstMicro.title}
                domain={firstMicro.domain}
                titleId="firstmicro-title"
              />
              <p className="max-w-[44ch] text-fog">{firstMicro.summary}</p>
              <InlineList items={firstMicro.stack} className="meta text-dim" />

              {step !== null && (
                <ol className="mt-2 hidden flex-col gap-1.5 border-l border-line pl-4 lg:flex" aria-label="Diagram build sequence">
                  {stages.map((s, i) => (
                    <li
                      key={s}
                      aria-current={i === step ? 'step' : undefined}
                      className={`label flex gap-3 transition-colors duration-300 ${
                        i === step ? 'text-ember' : i < step ? 'text-fog' : 'text-dim'
                      }`}
                    >
                      <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              )}
            </div>

            <div className="col-span-full lg:col-span-8">
              <ArchitectureFlow focus={focus} onFocus={setFocus} />
            </div>
          </div>
        </div>
      </div>

      <div className="page-x pb-28 lg:pb-40">
        <div className="ledger-grid">
          <div className="col-span-full lg:col-span-8 lg:col-start-5">
            <CaseRecord
              rows={[
                { term: 'System', value: 'Cloud-based SaaS platform for the microfinance and lending sector.' },
                {
                  term: 'Domain',
                  value:
                    'The complete loan lifecycle: origination, credit approvals, disbursement, repayment scheduling, collections and arrears management, across multiple tenants.',
                },
                { term: 'Technology', value: <InlineList items={firstMicro.stack} /> },
                {
                  term: 'Contribution',
                  value: (
                    <ul className="flex flex-col gap-1.5">
                      {firstMicro.contributions.map((c) => (
                        <li key={c} className="flex gap-3">
                          <span aria-hidden="true" className="text-ember">
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
                  value: 'Slow report loads, system performance, and where service boundaries should fall.',
                },
                { term: 'Lifecycle stage', value: 'API design, core module development and performance optimization.' },
                { term: 'Status', value: 'Current project at FINAP.' },
              ]}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
