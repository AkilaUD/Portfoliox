import { m } from 'motion/react'
import { experience } from '../../data/experience'
import { vDeploy } from '../../data/projects'
import { formatRange } from '../../lib/dates'
import { EASE_LEDGER } from '../../lib/motion'
import { SectionLabel } from '../common/SectionLabel'
import { CaseFileHeader, InlineList } from './CaseFile'

const role = experience.find((e) => e.id === 'vdeploy')!

/** Request pattern schematic: full-page reloads versus partial asynchronous updates. Illustrative only. */
function RequestSchematic() {
  const rows = [
    { label: 'Full reload', ticks: [0, 1, 2, 3], width: 'w-[22%]', tone: 'bg-fog/25' },
    { label: 'jQuery AJAX', ticks: [0, 1, 2, 3, 4, 5, 6, 7], width: 'w-[7%]', tone: 'bg-ember/80' },
  ]
  return (
    <m.figure
      className="border border-line p-5"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.6 }}
    >
      <figcaption className="label flex justify-between text-dim">
        <span>Schematic / request pattern</span>
        <span>Not measured data</span>
      </figcaption>
      <div className="mt-5 flex flex-col gap-4" aria-hidden="true">
        {rows.map((row, ri) => (
          <div key={row.label} className="grid grid-cols-[6.5rem_1fr] items-center gap-4">
            <span className="label text-fog">{row.label}</span>
            <div className="relative flex h-4 items-center gap-[3%] overflow-hidden">
              {row.ticks.map((t) => (
                <m.span
                  key={t}
                  className={`block h-full shrink-0 ${row.width} ${row.tone}`}
                  variants={{ hidden: { scaleX: 0 }, shown: { scaleX: 1 } }}
                  style={{ originX: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + ri * 0.3 + t * 0.06, ease: EASE_LEDGER }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="sr-only">
        Illustration: moving from full page reloads to asynchronous partial updates with jQuery AJAX, which reduced
        server roundtrips.
      </p>
    </m.figure>
  )
}

export function VDeployCase() {
  return (
    <section id="origin" aria-labelledby="vdeploy-title" className="page-x py-24 lg:py-32">
      <div className="ledger-grid gap-y-10">
        <div className="col-span-full lg:col-span-3">
          <SectionLabel index="08" tone="fog">
            Origin
          </SectionLabel>
          <p className="label mt-3 text-dim">{formatRange(role.start, role.end)}</p>
        </div>

        <div className="col-span-full flex flex-col gap-6 md:col-span-4 lg:col-span-4">
          <CaseFileHeader
            caseNumber={vDeploy.caseNumber}
            title={vDeploy.title}
            domain={[...vDeploy.domain, 'Internship']}
            titleId="vdeploy-title"
            size="minor"
          />
          <p className="max-w-[40ch] text-fog">{vDeploy.summary}</p>
          <InlineList items={vDeploy.stack} className="meta text-dim" />
        </div>

        <div className="col-span-full flex flex-col gap-8 md:col-span-4 lg:col-span-5">
          <ol className="border-t border-line">
            {vDeploy.contributions.map((c, i) => (
              <li key={c} className="flex gap-4 border-b border-line py-3.5">
                <span className="label pt-1 text-ember tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-[0.95rem] leading-relaxed text-paper/90">{c}</span>
              </li>
            ))}
          </ol>
          <RequestSchematic />
        </div>
      </div>
    </section>
  )
}
