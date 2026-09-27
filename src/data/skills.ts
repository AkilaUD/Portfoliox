import type { SkillBranch, SkillCategory, SkillContext } from './types.ts'

export const contextLabels: Record<SkillContext, string> = {
  firstmicro: 'FirstMicro',
  efinancials: 'eFinancials',
  finap: 'FINAP',
  vdeploy: 'V-Deploy',
}

/** Branches of the interactive systems map. Notes only restate how the CV uses each item. */
export const skillBranches: SkillBranch[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    skills: [
      { name: 'Angular 17+', note: 'Loan-management dashboard components on FirstMicro.', contexts: ['firstmicro', 'finap'] },
      { name: 'JavaScript', note: 'Responsive UI components and interactive behavior (ES6+).', contexts: ['vdeploy'] },
      { name: 'jQuery', note: 'Asynchronous data loading with jQuery AJAX, reducing page reloads.', contexts: ['vdeploy'] },
      { name: 'Razor Views', note: 'Responsive UI components on ASP.NET MVC.', contexts: ['vdeploy'] },
      { name: 'Bootstrap', note: 'Listed in the CV frontend toolset.' },
      { name: 'HTML5 / CSS3', note: 'Responsive desktop and mobile UI modules.', contexts: ['vdeploy'] },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    skills: [
      {
        name: 'C#',
        note: 'Core language of the .NET work; named in the CV summary and the LinkedIn headline.',
      },
      {
        name: '.NET Framework',
        note: 'Full-stack financial web applications and eFinancials business logic.',
        contexts: ['finap', 'efinancials'],
      },
      { name: 'ASP.NET Core 8', note: 'RESTful API endpoints for the FirstMicro SaaS platform.', contexts: ['firstmicro'] },
      { name: 'Web API', note: 'API design across FirstMicro core modules.', contexts: ['firstmicro'] },
      { name: 'Entity Framework Core', note: 'Azure SQL integration on FirstMicro.', contexts: ['firstmicro'] },
      {
        name: '.NET Microservices',
        note: 'Decomposition planning for notification, reporting and loan-processing services.',
        contexts: ['firstmicro'],
      },
    ],
  },
  {
    id: 'data',
    label: 'Data',
    skills: [
      {
        name: 'SQL Server',
        note: 'Complex stored procedures and queries supporting financial workflows.',
        contexts: ['finap', 'efinancials'],
      },
      { name: 'Oracle DB', note: 'Complex stored procedures and queries supporting financial workflows.', contexts: ['finap'] },
      { name: 'T-SQL', note: 'Stored procedures · query optimization · large transaction volumes.', contexts: ['efinancials'] },
      { name: 'PL/SQL', note: 'Listed in the CV language set.' },
      {
        name: 'Stored procedures',
        note: 'Authored and optimized for large transaction volumes.',
        contexts: ['finap', 'efinancials'],
      },
      {
        name: 'Query optimization',
        note: 'Improved execution plans; optimized queries behind slow report loads.',
        contexts: ['efinancials', 'firstmicro'],
      },
      { name: 'Azure SQL', note: 'Integrated with Entity Framework Core on FirstMicro.', contexts: ['firstmicro'] },
      { name: 'Indexing', note: 'Part of the CV database skill set alongside complex joins.' },
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    skills: [
      { name: 'Git', note: 'Source code and branching strategy with Git / SourceTree.', contexts: ['finap'] },
      { name: 'SourceTree', note: 'Managing source code and branching strategy.', contexts: ['finap'] },
      { name: 'Jenkins', note: 'Supporting CI/CD pipelines for stable, repeatable deployments.', contexts: ['finap'] },
      { name: 'Azure DevOps', note: 'Part of the CV DevOps / CI/CD toolset.' },
      { name: 'Bitbucket Pipelines', note: 'Part of the CV DevOps / CI/CD toolset.' },
      { name: 'TFS', note: 'Part of the CV DevOps / CI/CD toolset.' },
      { name: 'Jira', note: 'Sprint task management.' },
      {
        name: 'UAT',
        note: 'Coordinating releases and acting as client liaison during acceptance testing.',
        contexts: ['efinancials'],
      },
      { name: 'Agile / Scrum', note: 'Sprint planning, daily standups and code reviews.', contexts: ['vdeploy'] },
    ],
  },
  {
    id: 'reporting',
    label: 'Reporting',
    skills: [
      {
        name: 'SSRS',
        note: 'Regulatory and operational reports; audit trails, portfolio summaries and regulatory submissions.',
        contexts: ['finap', 'efinancials'],
      },
      { name: 'Crystal Reports', note: 'Listed in the CV reporting toolset.' },
    ],
  },
]

/** The remaining CV categories, listed plainly so nothing from the CV is omitted. */
export const otherCategories: SkillCategory[] = [
  {
    label: 'Languages',
    items: ['C#', 'Java', 'Python', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'T-SQL', 'PL/SQL'],
  },
  { label: 'Cloud', items: ['Azure SQL', 'Basic Azure services exposure'] },
  { label: 'Methodology', items: ['Agile / Scrum', 'Jira', 'Full SDLC', 'Code review', 'UAT coordination'] },
  {
    label: 'Other',
    items: ['Linux', 'Windows', 'AI-assisted development', 'GitHub Copilot', 'Prompt engineering'],
  },
]

/** Hero artifact: four stack layers, each a few real CV entries. */
export const stackLayers = [
  { label: 'Application', items: ['Angular 17+', 'Razor Views', 'JavaScript'] },
  { label: 'Services', items: ['ASP.NET Core 8', 'Web API', '.NET Framework'] },
  { label: 'Data', items: ['SQL Server', 'Oracle DB', 'T-SQL / PL-SQL'] },
  { label: 'Delivery', items: ['Git', 'Jenkins', 'Azure DevOps'] },
] as const
