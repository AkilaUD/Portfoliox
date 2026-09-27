type Props = {
  index?: string
  note?: string
  className?: string
}

/** Numbered ledger rule separating chapters. */
export function Divider({ index, note, className = '' }: Props) {
  return (
    <div className={`page-x flex items-center gap-4 ${className}`} aria-hidden="true">
      {index && <span className="label text-dim tabular-nums">{index}</span>}
      <span className="hairline flex-1" />
      {note && <span className="label text-dim">{note}</span>}
    </div>
  )
}
