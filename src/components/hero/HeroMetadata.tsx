import type { CSSProperties } from 'react'
import { profile } from '../../data/profile'

const items = [
  { term: 'Base', value: profile.country },
  { term: 'Stack', value: 'C# · .NET · SQL · Angular' },
  { term: 'Domain', value: 'FinTech · ERP' },
  { term: 'Status', value: 'Building', status: true },
]

export function HeroMetadata() {
  return (
    <dl className="page-x ledger-grid relative z-10 gap-y-4 border-t border-line pt-5 pb-7">
      {items.map((item, i) => (
        <div
          key={item.term}
          data-prox="xy"
          className="boot-in label col-span-2 flex flex-col gap-1 md:col-span-2 lg:col-span-3"
          style={{ '--i': 10 + i } as CSSProperties}
        >
          <dt className="text-dim">{item.term}</dt>
          <dd className="flex items-center gap-2 text-fog">
            {item.status && (
              <span
                aria-hidden="true"
                className="signal-pulse block size-1.5 rounded-full bg-gold"
              />
            )}
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
