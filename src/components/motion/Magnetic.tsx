import { m, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  children: ReactNode
  /** Fraction of the pointer offset the element follows. */
  strength?: number
  /** Extra pull radius around the element, in px. */
  reach?: number
  className?: string
}

/** Pulls its content toward a nearby fine pointer and springs back on release. */
export function Magnetic({ children, strength = 0.35, reach = 60, className = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.5 })

  useEffect(() => {
    const el = ref.current
    if (!el || !finePointer || reducedMotion) return
    const onMove = (event: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const inside = Math.abs(dx) < r.width / 2 + reach && Math.abs(dy) < r.height / 2 + reach
      x.set(inside ? dx * strength : 0)
      y.set(inside ? dy * strength : 0)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      x.set(0)
      y.set(0)
    }
  }, [finePointer, reducedMotion, strength, reach, x, y])

  return (
    <m.span ref={ref} className={`inline-block will-change-transform ${className}`} style={{ x: sx, y: sy }}>
      {children}
    </m.span>
  )
}
