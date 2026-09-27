import { profile } from '../../data/profile'

const WIDTHS = [700, 1000, 1317] as const
const sizes = '(min-width: 64rem) 46vw, (min-width: 48rem) 74vw, 100vw'
const srcSet = (ext: string) =>
  WIDTHS.map((w) => `/images/portrait-cut-${w}.${ext} ${w}w`).join(', ')

/**
 * The owner's cutout portrait, shown exactly as photographed: no overlays, filters, masks or shaders.
 * It stands in front of the name, so the letters read around the silhouette.
 */
export function HeroPortrait({ className = '' }: { className?: string }) {
  return (
    <picture className={`portrait-rise block ${className}`}>
      <source type="image/avif" srcSet={srcSet('avif')} sizes={sizes} />
      <img
        src="/images/portrait-cut-1000.webp"
        srcSet={srcSet('webp')}
        sizes={sizes}
        width={1317}
        height={964}
        alt={`Portrait of ${profile.name}`}
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-full select-none"
        draggable={false}
      />
    </picture>
  )
}
