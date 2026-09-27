import type { MouseEvent } from 'react'
import { isHomePage, primaryNav, sectionHref } from '../../data/navigation'
import { profile } from '../../data/profile'
import type { SectionEntry } from '../../data/types'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { goToSection } from '../../lib/navigate'
import { Magnetic } from '../motion/Magnetic'
import { SectionIndicator } from './SectionIndicator'

type Props = {
  sections: SectionEntry[]
  onOpenPalette: () => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

function onAnchorClick(event: MouseEvent<HTMLAnchorElement>) {
  const href = event.currentTarget.getAttribute('href')
  if (!href?.startsWith('#') || event.metaKey || event.ctrlKey) return
  event.preventDefault()
  goToSection(href.slice(1) || 'top')
}

export function SiteNav({ sections, onOpenPalette }: Props) {
  const progressRef = useScrollProgress<HTMLDivElement>()
  const home = isHomePage()

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-ground/95 backdrop-blur-md">
      <nav aria-label="Primary" className="page-x flex h-(--spacing-nav) items-center justify-between gap-6">
        <a
          href={home ? '#top' : '/'}
          onClick={onAnchorClick}
          className="group flex items-baseline gap-3"
        >
          <span className="text-[0.95rem] font-semibold tracking-[-0.02em]">{profile.name}</span>
          <span className="label hidden text-dim sm:inline">SE / LK</span>
        </a>

        <div className="hidden lg:block">
          <SectionIndicator sections={sections} />
        </div>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center md:flex">
            {primaryNav.map((item) => {
              const current = 'page' in item && !home
              return (
                <li key={item.label}>
                  <a
                    href={'page' in item ? item.page : sectionHref(item.section)}
                    onClick={onAnchorClick}
                    aria-current={current ? 'page' : undefined}
                    className={`label group relative inline-block px-3 py-2 transition-colors duration-200 hover:text-paper ${
                      current ? 'text-paper' : 'text-fog'
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-1 h-px origin-left bg-ember transition-transform duration-300 ease-(--ease-ledger) group-hover:scale-x-100 ${
                        current ? 'scale-x-100' : 'scale-x-0'
                      }`}
                    />
                  </a>
                </li>
              )
            })}
          </ul>
          <Magnetic strength={0.25} reach={28} className="ml-2">
            <button
              type="button"
              onClick={onOpenPalette}
              aria-haspopup="dialog"
              aria-keyshortcuts={isMac ? 'Meta+K' : 'Control+K'}
              className="label flex items-center gap-2 border border-line px-3 py-2 text-fog transition-[color,border-color,box-shadow] duration-300 hover:border-ember hover:text-paper hover:shadow-[0_0_24px_-6px_rgba(255,106,43,0.55)]"
            >
              <span>Index</span>
              <kbd className="hidden font-mono text-dim md:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
          </Magnetic>
        </div>
      </nav>
      <div ref={progressRef} className="relative h-px bg-line" aria-hidden="true">
        <div className="absolute inset-y-0 left-0 w-full origin-left scale-x-(--progress) bg-ember-gradient" />
      </div>
    </header>
  )
}
