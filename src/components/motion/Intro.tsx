import { AnimatePresence, animate, m } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../../data/profile'
import { EASE_LEDGER } from '../../lib/motion'

const SEEN_KEY = 'ledger:intro-seen'
const EASE_MOLTEN = [0.76, 0, 0.24, 1] as const

function shouldPlay() {
  try {
    return (
      window.matchMedia('(min-width: 48rem) and (prefers-reduced-motion: no-preference)').matches &&
      !sessionStorage.getItem(SEEN_KEY)
    )
  } catch {
    return false
  }
}

/** A one-per-session boot counter that wipes away into the hero. Decorative, so hidden from assistive tech. */
export function Intro() {
  const [visible, setVisible] = useState(shouldPlay)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if (visible) document.documentElement.classList.add('intro-hold')
  }, [visible])

  useEffect(() => {
    if (!visible) return
    const controls = animate(0, 100, {
      duration: 0.65,
      ease: EASE_LEDGER,
      onUpdate: (v) => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(v)).padStart(3, '0')
        if (barRef.current) barRef.current.style.transform = `scaleX(${v / 100})`
      },
      onComplete: () => {
        try {
          sessionStorage.setItem(SEEN_KEY, '1')
        } catch {
          /* storage unavailable: the intro simply plays again next visit */
        }
        document.documentElement.classList.remove('intro-hold')
        setVisible(false)
      },
    })
    return () => controls.stop()
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <m.div key="intro" aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]">
          <m.div
            className="bg-ember-gradient absolute inset-0"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: EASE_MOLTEN, delay: 0.08 }}
          />
          <m.div
            className="page-x absolute inset-0 flex flex-col justify-between bg-graphite pt-6 pb-10"
            exit={{ y: '-100%' }}
            transition={{ duration: 0.55, ease: EASE_MOLTEN }}
          >
            <div className="label flex justify-between text-dim">
              <span className="text-paper">{profile.name}</span>
              <span>Ledger 00 · Loading system</span>
            </div>
            <div>
              <span
                ref={counterRef}
                className="text-ember-gradient block text-[clamp(6rem,18vw,16rem)] leading-[0.8] font-semibold tracking-[-0.06em] tabular-nums"
              >
                000
              </span>
              <span className="mt-6 block h-px w-full bg-line">
                <span ref={barRef} className="bg-ember-gradient block h-full w-full origin-left scale-x-0" />
              </span>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
