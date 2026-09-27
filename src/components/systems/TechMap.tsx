import { useMemo, useState } from 'react'
import { otherCategories, skillBranches } from '../../data/skills'
import type { Skill } from '../../data/types'
import { SectionHeading } from '../common/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { SystemArtifact } from './SystemArtifact'
import { TechLegend } from './TechLegend'
import { TechNode } from './TechNode'

type Selection = { branch: string; skill: string }

function sharesContext(a: Skill, b: Skill) {
  return a !== b && !!a.contexts?.some((c) => b.contexts?.includes(c))
}

export function TechMap() {
  const [selected, setSelected] = useState<Selection | null>(null)
  const [preview, setPreview] = useState<Selection | null>(null)
  const active = preview ?? selected

  const activeBranch = useMemo(
    () => skillBranches.find((b) => b.id === active?.branch) ?? null,
    [active],
  )
  const activeSkill = useMemo(
    () => activeBranch?.skills.find((s) => s.name === active?.skill) ?? null,
    [activeBranch, active],
  )

  return (
    <section id="systems" aria-labelledby="systems-title" className="page-x py-28 lg:py-40">
      <SectionHeading
        index="06"
        label="Systems map"
        id="systems-title"
        aside={
          <p className="meta max-w-[56ch] text-dim">
            No scores, no percentages. Each entry is placed by where it sits in a system and linked
            to where it appears on the CV.
          </p>
        }
      >
        The stack, mapped by layer.
      </SectionHeading>

      <div className="ledger-grid mt-16 gap-y-12 lg:mt-24">
        <div className="col-span-full lg:col-span-3">
          <div className="lg:sticky lg:top-[calc(var(--spacing-nav)+2rem)]">
            <p className="label flex items-center gap-3 text-paper">
              <span aria-hidden="true" className="block size-2.5 rotate-45 border border-ember" />
              Akila / engineering stack
            </p>
            <div className="mt-6">
              <TechLegend skill={activeSkill} branch={activeBranch} />
            </div>
            <SystemArtifact className="mt-12 hidden xl:flex" />
          </div>
        </div>

        <div className="col-span-full lg:col-span-9">
          <div className="relative">
            <span aria-hidden="true" className="absolute top-0 bottom-6 left-[5px] w-px bg-line" />
            <ul className="flex flex-col">
              {skillBranches.map((branch, bi) => {
                const branchActive = active?.branch === branch.id
                const dimBranch =
                  active !== null &&
                  !branchActive &&
                  !branch.skills.some((s) => activeSkill && sharesContext(activeSkill, s))
                return (
                  <Reveal
                    as="li"
                    key={branch.id}
                    delay={bi * 0.05}
                    className="relative pb-10 pl-10 last:pb-0"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-[0.55rem] left-0 block h-px w-7 transition-colors duration-300 ${
                        branchActive ? 'bg-ember' : 'bg-line'
                      }`}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute top-[0.3rem] left-[1px] block size-[9px] rotate-45 border transition-colors duration-300 ${
                        branchActive ? 'border-ember bg-ember' : 'border-fog/60 bg-ground'
                      }`}
                    />
                    <h3
                      className={`label flex items-baseline gap-3 transition-colors duration-300 ${
                        branchActive ? 'text-ember' : dimBranch ? 'text-dim' : 'text-fog'
                      }`}
                    >
                      <span className="tabular-nums">B{String(bi + 1).padStart(2, '0')}</span>
                      {branch.label}
                      <span className="text-dim">/ {branch.skills.length}</span>
                    </h3>
                    <ul
                      className="mt-4 flex flex-wrap gap-2"
                      aria-label={`${branch.label} entries`}
                    >
                      {branch.skills.map((skill) => {
                        const isActive = branchActive && active?.skill === skill.name
                        const related = !!activeSkill && sharesContext(activeSkill, skill)
                        const state = isActive
                          ? 'selected'
                          : related
                            ? 'related'
                            : active && !branchActive
                              ? 'dimmed'
                              : 'idle'
                        return (
                          <li key={skill.name}>
                            <TechNode
                              skill={skill}
                              state={state}
                              onSelect={() =>
                                setSelected((cur) =>
                                  cur?.skill === skill.name && cur.branch === branch.id
                                    ? null
                                    : { branch: branch.id, skill: skill.name },
                                )
                              }
                              onPreview={(on) =>
                                setPreview(on ? { branch: branch.id, skill: skill.name } : null)
                              }
                            />
                          </li>
                        )
                      })}
                    </ul>
                    {branchActive && activeSkill && (
                      <p className="meta mt-4 max-w-[48ch] border-l border-ember pl-3 text-fog lg:hidden">
                        <span className="text-paper">{activeSkill.name}</span> — {activeSkill.note}
                      </p>
                    )}
                  </Reveal>
                )
              })}
            </ul>
          </div>

          <div className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {otherCategories.map((cat) => (
              <div key={cat.label}>
                <h3 className="label text-dim">{cat.label}</h3>
                <ul className="meta mt-3 flex flex-col gap-1 text-fog">
                  {cat.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
