import { useState } from 'react'
import { kindLabel, type Build } from '../../data/builds'
import { BuildPicture, BuildPoster } from './BuildMedia'

function Gallery({ build }: { build: Build }) {
  const [index, setIndex] = useState(0)
  const shot = build.shots[index]
  if (!shot) return <BuildPoster build={build} />

  return (
    <div className="flex flex-col gap-3">
      <figure className="aspect-[16/10] overflow-hidden border border-line bg-charcoal">
        <BuildPicture
          key={shot.id}
          build={build}
          shot={shot}
          sizes="(min-width: 64rem) 62vw, 92vw"
          className="h-full w-full object-contain"
        />
        <figcaption className="sr-only">{shot.alt}</figcaption>
      </figure>
      {build.shots.length > 1 && (
        <ul className="grid grid-cols-4 gap-2 sm:gap-3" aria-label={`${build.name} screenshots`}>
          {build.shots.map((s, i) => {
            const pressed = i === index
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={pressed}
                  aria-label={`Show screenshot ${i + 1} of ${build.shots.length}: ${s.alt}`}
                  onClick={() => setIndex(i)}
                  className={`block aspect-[16/10] w-full overflow-hidden border bg-charcoal transition-colors duration-200 ${
                    pressed ? 'border-ember' : 'border-line hover:border-fog'
                  }`}
                >
                  <BuildPicture
                    build={build}
                    shot={s}
                    decorative
                    sizes="(min-width: 64rem) 14vw, 22vw"
                    className="h-full w-full object-contain"
                  />
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/** One build as a record: identity and links on the left, screens, features and stack on the right. */
export function BuildDetail({ build, number }: { build: Build; number: string }) {
  const titleId = `${build.slug}-title`
  return (
    <article
      id={build.slug}
      aria-labelledby={titleId}
      className="border-t border-line py-16 lg:py-24"
    >
      <div className="ledger-grid gap-y-10">
        <header className="col-span-full flex flex-col gap-5 lg:sticky lg:top-[calc(var(--spacing-nav)+2rem)] lg:col-span-4 lg:self-start">
          <p className="label flex items-center gap-3 text-ember">
            <span className="tabular-nums">{number}</span>
            <span aria-hidden="true" className="h-px w-8 bg-ember-gradient" />
            <span>{kindLabel(build.kind)}</span>
          </p>
          <h2
            id={titleId}
            tabIndex={-1}
            className="text-[clamp(2.25rem,1rem+3.6vw,4rem)] leading-[0.92] tracking-[-0.05em] outline-none"
          >
            {build.name}
          </h2>
          {build.client && <p className="label text-dim">{build.client}</p>}
          <p className="max-w-[46ch] text-fog">{build.summary}</p>
          {build.links.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {build.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label inline-flex items-center gap-2 border border-line px-3.5 py-2.5 text-paper transition-[color,border-color,box-shadow] duration-300 hover:border-ember hover:shadow-[0_0_24px_-6px_rgba(255,106,43,0.55)]"
                  >
                    {link.label}
                    <span aria-hidden="true" className="text-ember">
                      ↗
                    </span>
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {build.note && (
            <p className="meta max-w-[46ch] border-l border-ember/60 pl-3 text-dim">{build.note}</p>
          )}
        </header>

        <div className="col-span-full flex flex-col gap-10 lg:col-span-8">
          <Gallery build={build} />
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] md:gap-8">
            <div>
              <p className="label text-dim">What it does</p>
              <ol className="mt-4 border-t border-line">
                {build.features.map((f, i) => (
                  <li key={f} className="flex gap-4 border-b border-line py-3.5">
                    <span className="label pt-1 text-ember tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[0.95rem] leading-relaxed text-paper/90">{f}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <p className="label text-dim">Stack</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {build.stack.map((s) => (
                  <li key={s} className="meta border border-line px-2.5 py-1 text-fog">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
