import type { KeyboardEvent } from 'react'
import type { Experience } from '../../data/types'
import { startYear } from '../../lib/dates'

type State = 'active' | 'archived' | 'upcoming'

type Props = {
  role: Experience
  state: State
  left: number
  width: number
  panelId: string
  onSelect: () => void
  onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => void
}

/** One role on the horizontal trace: a duration bar with a selectable node at its start. */
export function ExperienceNode({ role, state, left, width, panelId, onSelect, onKeyDown }: Props) {
  const foundation = role.weight === 'foundation'

  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute top-1/2 h-[3px] -translate-y-1/2 transition-colors duration-500 ${
          state === 'active' ? 'bg-ember' : state === 'archived' ? 'bg-fog/35' : 'bg-line'
        }`}
        style={{ left: `${left}%`, width: `${width}%` }}
      />
      <button
        type="button"
        role="tab"
        id={`tab-${role.id}`}
        aria-selected={state === 'active'}
        aria-controls={panelId}
        tabIndex={state === 'active' ? 0 : -1}
        onClick={onSelect}
        onKeyDown={onKeyDown}
        data-cursor="Trace"
        className="group absolute top-0 bottom-0 flex -translate-x-[5px] flex-col justify-between text-left"
        style={{ left: `${left}%` }}
      >
        <span
          className={`label transition-colors duration-300 ${
            state === 'active' ? 'text-ember' : state === 'archived' ? 'text-dim' : 'text-fog'
          }`}
        >
          {startYear(role.start)}
          {state === 'archived' && <span className="ml-2 text-dim">· archived</span>}
        </span>
        <span
          aria-hidden="true"
          className={`block rotate-45 border transition-all duration-300 ${foundation ? 'size-2' : 'size-[11px]'} ${
            state === 'active'
              ? 'border-ember bg-ember'
              : state === 'archived'
                ? 'border-fog/50 bg-ground'
                : 'border-fog bg-ground group-hover:border-ember'
          }`}
        />
        <span
          className={`whitespace-nowrap transition-colors duration-300 ${foundation ? 'text-sm' : 'text-base font-medium'} ${
            state === 'active' ? 'text-paper' : state === 'archived' ? 'text-dim' : 'text-fog group-hover:text-paper'
          }`}
        >
          {role.shortName}
        </span>
      </button>
    </>
  )
}
