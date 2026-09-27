import { LazyMotion, MotionConfig, domAnimation } from 'motion/react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ContextCursor } from '../components/motion/ContextCursor'
import { CommandPalette, type Command } from '../components/navigation/CommandPalette'
import { SiteFooter } from '../components/navigation/SiteFooter'
import { SiteNav } from '../components/navigation/SiteNav'
import type { SectionEntry } from '../data/types'
import { useGroundShift } from '../hooks/useGroundShift'
import { goToSection } from '../lib/navigate'
import { startSmoothScroll, stopSmoothScroll } from '../lib/smoothScroll'

type Props = {
  sections: SectionEntry[]
  children: ReactNode
  /** Extra palette entries for this page, listed before the shared ones. */
  commands?: Command[]
  /** Rendered after the palette, e.g. the one-per-session intro on the home page. */
  overlay?: ReactNode
}

/** Chrome shared by every page: skip link, nav, footer, command palette, cursor and smooth scroll. */
export function SiteShell({ sections, children, commands, overlay }: Props) {
  const [paletteOpen, setPaletteOpen] = useState(false)
  const closePalette = useCallback(() => setPaletteOpen(false), [])
  const openPalette = useCallback(() => setPaletteOpen(true), [])

  useGroundShift()

  useEffect(() => {
    startSmoothScroll()
    return stopSmoothScroll
  }, [])

  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1))
    if (!id || !document.getElementById(id)) return
    let cancelled = false
    void document.fonts.ready.then(() =>
      requestAnimationFrame(() => requestAnimationFrame(() => !cancelled && goToSection(id))),
    )
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only-focusable label fixed top-3 left-3 z-[60] bg-ember px-4 py-3 text-graphite"
        >
          Skip to content
        </a>
        <SiteNav sections={sections} onOpenPalette={openPalette} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <CommandPalette open={paletteOpen} onClose={closePalette} extra={commands} />
        <ContextCursor />
        {overlay}
      </MotionConfig>
    </LazyMotion>
  )
}
