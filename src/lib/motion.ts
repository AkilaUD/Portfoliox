import { useEffect, useState, type RefObject } from 'react'
import { getLenis } from './smoothScroll'

export const EASE_LEDGER = [0.22, 1, 0.36, 1] as const

type GsapModule = typeof import('gsap')['gsap']
type ScrollTriggerModule = typeof import('gsap/ScrollTrigger')['ScrollTrigger']
export type GsapKit = { gsap: GsapModule; ScrollTrigger: ScrollTriggerModule }

let kit: Promise<GsapKit> | null = null
let refreshFrame = 0

/** Several sections build on the same tick; one layout pass covers them all. */
function scheduleRefresh(ScrollTrigger: ScrollTriggerModule) {
  cancelAnimationFrame(refreshFrame)
  refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh())
}

/** GSAP is only needed for the choreographed sections, so it loads on demand. */
export function loadGsap() {
  kit ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
    ([{ gsap }, { ScrollTrigger }]) => {
      gsap.registerPlugin(ScrollTrigger)
      getLenis()?.on('scroll', ScrollTrigger.update)
      return { gsap, ScrollTrigger }
    },
  )
  return kit
}

/**
 * Builds a scroll-driven GSAP setup scoped to `scope` while `enabled` is true.
 * Everything created inside `build` is reverted on cleanup or when `enabled` flips.
 */
export function useScrollChoreography(
  scope: RefObject<HTMLElement | null>,
  enabled: boolean,
  build: (kit: GsapKit, root: HTMLElement) => void,
) {
  useEffect(() => {
    const root = scope.current
    if (!enabled || !root) return
    let ctx: { revert: () => void } | undefined
    let cancelled = false
    loadGsap().then((k) => {
      if (cancelled) return
      ctx = k.gsap.context(() => build(k, root), root)
      scheduleRefresh(k.ScrollTrigger)
    })
    return () => {
      cancelled = true
      ctx?.revert()
    }
    // `build` is intentionally excluded: it is recreated each render but describes a static timeline.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, scope])
}

/**
 * Maps choreographed scroll progress through a section to a discrete step index.
 * Returns null when not choreographed, meaning every step renders in its final state.
 */
export function useScrollStep(
  scope: RefObject<HTMLElement | null>,
  enabled: boolean,
  steps: number,
  start = 'top top',
) {
  const [step, setStep] = useState(0)

  useScrollChoreography(scope, enabled, ({ ScrollTrigger }, root) => {
    ScrollTrigger.create({
      trigger: root,
      start,
      end: 'bottom bottom',
      onUpdate: (self) => {
        setStep(Math.min(steps - 1, Math.floor(self.progress * steps)))
      },
    })
  })

  return enabled ? step : null
}
