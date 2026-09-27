/** Month-precision date in `YYYY-MM` form. */
export type YearMonth = `${number}-${number}`

export type Experience = {
  id: string
  company: string
  shortName: string
  /** Most recent title held in the role. */
  role: string
  /** Title progression within the company, oldest first. `from` is set only once the owner confirms the month. */
  titles?: { role: string; from?: YearMonth }[]
  start: YearMonth
  end: YearMonth | null
  weight: 'primary' | 'foundation'
  summary: string
  /** Exact CV bullets. */
  responsibilities: string[]
  /** Indexes into `responsibilities` shown in the condensed career trace. */
  keyResponsibilities: number[]
  technologies: string[]
  /** Lifecycle sequence used as the role's visual trace. */
  trace: string[]
}

export type Project = {
  slug: string
  caseNumber: string
  title: string
  domain: string[]
  stack: string[]
  summary: string
  lifecycle?: string[]
  contributions: string[]
  evidence: string[]
  confidential?: boolean
}

export type SkillBranchId = 'frontend' | 'backend' | 'data' | 'delivery' | 'reporting'

export type SkillContext = 'firstmicro' | 'efinancials' | 'finap' | 'vdeploy'

export type Skill = {
  name: string
  /** One sentence describing how the skill appears in the CV. */
  note: string
  /** CV projects or roles where the skill is explicitly mentioned. */
  contexts?: SkillContext[]
}

export type SkillBranch = {
  id: SkillBranchId
  label: string
  skills: Skill[]
}

export type SkillCategory = {
  label: string
  items: string[]
}

export type StrengthVisual = 'release' | 'query' | 'stack' | 'domain' | 'team' | 'learning'

export type Strength = {
  index: string
  label: string
  /** Exact CV wording. */
  statement: string
  visual: StrengthVisual
  markers: string[]
}

export type SectionEntry = {
  id: string
  index: string
  label: string
}
