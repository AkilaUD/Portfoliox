import { useEffect, useRef } from 'react'

/**
 * Writes document scroll progress (0–1) into a CSS custom property on the target
 * element, so progress indicators update without React re-renders.
 */
export function useScrollProgress<T extends HTMLElement>(property = '--progress') {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      el.style.setProperty(property, String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [property])

  return ref
}
