import type { YearMonth } from '../data/types'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parse(value: YearMonth) {
  const [year, month] = value.split('-').map(Number) as [number, number]
  return { year, month }
}

export function formatYearMonth(value: YearMonth) {
  const { year, month } = parse(value)
  return `${MONTHS[month - 1]} ${year}`
}

export function formatRange(start: YearMonth, end: YearMonth | null) {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : 'Present'}`
}

export function startYear(value: YearMonth) {
  return parse(value).year
}

/** Inclusive month count between two dates; an open range runs to `now`. */
export function monthsBetween(start: YearMonth, end: YearMonth | null, now = new Date()) {
  const s = parse(start)
  const e = end ? parse(end) : { year: now.getFullYear(), month: now.getMonth() + 1 }
  return Math.max(0, (e.year - s.year) * 12 + (e.month - s.month) + 1)
}

export function formatDuration(start: YearMonth, end: YearMonth | null, now = new Date()) {
  const total = monthsBetween(start, end, now)
  const years = Math.floor(total / 12)
  const months = total % 12
  const parts: string[] = []
  if (years) parts.push(`${years} yr${years > 1 ? 's' : ''}`)
  if (months) parts.push(`${months} mo`)
  return parts.join(' ') || '< 1 mo'
}
