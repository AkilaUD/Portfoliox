import { m } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_LEDGER } from '../../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'p' | 'span'
}

/** One-shot entrance used sparingly to mark hierarchy as content arrives. */
export function Reveal({ children, className, delay = 0, y = 14, as = 'div' }: Props) {
  const Component = m[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, delay, ease: EASE_LEDGER }}
    >
      {children}
    </Component>
  )
}
