import { useMemo, useState, type MouseEvent } from 'react'
import { buildKinds, builds, kindLabel, type BuildKind } from '../../data/builds'
import { goToSection } from '../../lib/navigate'
import { InlineList } from '../projects/CaseFile'
import { BuildCover } from './BuildMedia'

type Filter = 'all' | BuildKind

/** Shared by the list covers and the preview so the first image resolves to one URL at every width. */
const coverSizes = '(min-width: 64rem) 45vw, 92vw'

const numberOf = (slug: string) =>
  String(builds.findIndex((b) => b.slug === slug) + 1).padStart(2, '0')

function onOpen(event: MouseEvent<HTMLAnchorElement>, slug: string) {
  if (event.metaKey || event.ctrlKey) return
  event.preventDefault()
  goToSection(slug)
}

/**
 * Filterable build list. On large screens a sticky panel beside it shows the build under the pointer or
 * keyboard focus; on smaller screens each entry carries its own cover image instead.
 */
export function BuildIndex() {
  const [filter, setFilter] = useState<Filter>('all')
  const visible = useMemo(
    () => (filter === 'all' ? builds : builds.filter((b) => b.kind === filter)),
    [filter],
  )
  const [hovered, setHovered] = useState(builds[0]!.slug)
  const active = visible.some((b) => b.slug === hovered) ? hovered : visible[0]!.slug
  const [seen, setSeen] = useState(() => new Set([active]))
  if (!seen.has(active)) setSeen(new Set(seen).add(active))

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: builds.length },
    ...buildKinds.map((k) => ({
      id: k.id,
      label: k.label,
      count: builds.filter((b) => b.kind === k.id).length,
    })),
  ]
  const current = builds.find((b) => b.slug === active)!

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Filter builds" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const pressed = filter === f.id
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => setFilter(f.id)}
              className={`label flex items-baseline gap-2 border px-3.5 py-2.5 transition-[color,border-color,background-color] duration-200 ${
                pressed
                  ? 'border-ember bg-ember text-graphite'
                  : 'border-line text-fog hover:border-fog hover:text-paper'
              }`}
            >
              {f.label}
              <span className={`tabular-nums ${pressed ? 'text-graphite' : 'text-dim'}`}>
                {String(f.count).padStart(2, '0')}
              </span>
            </button>
          )
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} of {builds.length} builds
      </p>

      <div className="ledger-grid gap-y-10">
        <ol className="col-span-full border-t border-line lg:col-span-6">
          {visible.map((b, i) => {
            const isActive = b.slug === active
            return (
              <li key={b.slug} className="border-b border-line">
                <a
                  href={`#${b.slug}`}
                  onClick={(e) => onOpen(e, b.slug)}
                  onMouseEnter={() => setHovered(b.slug)}
                  onFocus={() => setHovered(b.slug)}
                  data-cursor="Open build"
                  data-active={isActive || undefined}
                  className="group relative grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-5 sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:gap-x-4"
                >
                  <BuildCover
                    build={b}
                    decorative
                    eager={i === 0}
                    sizes={coverSizes}
                    className="col-span-full mb-5 lg:hidden"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute bottom-[-1px] left-0 hidden h-px w-full origin-left scale-x-0 bg-ember-gradient transition-transform duration-500 ease-(--ease-ledger) group-hover:scale-x-100 group-data-active:scale-x-100 lg:block"
                  />
                  <span className="label text-ember tabular-nums">{numberOf(b.slug)}</span>
                  <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-[clamp(1.375rem,1rem+1.4vw,2.125rem)] leading-[1.05] font-semibold tracking-[-0.035em] text-paper transition-transform duration-300 ease-(--ease-ledger) lg:group-hover:translate-x-1 lg:group-data-active:translate-x-1">
                      {b.name}
                    </span>
                    <span className="text-[0.95rem] text-fog">{b.tagline}</span>
                  </span>
                  <span className="label flex items-baseline gap-3 text-dim transition-colors group-hover:text-fog">
                    <span className="hidden sm:inline">{kindLabel(b.kind)}</span>
                    <span aria-hidden="true" className="text-ember">
                      ↓
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ol>

        <div aria-hidden="true" className="hidden lg:col-span-6 lg:block">
          <div className="sticky top-[calc(var(--spacing-nav)+2rem)] flex flex-col gap-5">
            <div className="relative aspect-[16/10]">
              {builds
                .filter((b) => seen.has(b.slug))
                .map((b) => (
                  <div
                    key={b.slug}
                    className={`absolute inset-0 transition-opacity duration-500 ease-(--ease-ledger) ${
                      b.slug === active ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <BuildCover
                      build={b}
                      decorative
                      eager={b.slug === visible[0]!.slug}
                      sizes={coverSizes}
                      className="h-full"
                    />
                  </div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
              <p className="label flex justify-between gap-4 text-dim">
                <span>
                  <span className="text-ember tabular-nums">{numberOf(current.slug)}</span> /{' '}
                  {current.name}
                </span>
                <span>{current.client ?? kindLabel(current.kind)}</span>
              </p>
              <p className="max-w-[52ch] text-[0.95rem] leading-relaxed text-fog">
                {current.summary}
              </p>
              <InlineList items={current.stack} className="meta text-dim" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
