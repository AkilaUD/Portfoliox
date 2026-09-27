import type { SectionEntry } from './types.ts'

export const PROJECTS_PATH = '/projects/'

export const sections: SectionEntry[] = [
  { id: 'top', index: '00', label: 'System online' },
  { id: 'signature', index: '01', label: 'Signature' },
  { id: 'signals', index: '02', label: 'Signals' },
  { id: 'trace', index: '03', label: 'Trace' },
  { id: 'work', index: '04', label: 'Case file 01' },
  { id: 'efinancials', index: '05', label: 'Case file 02' },
  { id: 'builds', index: '05.1', label: 'Selected builds' },
  { id: 'systems', index: '06', label: 'Systems' },
  { id: 'evidence', index: '07', label: 'Evidence' },
  { id: 'origin', index: '08', label: 'Origin' },
  { id: 'education', index: '09', label: 'Education' },
  { id: 'contact', index: '10', label: 'Open channel' },
]

/** `section` items scroll within the home page; `page` items are separate documents. */
export const primaryNav = [
  { section: 'work', label: 'Work' },
  { page: PROJECTS_PATH, label: 'Projects' },
  { section: 'systems', label: 'Systems' },
  { section: 'trace', label: 'Trace' },
  { section: 'contact', label: 'Contact' },
] as const

export const isHomePage = () => !location.pathname.startsWith(PROJECTS_PATH.slice(0, -1))

/** In-page hash on the home page, a link back to the home section anywhere else. */
export const sectionHref = (id: string) => (isHomePage() ? `#${id}` : `/#${id}`)
