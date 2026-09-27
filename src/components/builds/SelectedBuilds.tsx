import { builds, featuredBuilds, kindLabel } from '../../data/builds'
import { PROJECTS_PATH } from '../../data/navigation'
import { SectionHeading } from '../common/SectionHeading'
import { Reveal } from '../motion/Reveal'
import { InlineList } from '../projects/CaseFile'
import { BuildCover } from './BuildMedia'

const numberOf = (slug: string) =>
  String(builds.findIndex((b) => b.slug === slug) + 1).padStart(2, '0')

/** Home-page teaser: four featured builds, each linking to its record on the projects page. */
export function SelectedBuilds() {
  return (
    <section
      id="builds"
      aria-labelledby="builds-title"
      className="page-x pt-24 pb-6 lg:pt-32 lg:pb-10"
    >
      <SectionHeading
        index="05.1"
        label="Selected builds"
        id="builds-title"
        aside={
          <p className="max-w-[52ch] text-fog">
            Four of the {builds.length} products, client sites and tools on the projects page, with
            screens captured from local runs.
          </p>
        }
      >
        Products, client sites and tools I’ve built.
      </SectionHeading>

      <ul className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-20">
        {featuredBuilds.map((b, i) => (
          <Reveal as="li" key={b.slug} delay={(i % 2) * 0.08}>
            <a
              href={`${PROJECTS_PATH}#${b.slug}`}
              data-cursor="Open build"
              className="group flex flex-col gap-5"
            >
              <BuildCover
                build={b}
                decorative
                sizes="(min-width: 48rem) 45vw, 92vw"
                className="transition-[border-color,box-shadow] duration-300 group-hover:border-ember/70 group-hover:shadow-[0_24px_60px_-30px_rgba(255,106,43,0.45)]"
              />
              <span className="flex flex-col gap-2">
                <span className="label flex justify-between gap-4 text-dim">
                  <span>
                    <span className="text-ember tabular-nums">{numberOf(b.slug)}</span> /{' '}
                    {kindLabel(b.kind)}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-ember transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
                <span className="text-[clamp(1.5rem,1rem+1.6vw,2.25rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-paper">
                  {b.name}
                </span>
                <span className="text-[0.95rem] text-fog">{b.tagline}</span>
              </span>
              <InlineList items={b.stack.slice(0, 5)} className="meta text-dim" />
            </a>
          </Reveal>
        ))}
      </ul>

      <a
        href={PROJECTS_PATH}
        className="group mt-16 flex items-baseline justify-between gap-6 border-y border-line py-7"
      >
        <span className="text-[clamp(1.5rem,1rem+2vw,2.5rem)] leading-none font-semibold tracking-[-0.04em] text-paper transition-transform duration-300 ease-(--ease-ledger) group-hover:translate-x-1">
          All {builds.length} builds
        </span>
        <span className="label flex items-baseline gap-3 text-fog">
          <span className="hidden sm:inline">Workbench</span>
          <span
            aria-hidden="true"
            className="text-[1.25rem] text-ember transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </a>
    </section>
  )
}
