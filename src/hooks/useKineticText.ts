import { useEffect, type RefObject } from 'react'
import { loadGsap } from '../lib/motion'

let splitText: Promise<typeof import('gsap/SplitText')['SplitText']> | null = null

function loadSplitText() {
  splitText ??= Promise.all([loadGsap(), import('gsap/SplitText')]).then(([{ gsap }, { SplitText }]) => {
    gsap.registerPlugin(SplitText)
    return SplitText
  })
  return splitText
}

/**
 * Headline characters rise out of a per-word mask and cool from ember to their resting colour.
 * SplitText keeps the full string as the element's accessible name and hides the fragments.
 * Splitting waits until the heading is within a viewport of the fold so the initial page stays light,
 * and plays once its top crosses 88% of the viewport.
 */
export function useKineticText(ref: RefObject<HTMLElement | null>, heat = '#ff6a2b') {
  useEffect(() => {
    const el = ref.current
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let split: { revert: () => void } | undefined
    let play: IntersectionObserver | undefined
    let cancelled = false
    let played = false

    const prepare = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        prepare.disconnect()
        Promise.all([loadGsap(), loadSplitText()]).then(([{ gsap }, SplitText]) => {
          if (cancelled) return
          split = SplitText.create(el, {
            type: 'words,chars',
            mask: 'words',
            aria: 'auto',
            autoSplit: true,
            onSplit: (self) => {
              if (played) return
              const tl = gsap
                .timeline({ paused: true })
                .from(self.chars, { yPercent: 115, rotate: 7, duration: 0.95, ease: 'expo.out', stagger: 0.018 })
                .from(self.chars, { color: heat, duration: 1.1, ease: 'power2.out', stagger: 0.018 }, 0.15)
              play?.disconnect()
              play = new IntersectionObserver(
                ([hit]) => {
                  if (!hit?.isIntersecting) return
                  play?.disconnect()
                  played = true
                  tl.play()
                },
                { rootMargin: '0px 0px -12% 0px' },
              )
              play.observe(el)
              return tl
            },
          })
        })
      },
      { rootMargin: '0px 0px 100% 0px' },
    )
    prepare.observe(el)

    return () => {
      cancelled = true
      prepare.disconnect()
      play?.disconnect()
      split?.revert()
    }
  }, [ref, heat])
}
