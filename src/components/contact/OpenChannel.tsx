import { useRef, type ReactNode } from 'react'
import { profile } from '../../data/profile'
import { useKineticText } from '../../hooks/useKineticText'
import { track, type TrackedEvent } from '../../lib/analytics'
import { SectionLabel } from '../common/SectionLabel'
import { Magnetic } from '../motion/Magnetic'
import { CopyEmailButton } from './CopyEmailButton'

type Channel = {
  index: string
  label: string
  value: string
  href: string
  event?: TrackedEvent
  cursor: string
  glyph: string
  external?: boolean
  download?: string
  trailing?: ReactNode
}

const channels: Channel[] = [
  {
    index: '01',
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    event: 'email_click',
    cursor: 'Email',
    glyph: '→',
    trailing: <CopyEmailButton email={profile.email} />,
  },
  {
    index: '02',
    label: 'LinkedIn',
    value: `linkedin.com/in/${profile.linkedinHandle}`,
    href: profile.linkedin,
    event: 'linkedin_click',
    cursor: 'Open',
    glyph: '↗',
    external: true,
  },
  {
    index: '03',
    label: 'Download / CV.pdf',
    value: profile.cv.fileName,
    href: profile.cv.href,
    event: 'cv_download',
    cursor: 'Download',
    glyph: '↓',
    download: profile.cv.fileName,
  },
]

if (profile.showPhone) {
  channels.push({
    index: '04',
    label: 'Phone',
    value: profile.phone.display,
    href: `tel:${profile.phone.tel}`,
    cursor: 'Call',
    glyph: '→',
  })
}

export function OpenChannel() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  useKineticText(titleRef)

  return (
    <section
      id="contact"
      data-tone="ember"
      aria-labelledby="contact-title"
      className="page-x pt-28 pb-20 lg:pt-40 lg:pb-28"
    >
      <div className="ledger-grid gap-y-8">
        <div className="col-span-full lg:col-span-3 lg:pt-4">
          <SectionLabel index="10">Open channel</SectionLabel>
        </div>
        <div className="col-span-full lg:col-span-9">
          <h2
            ref={titleRef}
            id="contact-title"
            tabIndex={-1}
            className="max-w-[6ch] text-[clamp(3.25rem,1rem+10vw,11rem)] leading-[0.84] font-semibold tracking-[-0.06em] outline-none"
          >
            Open channel.
          </h2>
          <p className="mt-10 max-w-[38ch] text-lede text-fog">{profile.availability}</p>
        </div>
      </div>

      <ul className="mt-20 border-t border-line lg:mt-28">
        {channels.map((c) => (
          <li key={c.index} className="group relative isolate border-b border-line">
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 origin-left scale-x-0 bg-ember-gradient opacity-[0.07] transition-transform duration-700 ease-(--ease-molten) group-hover:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-ember-gradient transition-transform duration-500 ease-(--ease-ledger) group-focus-within:scale-x-100 group-hover:scale-x-100"
            />
            <a
              href={c.href}
              data-cursor={c.cursor}
              onClick={() => c.event && track(c.event)}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              {...(c.download ? { download: c.download } : {})}
              className="ledger-grid items-baseline gap-y-2 py-7 transition-transform duration-300 ease-(--ease-ledger) group-hover:translate-x-1 lg:py-9"
            >
              <span className="label col-span-1 text-dim tabular-nums lg:col-span-1">
                {c.index}
              </span>
              <span className="label col-span-3 text-ember lg:col-span-2">{c.label}</span>
              <span className="col-span-full truncate text-[clamp(1.1rem,0.8rem+1.4vw,2rem)] font-medium tracking-[-0.025em] text-paper md:col-span-6 lg:col-span-7">
                {c.value}
                {c.external && <span className="sr-only"> (opens in a new tab)</span>}
              </span>
              <span
                aria-hidden="true"
                className="hidden justify-end text-xl text-fog transition-colors duration-300 group-hover:text-ember md:col-span-2 md:flex lg:col-span-2"
              >
                {!c.trailing && (
                  <Magnetic strength={0.5} reach={48}>
                    {c.glyph}
                  </Magnetic>
                )}
              </span>
            </a>
            {c.trailing && (
              <div className="-mt-4 pb-5 md:absolute md:top-1/2 md:right-0 md:mt-0 md:-translate-y-1/2 md:pb-0">
                <Magnetic strength={0.3} reach={24}>
                  {c.trailing}
                </Magnetic>
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
