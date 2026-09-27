import { AnimatePresence, m } from 'motion/react'
import { contextLabels, skillBranches } from '../../data/skills'
import type { Skill, SkillBranch } from '../../data/types'
import { EASE_LEDGER } from '../../lib/motion'

type Props = {
  skill: Skill | null
  branch: SkillBranch | null
}

const total = skillBranches.reduce((sum, b) => sum + b.skills.length, 0)

/** Readout for the selected technology: branch, CV usage and where it appears. */
export function TechLegend({ skill, branch }: Props) {
  return (
    <div className="border-t border-line pt-5" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {skill && branch ? (
          <m.div
            key={skill.name}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_LEDGER }}
          >
            <p className="label text-ember">{branch.label}</p>
            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-paper">{skill.name}</p>
            <p className="mt-3 max-w-[36ch] text-fog">{skill.note}</p>
            <p className="label mt-5 text-dim">
              {skill.contexts?.length
                ? `Seen in / ${skill.contexts.map((c) => contextLabels[c]).join(' · ')}`
                : 'Source / CV skills list'}
            </p>
          </m.div>
        ) : (
          <m.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="label text-dim">
              {total} entries / {skillBranches.length} branches
            </p>
            <p className="mt-3 max-w-[34ch] text-fog">
              Select any entry to see how it appears in the work. Tools used in the same project light up as related.
            </p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
