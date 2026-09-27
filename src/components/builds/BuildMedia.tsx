import { kindLabel, shotSrc, shotSrcSet, type Build, type BuildShot } from '../../data/builds'
import { InlineList } from '../projects/CaseFile'

type PictureProps = {
  build: Build
  shot: BuildShot
  sizes: string
  className?: string
  eager?: boolean
  /** Duplicate of an image described elsewhere on the page. */
  decorative?: boolean
}

/** The screenshot exactly as captured: no overlays, filters or blend layers on top of the pixels. */
export function BuildPicture({
  build,
  shot,
  sizes,
  className = 'h-auto w-full',
  eager = false,
  decorative = false,
}: PictureProps) {
  const largest = shot.sizes.at(-1)!
  return (
    <picture>
      <source type="image/avif" srcSet={shotSrcSet(build.slug, shot, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={shotSrcSet(build.slug, shot, 'webp')} sizes={sizes} />
      <img
        src={shotSrc(build.slug, shot, 'webp', largest)}
        alt={decorative ? '' : shot.alt}
        width={shot.width}
        height={shot.height}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : undefined}
        decoding="async"
        className={`block ${className}`}
      />
    </picture>
  )
}

/** Typographic stand-in for builds that have no screenshots. */
export function BuildPoster({
  build,
  className = '',
  decorative = false,
}: {
  build: Build
  className?: string
  decorative?: boolean
}) {
  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : `${build.name}: ${build.tagline}. No screenshots.`}
      aria-hidden={decorative || undefined}
      className={`relative flex aspect-[16/10] flex-col justify-between overflow-hidden border border-line bg-charcoal p-5 sm:p-8 ${className}`}
    >
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-ember-gradient" />
      <p aria-hidden="true" className="label flex justify-between gap-4 text-dim">
        <span>{kindLabel(build.kind)}</span>
        <span>No screenshots</span>
      </p>
      <div aria-hidden="true">
        <p className="text-[clamp(2rem,0.75rem+4.5vw,5rem)] leading-[0.85] font-semibold tracking-[-0.055em] text-paper">
          {build.name}
        </p>
        <p className="mt-3 max-w-[32ch] text-[0.95rem] text-fog">{build.tagline}</p>
      </div>
      <div aria-hidden="true" className="hidden sm:block">
        <InlineList items={build.stack.slice(0, 5)} className="meta text-dim" />
      </div>
    </div>
  )
}

/**
 * First screenshot in a fixed 16:10 frame, or the typographic card when there is none.
 * Square artwork is letterboxed rather than cropped.
 */
export function BuildCover({
  build,
  sizes,
  className = '',
  eager,
  decorative,
}: {
  build: Build
  sizes: string
  className?: string
  eager?: boolean
  decorative?: boolean
}) {
  const shot = build.shots[0]
  if (!shot) return <BuildPoster build={build} className={className} decorative={decorative} />
  return (
    <div className={`aspect-[16/10] overflow-hidden border border-line bg-charcoal ${className}`}>
      <BuildPicture
        build={build}
        shot={shot}
        sizes={sizes}
        eager={eager}
        decorative={decorative}
        className="h-full w-full object-contain"
      />
    </div>
  )
}
