import { useRef, type ReactNode } from 'react'
import { useKineticText } from '../../hooks/useKineticText'
import { SectionLabel } from './SectionLabel'

type Props = {
  index: string
  label: string
  id?: string
  children: ReactNode
  aside?: ReactNode
  tone?: 'ember' | 'ink'
  className?: string
}

/** Left-rail label with an oversized title in the content columns. */
export function SectionHeading({ index, label, id, children, aside, tone = 'ember', className = '' }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  useKineticText(titleRef, tone === 'ink' ? '#a8361a' : '#ff6a2b')

  return (
    <header className={`ledger-grid gap-y-5 ${className}`}>
      <div className="col-span-full lg:col-span-3 lg:pt-3">
        <SectionLabel index={index} tone={tone}>
          {label}
        </SectionLabel>
      </div>
      <h2 ref={titleRef} id={id} tabIndex={-1} className="text-title col-span-full outline-none lg:col-span-9">
        {children}
      </h2>
      {aside && <div className="col-span-full lg:col-span-6 lg:col-start-4">{aside}</div>}
    </header>
  )
}
