import Lenis from 'lenis'

let lenis: Lenis | null = null
const listeners = new Set<(velocity: number) => void>()

/** Starts inertial scrolling unless the visitor prefers reduced motion. Safe to call repeatedly. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return lenis
  lenis = new Lenis({ autoRaf: true, lerp: 0.11, wheelMultiplier: 0.95 })
  lenis.on('scroll', (instance: Lenis) => listeners.forEach((fn) => fn(instance.velocity)))
  return lenis
}

export function stopSmoothScroll() {
  lenis?.destroy()
  lenis = null
}

export function getLenis() {
  return lenis
}

/** Subscribes to scroll velocity (px/frame). Works with or without Lenis. */
export function onScrollVelocity(fn: (velocity: number) => void) {
  listeners.add(fn)
  let last = window.scrollY
  const native = () => {
    if (lenis) return
    fn(window.scrollY - last)
    last = window.scrollY
  }
  window.addEventListener('scroll', native, { passive: true })
  return () => {
    listeners.delete(fn)
    window.removeEventListener('scroll', native)
  }
}

export function lockScroll(locked: boolean) {
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}
