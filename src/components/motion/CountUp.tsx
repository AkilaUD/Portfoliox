import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Counts the numeric prefix of a CV figure ("20+", "100+", "2+ yrs") up from zero once visible.
 * Non-numeric values render as-is. The final value is always what assistive tech reads.
 */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reducedMotion = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.8 })
  const match = /^(\d+)(.*)$/.exec(value)
  const target = match ? Number(match[1]) : null
  const suffix = match?.[2] ?? ''
  const counts = target !== null && !reducedMotion

  useEffect(() => {
    const el = ref.current
    if (!counts || !inView || !el) return
    const controls = animate(0, target, {
      duration: Math.min(1.8, 0.8 + target / 120),
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (el.textContent = `${Math.round(v)}${suffix}`),
    })
    return () => controls.stop()
  }, [counts, inView, target, suffix])

  return (
    <span className={className}>
      <span className="sr-only">{value}</span>
      <span ref={ref} aria-hidden="true">
        {counts ? `0${suffix}` : value}
      </span>
    </span>
  )
}
