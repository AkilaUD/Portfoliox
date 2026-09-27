import { useRef, type ReactNode } from 'react'
import { useKineticText } from '../../hooks/useKineticText'

type Tone = 'graphite' | 'paper'

const tones = {
  graphite: { label: 'text-ember', dim: 'text-dim', body: 'text-fog', rule: 'border-line' },
  paper: {
    label: 'text-ember-deep',
    dim: 'text-ink-muted',
    body: 'text-ink-muted',
    rule: 'border-rule',
  },
}

type HeaderProps = {
  caseNumber: string
  title: string
  domain: string[]
  titleId: string
  tone?: Tone
  size?: 'major' | 'minor'
}

export function CaseFileHeader({
  caseNumber,
  title,
  domain,
  titleId,
  tone = 'graphite',
  size = 'major',
}: HeaderProps) {
  const t = tones[tone]
  const titleRef = useRef<HTMLHeadingElement>(null)
  useKineticText(titleRef, tone === 'paper' ? '#a8361a' : '#ff6a2b')

  return (
    <header className="flex flex-col gap-4">
      <p className={`label flex items-center gap-3 ${t.label}`}>
        <span>Case file {caseNumber}</span>
        <span
          aria-hidden="true"
          className={`h-px w-10 ${tone === 'paper' ? 'bg-ember-deep' : 'bg-ember-gradient'}`}
        />
      </p>
      <h2
        ref={titleRef}
        id={titleId}
        tabIndex={-1}
        className={`font-semibold outline-none ${
          size === 'major'
            ? 'text-[clamp(2.75rem,1rem+5vw,6rem)] leading-[0.88] tracking-[-0.055em] lg:text-[min(4.8vw,6rem)]'
            : 'text-[clamp(2rem,1rem+3vw,3.5rem)] leading-[0.95] tracking-[-0.045em]'
        }`}
      >
        {title}
      </h2>
      <p className={`label ${t.dim}`}>{domain.join(' / ')}</p>
    </header>
  )
}

type RecordRow = { term: string; value: ReactNode }

/** The case-study questions answered as a ledger of record rows. */
export function CaseRecord({
  rows,
  tone = 'graphite',
  title = 'Case record',
}: {
  rows: RecordRow[]
  tone?: Tone
  title?: string
}) {
  const t = tones[tone]
  return (
    <div>
      <p className={`label ${t.dim}`}>{title}</p>
      <dl className={`mt-4 border-t ${t.rule}`}>
        {rows.map((row, i) => (
          <div
            key={row.term}
            className={`grid gap-2 border-b py-4 md:grid-cols-[12rem_1fr] md:gap-6 ${t.rule}`}
          >
            <dt className={`label flex gap-3 ${t.dim}`}>
              <span className="tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              {row.term}
            </dt>
            <dd
              className={`text-[0.95rem] leading-relaxed ${tone === 'paper' ? 'text-ink' : 'text-paper/90'}`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export function InlineList({
  items,
  className = '',
}: {
  items: readonly string[]
  className?: string
}) {
  return (
    <ul className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {items.map((item, i) => (
        <li key={item}>
          {item}
          {i < items.length - 1 && (
            <span aria-hidden="true" className="ml-2 opacity-40">
              ·
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}
