import type { ReactNode } from 'react'

type Props = {
  index: string
  children: ReactNode
  tone?: 'ember' | 'fog' | 'ink'
  className?: string
}

const tones = {
  ember: 'text-ember',
  fog: 'text-fog',
  ink: 'text-ember-deep',
}

export function SectionLabel({ index, children, tone = 'ember', className = '' }: Props) {
  return (
    <p className={`label flex items-baseline gap-2 ${tones[tone]} ${className}`}>
      <span className="tabular-nums">{index}</span>
      <span aria-hidden="true">/</span>
      <span>{children}</span>
    </p>
  )
}
