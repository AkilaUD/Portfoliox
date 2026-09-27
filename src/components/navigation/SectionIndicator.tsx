import { AnimatePresence, m } from 'motion/react'
import { useMemo } from 'react'
import type { SectionEntry } from '../../data/types'
import { useActiveSection } from '../../hooks/useActiveSection'
import { EASE_LEDGER } from '../../lib/motion'

export function SectionIndicator({ sections }: { sections: SectionEntry[] }) {
  const ids = useMemo(() => sections.map((s) => s.id), [sections])
  const activeId = useActiveSection(ids)
  const active = sections.find((s) => s.id === activeId) ?? sections[0]!

  return (
    <p className="label flex items-center gap-2 text-dim" aria-live="off">
      <span aria-hidden="true">§</span>
      <span className="relative inline-flex h-[1.4em] min-w-[11rem] overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={active.id}
            className="whitespace-nowrap"
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_LEDGER }}
          >
            <span className="text-ember tabular-nums">{active.index}</span>
            <span className="text-fog"> / {active.label}</span>
          </m.span>
        </AnimatePresence>
      </span>
    </p>
  )
}
