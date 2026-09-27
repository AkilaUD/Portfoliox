import type { CSSProperties, MouseEvent } from 'react'
import { SiteShell } from '../app/SiteShell'
import { SectionLabel } from '../components/common/SectionLabel'
import { BuildDetail } from '../components/builds/BuildDetail'
import { BuildIndex } from '../components/builds/BuildIndex'
import type { Command } from '../components/navigation/CommandPalette'
import { buildKinds, builds, kindLabel } from '../data/builds'
import type { SectionEntry } from '../data/types'
import { goToSection } from '../lib/navigate'

const number = (i: number) => String(i + 1).padStart(2, '0')

const sections: SectionEntry[] = [
  { id: 'top', index: '00', label: 'Workbench' },
  ...builds.map((b, i) => ({ id: b.slug, index: number(i), label: b.name })),
]

const commands: Command[] = builds.map((b) => ({
  id: `build-${b.slug}`,
  label: b.name,
  hint: kindLabel(b.kind),
  group: 'Builds',
  run: () => goToSection(b.slug),
}))

const title = 'Workbench'

function onCaseFiles(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey) return
  event.preventDefault()
  goToSection('work')
}

export default function ProjectsApp() {
  return (
    <SiteShell sections={sections} commands={commands}>
      <section
        id="top"
        aria-labelledby="workbench-title"
        className="page-x pt-32 pb-16 lg:pt-40 lg:pb-24"
      >
        <div className="ledger-grid gap-y-6">
          <div className="col-span-full lg:col-span-3 lg:pt-4">
            <SectionLabel index="00">Projects</SectionLabel>
          </div>
          <div className="col-span-full flex flex-col gap-8 lg:col-span-9">
            <h1
              id="workbench-title"
              tabIndex={-1}
              className="text-[length:var(--text-display)] leading-[0.86] tracking-[-0.055em] outline-none"
            >
              <span className="sr-only">{title}</span>
              <span aria-hidden="true" className="line-mask">
                {[...title].map((char, i) => (
                  <span key={i} className="char-rise" style={{ '--i': i } as CSSProperties}>
                    {i >= 4 ? (
                      <span
                        className="ember-sweep inline-block text-ember-gradient"
                        style={{ animationDelay: `${i * -0.45}s` }}
                      >
                        {char}
                      </span>
                    ) : (
                      char
                    )}
                  </span>
                ))}
              </span>
            </h1>
            <p className="max-w-[46ch] text-[length:var(--text-lede)] leading-(--text-lede--line-height) text-paper/90">
              Products, client sites and tools I’ve built, each run locally to capture the screens
              shown here. Where a build couldn’t be captured, its card says so.
            </p>
            <dl className="flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-5">
              {[
                { label: 'Builds', count: builds.length },
                ...buildKinds.map((k) => ({
                  label: k.label,
                  count: builds.filter((b) => b.kind === k.id).length,
                })),
              ].map((row) => (
                <div key={row.label} className="flex items-baseline gap-2">
                  <dt className="label order-2 text-dim">{row.label}</dt>
                  <dd className="text-[1.5rem] font-semibold tracking-[-0.03em] text-paper tabular-nums">
                    {String(row.count).padStart(2, '0')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        <div className="mt-14 lg:mt-20">
          <BuildIndex />
        </div>
      </section>

      <div className="page-x">
        {builds.map((b, i) => (
          <BuildDetail key={b.slug} build={b} number={number(i)} />
        ))}
      </div>

      <section aria-label="More work" className="page-x pb-24">
        <a
          href="/#work"
          onClick={onCaseFiles}
          data-cursor="Open case"
          className="group flex items-baseline justify-between gap-6 border-y border-line py-8"
        >
          <span className="flex flex-col gap-2">
            <span className="label text-dim">Professional work</span>
            <span className="text-[clamp(1.75rem,1rem+2.4vw,3rem)] leading-none font-semibold tracking-[-0.04em] text-paper transition-transform duration-300 ease-(--ease-ledger) group-hover:translate-x-1">
              Read the case files
            </span>
          </span>
          <span
            aria-hidden="true"
            className="text-[1.5rem] text-ember transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </a>
      </section>
    </SiteShell>
  )
}
