import type { CSSProperties } from 'react'
import { profile } from '../../data/profile'

const [first = '', last = ''] = profile.name.split(' ')

const lines = [
  { word: first, align: 'text-left', drift: '-18px', gradient: false },
  { word: last, align: 'text-right', drift: '18px', gradient: true },
]

/**
 * The name as architecture: two giant lines, first name hard left in cream, surname hard right in the
 * ember gradient. The portrait stands in front of them. Only the letters move.
 */
export function HeroName() {
  let index = 0
  return (
    <h1
      id="hero-title"
      className="relative text-[length:var(--name-size)] leading-[0.8] font-semibold tracking-[-0.055em] uppercase"
    >
      <span className="sr-only">{profile.name}</span>
      {lines.map(({ word, align, drift, gradient }) => (
        <span
          key={word}
          aria-hidden="true"
          className={`name-drift block ${align}`}
          style={{ '--drift': drift } as CSSProperties}
        >
          <span className="line-mask inline-block pr-[0.06em]">
            {[...word].map((char, i) => {
              const n = index++
              return (
                <span key={i} className="char-rise" style={{ '--i': n } as CSSProperties}>
                  {gradient ? (
                    <span
                      className="ember-sweep inline-block text-ember-gradient"
                      style={{ animationDelay: `${n * -0.45}s` }}
                    >
                      {char}
                    </span>
                  ) : (
                    <span className="text-paper">{char}</span>
                  )}
                </span>
              )
            })}
          </span>
        </span>
      ))}
    </h1>
  )
}
