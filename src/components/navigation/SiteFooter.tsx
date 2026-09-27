import { profile } from '../../data/profile'
import { track } from '../../lib/analytics'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="page-x border-t border-line py-10">
      <div className="ledger-grid gap-y-8">
        <p className="label col-span-full flex flex-col gap-1 md:col-span-3 lg:col-span-4">
          <span className="text-paper">{profile.name}</span>
          <span className="text-dim">Software Engineer</span>
          <span className="text-dim">{profile.country}</span>
        </p>
        <ul className="label col-span-full flex gap-6 md:col-span-3 lg:col-span-5">
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="Open"
              onClick={() => track('linkedin_click')}
              className="text-fog transition-colors hover:text-paper"
            >
              LinkedIn<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="Email"
              onClick={() => track('email_click')}
              className="text-fog transition-colors hover:text-paper"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href={profile.cv.href}
              download={profile.cv.fileName}
              data-cursor="Download"
              onClick={() => track('cv_download')}
              className="text-fog transition-colors hover:text-paper"
            >
              CV
            </a>
          </li>
        </ul>
        <p className="label col-span-full flex flex-col gap-1 text-dim md:col-span-2 md:items-end lg:col-span-3">
          <span>Engineered with React</span>
          <span className="tabular-nums">© {year} · Ledger closed</span>
        </p>
      </div>
    </footer>
  )
}
