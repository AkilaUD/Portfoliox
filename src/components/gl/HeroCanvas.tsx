import { useEffect, useRef, type RefObject } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = { rootRef: RefObject<HTMLElement | null> }

function webglAvailable() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Progressive WebGL background for the hero. It never draws over the portrait; it only mounts on
 * wide screens with motion allowed, after the page is idle, and tears itself down cleanly.
 */
export function HeroCanvas({ rootRef }: Props) {
  const holderRef = useRef<HTMLDivElement>(null)
  const wide = useMediaQuery('(min-width: 48rem)')
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const root = rootRef.current
    const container = holderRef.current
    if (!wide || reducedMotion || !root || !container) return
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
    if (connection?.saveData || !webglAvailable()) return

    let dispose: (() => void) | undefined
    let cancelled = false
    const mount = () => {
      import('./heroScene')
        .then(({ createHeroScene }) => {
          if (cancelled) return
          dispose = createHeroScene({ container, root })
        })
        .catch(() => {})
    }

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(mount, { timeout: 2500 })
      : window.setTimeout(mount, 1200)

    return () => {
      cancelled = true
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
      dispose?.()
    }
  }, [wide, reducedMotion, rootRef])

  return (
    <div ref={holderRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" />
  )
}
