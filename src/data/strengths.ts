import type { Strength } from './types.ts'

export const strengths: Strength[] = [
  {
    index: '01',
    label: 'Production stability',
    statement:
      'Track record of zero-downtime deployments across financial platforms serving 20+ institutions.',
    visual: 'release',
    markers: ['Dev', 'UAT', 'Prod'],
  },
  {
    index: '02',
    label: 'Complex SQL',
    statement:
      'Deep experience writing and optimizing stored procedures, execution plans, and large-dataset queries.',
    visual: 'query',
    markers: ['Stored procedure', 'Execution plan', 'Large dataset'],
  },
  {
    index: '03',
    label: 'Full-stack delivery',
    statement:
      'End-to-end ownership from backend API to Angular UI, shipping complete features independently.',
    visual: 'stack',
    markers: ['API', 'Logic', 'Angular UI'],
  },
  {
    index: '04',
    label: 'FinTech domain',
    statement:
      'Hands-on understanding of leasing, microfinance, loan lifecycle, and regulatory reporting requirements.',
    visual: 'domain',
    markers: ['Leasing', 'Microfinance', 'Loan lifecycle', 'Regulatory reporting'],
  },
  {
    index: '05',
    label: 'Agile collaboration',
    statement:
      'Sprint ceremonies, Jira task management, cross-functional collaboration with BAs and QA teams.',
    visual: 'team',
    markers: ['BA', 'Dev', 'QA', 'Client'],
  },
  {
    index: '06',
    label: 'Continuous learning',
    statement:
      'Self-driven adoption of AI tooling, modern .NET patterns, and cloud technologies alongside active project delivery.',
    visual: 'learning',
    markers: ['AI tooling', 'Modern .NET', 'Cloud'],
  },
]

export const signals = [
  { value: '20+', label: 'financial companies using eFinancials, plus several leading Sri Lankan banks' },
  { value: '100+', label: 'production defects resolved on eFinancials' },
  { value: '2+ yrs', label: 'of eFinancials project work' },
  { value: 'Full SDLC', label: 'requirements → design → development → code review → QA → deployment' },
] as const

export const workingSequence = [
  { step: 'Understand', detail: 'Requirements with business analysts and stakeholders' },
  { step: 'Design', detail: 'Technical specifications from financial-domain requirements' },
  { step: 'Implement', detail: 'APIs, business logic, stored procedures, UI' },
  { step: 'Review', detail: 'Code review' },
  { step: 'Test', detail: 'QA and client UAT against acceptance criteria' },
  { step: 'Deploy', detail: 'UAT and production releases through CI/CD' },
] as const
