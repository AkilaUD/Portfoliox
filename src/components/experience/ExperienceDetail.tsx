import type { Experience } from '../../data/types'
import { formatDuration, formatYearMonth } from '../../lib/dates'

type Props = {
  role: Experience
  /** Tighter vertical rhythm for the sticky, viewport-bound trace panel. */
  dense?: boolean
}

export function ExperienceDetail({ role, dense = false }: Props) {
  const foundation = role.weight === 'foundation'
  const keyItems = role.keyResponsibilities.map((i) => role.responsibilities[i]!)
  const hasMore = role.responsibilities.length > keyItems.length

  return (
    <div className="ledger-grid gap-y-8">
      <div className="col-span-4 lg:col-span-4">
        <p className="label text-ember">
          {foundation ? 'Foundation layer / Internship' : role.end ? 'Previous chapter' : 'Current chapter'}
        </p>
        <h3
          className={`mt-4 leading-[1] font-semibold tracking-[-0.04em] ${
            foundation || dense ? 'text-[clamp(1.6rem,1rem+1.8vw,2.6rem)]' : 'text-title'
          }`}
        >
          {role.company}
        </h3>
        {role.titles ? (
          <ol aria-label="Title progression" className="mt-4 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-fog">
            {role.titles.map((t, i) => (
              <li key={t.role} className="flex items-baseline gap-2">
                {i > 0 && (
                  <span aria-hidden="true" className="text-ember">
                    →
                  </span>
                )}
                <span className={i === role.titles!.length - 1 ? 'text-paper' : undefined}>{t.role}</span>
                {t.from && <span className="meta text-dim">{formatYearMonth(t.from)}</span>}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-4 text-fog">{role.role}</p>
        )}
        <p className="meta mt-2 text-dim">
          <time dateTime={role.start}>{formatYearMonth(role.start)}</time>
          {' – '}
          {role.end ? <time dateTime={role.end}>{formatYearMonth(role.end)}</time> : 'Present'}
          <span className="text-line"> · </span>
          {formatDuration(role.start, role.end)}
        </p>
        <p className="mt-6 max-w-[40ch] text-fog">{role.summary}</p>
      </div>

      <div className="col-span-4 lg:col-span-5">
        <p className="label text-dim">Key contributions</p>
        <ol className="mt-4 border-t border-line">
          {keyItems.map((item, i) => (
            <li key={item} className={`flex gap-4 border-b border-line ${dense ? 'py-2.5' : 'py-3.5'}`}>
              <span className="label pt-1 text-ember tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[0.95rem] leading-relaxed text-paper/90">{item}</span>
            </li>
          ))}
        </ol>
        {hasMore && (
          <details className="group mt-4">
            <summary className="label cursor-pointer list-none text-dim transition-colors hover:text-paper [&::-webkit-details-marker]:hidden">
              <span className="text-ember group-open:hidden">+</span>
              <span className="hidden text-ember group-open:inline">−</span> Full record ({role.responsibilities.length}{' '}
              entries)
            </summary>
            <ol className="mt-3 flex flex-col gap-2">
              {role.responsibilities.map((item, i) =>
                role.keyResponsibilities.includes(i) ? null : (
                  <li key={item} className="meta flex gap-3 text-fog">
                    <span aria-hidden="true" className="text-dim">
                      —
                    </span>
                    {item}
                  </li>
                ),
              )}
            </ol>
          </details>
        )}
      </div>

      <div className={`col-span-full grid grid-cols-2 gap-6 lg:col-span-3 ${dense ? 'lg:gap-4' : 'lg:grid-cols-1'}`}>
        <div>
          <p className="label text-dim">Trace</p>
          <ol className="relative mt-4 flex flex-col gap-2.5 before:absolute before:top-2 before:bottom-2 before:left-[3px] before:w-px before:bg-line">
            {role.trace.map((step, i) => (
              <li key={step} className="label relative flex items-center gap-3 text-fog">
                <span
                  aria-hidden="true"
                  className={`block size-[7px] rotate-45 ${
                    i === role.trace.length - 1 ? 'bg-ember' : 'border border-fog/60 bg-ground'
                  }`}
                />
                {step}
              </li>
            ))}
          </ol>
        </div>
        <div>
          <p className="label text-dim">Systems</p>
          <ul className="mt-4 flex flex-col gap-1.5">
            {role.technologies.map((tech) => (
              <li key={tech} className="meta text-fog">
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
