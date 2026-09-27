import type { MouseEvent } from 'react'
import { eFinancials, firstMicro, vDeploy } from '../../data/projects'
import { goToSection } from '../../lib/navigate'

const cases = [
  { id: 'work', project: firstMicro, note: 'Current' },
  { id: 'efinancials', project: eFinancials, note: '2022 – 2024' },
  { id: 'origin', project: vDeploy, note: 'Origin' },
]

function onClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.metaKey || event.ctrlKey) return
  event.preventDefault()
  goToSection(id)
}

/** Chapter index that opens the case files: the only place the "Open case" pointer label appears. */
export function CaseIndex() {
  return (
    <nav aria-label="Case files" className="page-x">
      <ol className="flex flex-col border-y border-line md:flex-row">
        {cases.map((c) => (
          <li key={c.id} className="flex-1 border-b border-line last:border-b-0 md:border-r md:border-b-0 md:last:border-r-0">
            <a
              href={`#${c.id}`}
              onClick={(e) => onClick(e, c.id)}
              data-cursor="Open case"
              className="group relative isolate flex items-baseline justify-between gap-4 overflow-hidden py-4 md:px-5"
            >
              <span
                aria-hidden="true"
                className="bg-ember-gradient absolute inset-0 -z-10 translate-y-full opacity-[0.12] transition-transform duration-500 ease-(--ease-molten) group-hover:translate-y-0 group-focus-visible:translate-y-0"
              />
              <span
                aria-hidden="true"
                className="bg-ember-gradient absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-500 ease-(--ease-ledger) group-hover:scale-x-100"
              />
              <span className="flex items-baseline gap-3">
                <span className="label text-ember tabular-nums">{c.project.caseNumber}</span>
                <span className="font-medium tracking-[-0.01em] text-paper transition-transform duration-300 group-hover:translate-x-1">
                  {c.project.title}
                </span>
              </span>
              <span className="label text-dim transition-colors group-hover:text-fog">{c.note}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
