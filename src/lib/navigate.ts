import { profile } from '../data/profile'
import { track } from './analytics'
import { getLenis } from './smoothScroll'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Scrolls to a section and moves focus to its heading so keyboard users land in context.
 * Sections that live on the home page are reached from other pages through `/#id`.
 */
export function goToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) {
    location.assign(id === 'top' ? '/' : `/#${id}`)
    return
  }
  history.replaceState(null, '', id === 'top' ? location.pathname : `#${id}`)
  const lenis = getLenis()
  if (lenis) {
    const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
    lenis.scrollTo(target, { offset: -padding, duration: 1.4 })
  } else {
    target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }
  const focusable = target.querySelector<HTMLElement>('h1, h2') ?? target
  if (!focusable.hasAttribute('tabindex')) focusable.setAttribute('tabindex', '-1')
  focusable.focus({ preventScroll: true })
}

export function downloadCv() {
  track('cv_download')
  const link = document.createElement('a')
  link.href = profile.cv.href
  link.download = profile.cv.fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function openLinkedIn() {
  track('linkedin_click')
  window.open(profile.linkedin, '_blank', 'noopener,noreferrer')
}
