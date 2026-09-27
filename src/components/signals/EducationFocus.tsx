import { firstMicro } from '../../data/projects'
import { profile } from '../../data/profile'
import { SectionLabel } from '../common/SectionLabel'

export function EducationFocus() {
  const { education, languages } = profile
  return (
    <section id="education" aria-labelledby="education-title" className="page-x py-24 lg:py-32">
      <div className="ledger-grid gap-y-10">
        <div className="col-span-full lg:col-span-3">
          <SectionLabel index="09" tone="fog">
            Education · focus
          </SectionLabel>
        </div>

        <div className="col-span-full lg:col-span-9">
          <h2 id="education-title" tabIndex={-1} className="sr-only">
            Education, languages and current focus
          </h2>
          <dl className="grid border-t border-line md:grid-cols-3">
            <div className="border-b border-line py-7 md:border-r md:border-b-0 md:pr-6">
              <dt className="label text-dim">Education</dt>
              <dd className="mt-4">
                <p className="text-lg font-medium tracking-[-0.015em] text-paper">{education.degree}</p>
                <p className="mt-2 text-fog">{education.institution}</p>
                <p className="meta mt-2 text-dim">
                  {education.start} – {education.end}
                </p>
              </dd>
            </div>

            <div className="border-b border-line py-7 md:border-r md:border-b-0 md:px-6">
              <dt className="label text-dim">Languages</dt>
              <dd className="mt-4">
                <ul className="flex flex-col gap-3">
                  {languages.map((l) => (
                    <li key={l.name}>
                      <p className="text-lg font-medium tracking-[-0.015em] text-paper">{l.name}</p>
                      <p className="meta mt-0.5 text-fog">{l.level}</p>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>

            <div className="py-7 md:pl-6">
              <dt className="label flex items-center gap-2 text-dim">
                <span aria-hidden="true" className="signal-pulse block size-1.5 rounded-full bg-gold" />
                Current focus
              </dt>
              <dd className="mt-4">
                <p className="text-lg font-medium tracking-[-0.015em] text-paper">Cloud and microservices on .NET</p>
                <p className="mt-2 text-fog">
                  {firstMicro.title} on {firstMicro.stack.slice(0, 3).join(', ')}, with microservices decomposition
                  planning. Alongside delivery: AI tooling, modern .NET patterns and cloud technologies.
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
