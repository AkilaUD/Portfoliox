export type TrackedEvent =
  | 'cv_download'
  | 'email_click'
  | 'email_copy'
  | 'linkedin_click'
  | 'command_palette_open'
  | 'case_file_open'

type Provider = (event: string, options?: { props?: Record<string, string> }) => void

/**
 * Privacy-conscious event hook. No provider ships by default; if a cookieless
 * provider exposing `window.plausible` is added later, events flow to it.
 * The site never depends on this succeeding.
 */
export function track(event: TrackedEvent, props?: Record<string, string>) {
  try {
    const provider = (window as unknown as { plausible?: Provider }).plausible
    provider?.(event, props ? { props } : undefined)
    window.dispatchEvent(new CustomEvent('portfolio:track', { detail: { event, props } }))
  } catch {
    // Analytics must never break the page.
  }
}
