import type { Project } from './types.ts'

export const firstMicro: Project & {
  lifecycleNotes: Record<string, string>
  layers: { id: string; label: string; tech: string; callout?: string }[]
  plannedServices: string[]
} = {
  slug: 'firstmicro',
  caseNumber: '01',
  title: 'FirstMicro',
  domain: ['Microfinance', 'SaaS', 'Cloud'],
  stack: ['ASP.NET Core 8', 'Angular 17+', 'Azure SQL', 'Entity Framework Core', 'Microservices'],
  summary:
    'Cloud-based SaaS platform for the microfinance and lending sector, enabling financial institutions to manage the complete loan lifecycle. Designed for scalability across multiple tenants.',
  lifecycle: [
    'Loan Origination',
    'Credit Approvals',
    'Disbursement',
    'Repayment Scheduling',
    'Collections',
    'Arrears Management',
  ],
  lifecycleNotes: {
    'Loan Origination': 'Where a loan application enters the platform and the lifecycle begins.',
    'Credit Approvals': 'The approval stage that decides whether an originated loan moves forward.',
    Disbursement: 'Approved loans are paid out to the borrower.',
    'Repayment Scheduling': 'The installment plan the borrower repays against.',
    Collections: 'Repayments are collected against the schedule.',
    'Arrears Management': 'Missed or overdue repayments are tracked and managed.',
  },
  layers: [
    {
      id: 'interface',
      label: 'Interface',
      tech: 'Angular 17+',
      callout: 'Loan-management dashboard components',
    },
    {
      id: 'api',
      label: 'API',
      tech: 'ASP.NET Core 8',
      callout: 'RESTful API endpoints',
    },
    {
      id: 'services',
      label: 'Services',
      tech: 'Microservices',
      callout: 'Decomposition planning: notification, reporting, loan processing',
    },
    {
      id: 'data',
      label: 'Data',
      tech: 'Azure SQL · Entity Framework Core',
      callout: 'EF Core integration · query optimization for slow report loads',
    },
  ],
  plannedServices: ['Notification', 'Reporting', 'Loan processing'],
  contributions: [
    'Core module development, API design and system-performance optimization.',
    'Developed RESTful API endpoints using ASP.NET Core 8.',
    'Built Angular 17+ loan-management dashboard components.',
    'Integrated Azure SQL with Entity Framework Core.',
    'Optimized queries behind slow report loads.',
    'Contributed to microservices decomposition planning for notification, reporting, and loan-processing services.',
  ],
  evidence: ['Current project at FINAP', 'Multi-tenant SaaS', 'Full loan lifecycle'],
}

export const eFinancials: Project & {
  workAreas: { module: string; entity: string }[]
  incident: { step: string; detail: string }[]
  reports: string[]
} = {
  slug: 'efinancials',
  caseNumber: '02',
  title: 'eFinancials',
  domain: ['Leasing', 'Enterprise', 'Finance'],
  stack: ['.NET Framework', 'SQL Server', 'SSRS'],
  summary:
    'Enterprise web-based leasing finance platform used by 20+ financial companies and several leading Sri Lankan banks.',
  workAreas: [
    { module: 'Leasing workflows', entity: 'Contract' },
    { module: 'Asset management', entity: 'Asset' },
    { module: 'Installment schedules', entity: 'Schedule' },
    { module: 'Regulatory reporting', entity: 'Report' },
  ],
  incident: [
    {
      step: 'Defect',
      detail: 'Complex defects across the leasing platform. 100+ production defects resolved across 2+ years.',
    },
    {
      step: 'Diagnosis',
      detail: '.NET business logic, stored procedures, SQL query performance and error-handling edge cases.',
    },
    {
      step: 'SQL / Business logic',
      detail:
        'Authored and optimized complex T-SQL stored procedures for large transaction volumes, and improved execution plans.',
    },
    {
      step: 'Validation',
      detail:
        'Structured testing against financial-industry standards and client-agreed acceptance criteria.',
    },
    {
      step: 'UAT',
      detail:
        'Direct liaison with clients during acceptance testing, turning feedback into actionable development tasks.',
    },
    {
      step: 'Production',
      detail:
        'End-to-end releases across UAT and live production environments with zero unplanned downtime.',
    },
  ],
  reports: ['Audit trails', 'Portfolio summaries', 'Regulatory submissions'],
  contributions: [
    'Resolved 100+ production defects across 2+ years.',
    'Authored and optimized complex T-SQL stored procedures for large transaction volumes.',
    'Improved execution plans.',
    'Produced SSRS reports for audit trails, portfolio summaries, and regulatory submissions used by bank compliance teams.',
  ],
  evidence: ['20+ financial companies', 'Several leading Sri Lankan banks', '100+ production defects'],
  confidential: true,
}

export const vDeploy: Project = {
  slug: 'vdeploy',
  caseNumber: '03',
  title: 'V-Deploy Platform',
  domain: ['Internal tools', 'Operations'],
  stack: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'ASP.NET MVC'],
  summary: 'Internal deployment and operations management platform.',
  contributions: [
    'Redesigned key UI modules for responsive desktop and mobile behavior.',
    'Introduced asynchronous data loading patterns using jQuery AJAX.',
    'Reduced server roundtrips and improved responsiveness.',
  ],
  evidence: ['Internship', 'Feb 2021 – Sep 2021'],
}
