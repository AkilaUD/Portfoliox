import { AnimatePresence, m, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const OFFSET = { x: 16, y: 18 }
const INTERACTIVE = 'a, button, summary, [role="tab"], [data-cursor]'

/**
 * Fine-pointer companion: an ember disc that screens over the page and swells on interactive
 * targets, plus a contextual label trailing below-right. The native cursor always stays visible.
 */
export function ContextCursor() {
  const finePointer = useFinePointer()
  const reducedMotion = useReducedMotion()
  const [label, setLabel] = useState<string | null>(null)
  const [hot, setHot] = useState(false)
  const [present, setPresent] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const labelX = useSpring(x, { stiffness: 600, damping: 40, mass: 0.4 })
  const labelY = useSpring(y, { stiffness: 600, damping: 40, mass: 0.4 })
  const discX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.5 })
  const discY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.5 })

  useEffect(() => {
    if (!finePointer) return
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX)
      y.set(event.clientY)
      setPresent(true)
    }
    const onOver = (event: PointerEvent) => {
      const el = event.target as Element | null
      setLabel(el?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor ?? null)
      setHot(!!el?.closest(INTERACTIVE))
    }
    const onLeave = () => {
      setLabel(null)
      setPresent(false)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [finePointer, x, y])

  if (!finePointer) return null

  return (
    <>
      {!reducedMotion && (
        <m.div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-[69] mix-blend-screen"
          style={{ x: discX, y: discY }}
        >
          <m.span
            className="block size-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember-gradient"
            animate={{ scale: present && hot ? 1.3 : 0, opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          />
        </m.div>
      )}
      <m.div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[70]"
        style={{
          x: reducedMotion ? x : labelX,
          y: reducedMotion ? y : labelY,
          translateX: OFFSET.x,
          translateY: OFFSET.y,
        }}
      >
        <AnimatePresence mode="wait">
          {label && (
            <m.span
              key={label}
              className="label flex items-center gap-2 border border-ember/60 bg-graphite/95 px-2 py-1 whitespace-nowrap text-paper"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
            >
              <span className="block size-1.5 rotate-45 bg-ember-gradient" />
              {label}
            </m.span>
          )}
        </AnimatePresence>
      </m.div>
    </>
  )
}
