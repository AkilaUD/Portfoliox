import { useEffect } from 'react'

const tones: Record<string, string> = {
  plum: '#1c0e14',
  ember: '#1a0c08',
}

/**
 * Shifts the page ground while a `[data-tone]` section crosses the middle of the viewport.
 * The colour itself interpolates through the registered `--ground` property in CSS.
 */
export function useGroundShift() {
  useEffect(() => {
    const root = document.documentElement
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-tone]'))
    const active = new Set<HTMLElement>()
    const apply = () => {
      const current = [...active].at(-1)
      const tone = current ? tones[current.dataset.tone ?? ''] : undefined
      if (tone) root.style.setProperty('--ground', tone)
      else root.style.removeProperty('--ground')
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? active.add(e.target as HTMLElement) : active.delete(e.target as HTMLElement)))
        apply()
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => {
      observer.disconnect()
      root.style.removeProperty('--ground')
    }
  }, [])
}
