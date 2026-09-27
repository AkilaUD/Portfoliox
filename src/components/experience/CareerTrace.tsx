import { AnimatePresence, m } from 'motion/react'
import { useRef, type KeyboardEvent } from 'react'
import { experience } from '../../data/experience'
import { useChoreography } from '../../hooks/useMediaQuery'
import { monthsBetween, startYear } from '../../lib/dates'
import { EASE_LEDGER, useScrollChoreography, useScrollStep } from '../../lib/motion'
import { getLenis } from '../../lib/smoothScroll'
import { SectionLabel } from '../common/SectionLabel'
import { ExperienceDetail } from './ExperienceDetail'
import { ExperienceNode } from './ExperienceNode'

const PANEL_ID = 'trace-panel'
const RAIL_START = 2
const RAIL_SPAN = 94

function railPosition(date: Parameters<typeof monthsBetween>[0] | null) {
  const origin = experience[0]!.start
  const total = monthsBetween(origin, null)
  const offset = date ? monthsBetween(origin, date) - 1 : total
  return RAIL_START + (offset / total) * RAIL_SPAN
}

function Heading({ compact = false }: { compact?: boolean }) {
  return (
    <div className="ledger-grid gap-y-5">
      <div className="col-span-full lg:col-span-3 lg:pt-3">
        <SectionLabel index="03">Career trace</SectionLabel>
      </div>
      <h2
        id="trace-title"
        tabIndex={-1}
        className={`col-span-full outline-none lg:col-span-9 ${
          compact ? 'text-[clamp(1.75rem,0.9rem+1.9vw,3rem)] leading-[1] tracking-[-0.04em]' : 'text-title'
        }`}
      >
        From interface components to production finance systems.
      </h2>
    </div>
  )
}

function ChoreographedTrace() {
  const rootRef = useRef<HTMLElement>(null)
  const active = useScrollStep(rootRef, true, experience.length) ?? 0
  const role = experience[active]!

  useScrollChoreography(rootRef, true, ({ gsap }, root) => {
    gsap.fromTo(
      root.querySelector('[data-trace-fill]'),
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
      },
    )
  })

  const select = (index: number) => {
    const root = rootRef.current
    if (!root) return
    const top = root.getBoundingClientRect().top + window.scrollY
    const range = root.offsetHeight - window.innerHeight
    const destination = top + (range * (index + 0.5)) / experience.length
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(destination, { duration: 1.1 })
    else window.scrollTo({ top: destination, behavior: 'smooth' })
    document.getElementById(`tab-${experience[index]!.id}`)?.focus({ preventScroll: true })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = experience.length - 1
    const target =
      event.key === 'ArrowRight'
        ? (active + 1) % experience.length
        : event.key === 'ArrowLeft'
          ? (active + last) % experience.length
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (target === null) return
    event.preventDefault()
    select(target)
  }

  return (
    <section id="trace" ref={rootRef} aria-labelledby="trace-title" className="relative h-[330vh]">
      <div className="sticky top-0 flex h-screen flex-col pt-(--spacing-nav)">
        <div className="page-x pt-8">
          <Heading compact />
        </div>

        <div className="page-x mt-6">
          <div className="relative h-20" role="tablist" aria-label="Career roles, oldest to current">
            <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-line" />
            <span
              aria-hidden="true"
              data-trace-fill
              className="absolute inset-x-0 top-1/2 h-px origin-left bg-fog/70"
              style={{ transform: 'scaleX(0)' }}
            />
            {experience.map((r, i) => {
              const left = railPosition(r.start)
              return (
                <ExperienceNode
                  key={r.id}
                  role={r}
                  state={i === active ? 'active' : i < active ? 'archived' : 'upcoming'}
                  left={left}
                  width={railPosition(r.end) - left}
                  panelId={PANEL_ID}
                  onSelect={() => select(i)}
                  onKeyDown={onKeyDown}
                />
              )
            })}
            <span
              aria-hidden="true"
              className="label absolute top-0 bottom-0 flex translate-x-[-50%] flex-col items-center justify-between text-dim"
              style={{ left: `${RAIL_START + RAIL_SPAN}%` }}
            >
              <span>Now</span>
              <span className="block h-4 w-px bg-ember" />
              <span className="text-transparent">.</span>
            </span>
          </div>
        </div>

        <div className="page-x mt-6 flex-1 overflow-hidden border-t border-line pt-6">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={role.id}
              id={PANEL_ID}
              role="tabpanel"
              aria-labelledby={`tab-${role.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: EASE_LEDGER }}
            >
              <ExperienceDetail role={role} dense />
            </m.div>
          </AnimatePresence>
        </div>

        <p className="label page-x flex justify-between pb-5 text-dim" aria-hidden="true">
          <span>
            Trace {String(active + 1).padStart(2, '0')} / {String(experience.length).padStart(2, '0')}
          </span>
          <span>Scroll to advance · ← → to step</span>
        </p>
      </div>
    </section>
  )
}

function StackedTrace() {
  return (
    <section id="trace" aria-labelledby="trace-title" className="page-x py-24 lg:py-36">
      <Heading />
      <ol className="relative mt-14 before:absolute before:top-2 before:bottom-0 before:left-[5px] before:w-px before:bg-line lg:mt-20">
        {experience.map((role) => (
          <li key={role.id} className={`relative pl-9 ${role.weight === 'foundation' ? 'pb-14' : 'pb-20'}`}>
            <span
              aria-hidden="true"
              className={`absolute top-1 left-0 block size-[11px] rotate-45 border ${
                role.end ? 'border-fog/60 bg-ground' : 'border-ember bg-ember'
              }`}
            />
            <p className="label mb-5 text-dim">
              Trace / {startYear(role.start)}
            </p>
            <ExperienceDetail role={role} />
          </li>
        ))}
        <li className="relative pl-9" aria-label="Now">
          <span aria-hidden="true" className="absolute top-1.5 left-0 block h-px w-[11px] bg-ember" />
          <p className="label text-ember">Now</p>
        </li>
      </ol>
    </section>
  )
}

export function CareerTrace() {
  const choreographed = useChoreography()
  return choreographed ? <ChoreographedTrace /> : <StackedTrace />
}
