import type { ReactNode } from 'react'
import { firstMicro } from '../../data/projects'

type Props = {
  focus: number | null
  onFocus: (index: number | null) => void
}

const layer = (id: string) => firstMicro.layers.find((l) => l.id === id)!

function Band({
  id,
  label,
  callout,
  calloutIndex,
  lit = false,
  children,
}: {
  id: string
  label: string
  callout?: string
  calloutIndex?: string
  lit?: boolean
  children: ReactNode
}) {
  return (
    <div
      data-fm={id}
      className="grid grid-cols-1 gap-2 md:grid-cols-[6.5rem_minmax(0,1fr)] md:items-center md:gap-4 xl:grid-cols-[6.5rem_minmax(0,1fr)_13rem]"
    >
      <span className="label text-dim">{label}</span>
      <div
        className={`relative border px-4 py-3 transition-colors duration-300 ${
          lit ? 'border-ember/70 bg-ember/[0.04]' : 'border-line bg-charcoal/40'
        }`}
      >
        {children}
      </div>
      {callout && (
        <p
          data-fm="callout"
          className="label relative flex gap-2 text-ember md:col-start-2 xl:col-start-auto xl:pl-5 xl:before:absolute xl:before:top-[0.6em] xl:before:left-0 xl:before:h-px xl:before:w-3 xl:before:bg-ember/60"
        >
          <span className="text-ember tabular-nums">C{calloutIndex}</span>
          <span className="text-paper/85 normal-case tracking-normal">{callout}</span>
        </p>
      )}
    </div>
  )
}

/** Simplified FirstMicro system map: tenants, interface, loan lifecycle, API, services and data. */
export function ArchitectureFlow({ focus, onFocus }: Props) {
  const stages = firstMicro.lifecycle!
  const focused = focus !== null ? stages[focus] : null

  return (
    <figure aria-labelledby="fm-diagram-caption" className="flex flex-col gap-3">
      <figcaption id="fm-diagram-caption" className="sr-only">
        FirstMicro system map. Tenants use an Angular 17+ interface over the loan lifecycle: {stages.join(', ')}. An
        ASP.NET Core 8 API sits beneath, with planned notification, reporting and loan-processing services, on Azure SQL
        with Entity Framework Core.
      </figcaption>

      <Band id="tenants" label="Tenants">
        <ul className="flex flex-wrap items-center gap-2" aria-label="Multi-tenant institutions">
          {['Institution', 'Institution', 'Institution'].map((t, i) => (
            <li key={i} className="label border border-dashed border-fog/40 px-2.5 py-1 text-fog">
              {t}
            </li>
          ))}
          <li className="label text-dim">+ n · multi-tenant</li>
        </ul>
      </Band>

      <Band id="interface" label="Interface" callout={layer('interface').callout} calloutIndex="01" lit={focus !== null}>
        <p className="meta flex flex-wrap justify-between gap-2 text-fog">
          <span className="text-paper">{layer('interface').tech}</span>
          <span className="text-dim">Loan-management dashboard</span>
        </p>
      </Band>

      <div data-fm="lifecycle" className="grid grid-cols-1 gap-2 md:grid-cols-[6.5rem_minmax(0,1fr)] md:gap-4 xl:grid-cols-[6.5rem_minmax(0,1fr)_13rem]">
        <span className="label pt-1 text-dim md:pt-4">Loan lifecycle</span>
        <ol className="relative flex flex-col gap-0 border border-line bg-charcoal/40 px-4 py-4 lg:grid lg:grid-cols-6 lg:px-2 xl:col-span-2">
          {stages.map((stage, i) => {
            const isFocus = focus === i
            const dim = focus !== null && !isFocus
            const linkLit = focus !== null && (focus === i || focus === i + 1)
            return (
              <li key={stage} data-fm="flow-node" className="relative flex lg:flex-col lg:items-center">
                {i < stages.length - 1 && (
                  <span
                    aria-hidden="true"
                    data-fm="flow-link"
                    className={`absolute top-6 left-[5px] h-[calc(100%-0.5rem)] w-px origin-top transition-colors duration-300 lg:top-[0.95rem] lg:left-1/2 lg:h-px lg:w-full lg:origin-left ${
                      linkLit ? 'bg-ember' : 'bg-line'
                    }`}
                  />
                )}
                <button
                  type="button"
                  data-cursor="Trace"
                  onMouseEnter={() => onFocus(i)}
                  onMouseLeave={() => onFocus(null)}
                  onFocus={() => onFocus(i)}
                  onBlur={() => onFocus(null)}
                  aria-describedby={`fm-note-${i}`}
                  className={`group relative z-10 flex items-start gap-4 pb-5 text-left transition-opacity duration-300 lg:flex-col lg:items-center lg:gap-3 lg:px-1 lg:pb-1 lg:text-center ${
                    dim ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1 block size-[11px] shrink-0 rotate-45 border transition-colors duration-300 lg:mt-2.5 ${
                      isFocus ? 'border-ember bg-ember' : 'border-fog/70 bg-ground group-hover:border-ember'
                    }`}
                  />
                  <span className="flex flex-col gap-1">
                    <span className="label text-dim tabular-nums">S{String(i + 1).padStart(2, '0')}</span>
                    <span className="text-[0.9rem] leading-tight tracking-[-0.01em] text-paper lg:text-[0.74rem] xl:text-[0.8rem]">{stage}</span>
                    <span id={`fm-note-${i}`} className="meta text-fog lg:sr-only">
                      {firstMicro.lifecycleNotes[stage]}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      <Band id="api" label="API" callout={`${layer('api').callout} · API design`} calloutIndex="02" lit={focus !== null}>
        <p className="meta flex flex-wrap justify-between gap-2 text-fog">
          <span className="text-paper">{layer('api').tech}</span>
          <span className="text-dim">REST</span>
        </p>
      </Band>

      <Band id="services" label="Services" callout="Microservices decomposition planning" calloutIndex="03">
        <ul className="flex flex-wrap gap-2" aria-label="Planned service boundaries">
          {firstMicro.plannedServices.map((s) => (
            <li key={s} data-fm="service" className="label border border-dashed border-fog/40 px-2.5 py-1 text-fog">
              {s}
            </li>
          ))}
          <li className="label self-center text-dim">Planned boundaries</li>
        </ul>
      </Band>

      <Band
        id="data"
        label="Data"
        callout="EF Core integration · query optimization for slow report loads"
        calloutIndex="04"
        lit={focus !== null}
      >
        <p className="meta flex flex-wrap justify-between gap-2 text-fog">
          <span className="text-paper">{layer('data').tech}</span>
          <span className="text-dim">Reporting queries</span>
        </p>
      </Band>

      <p aria-live="polite" className="meta mt-3 hidden min-h-[3em] border-t border-line pt-3 text-fog lg:block">
        {focused ? (
          <>
            <span className="label mr-3 text-ember">
              S{String(focus! + 1).padStart(2, '0')} / {focused}
            </span>
            {firstMicro.lifecycleNotes[focused]}
          </>
        ) : (
          <span className="text-dim">Hover or focus a lifecycle stage to trace it through the platform layers.</span>
        )}
      </p>
    </figure>
  )
}
