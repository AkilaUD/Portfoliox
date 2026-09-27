import { AnimatePresence, m } from 'motion/react'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { track } from '../../lib/analytics'
import { EASE_LEDGER } from '../../lib/motion'

export function CopyEmailButton({ email }: { email: string }) {
  const { copied, copy } = useCopyToClipboard()

  return (
    <button
      type="button"
      data-cursor="Copy"
      onClick={() => void copy(email).then((ok) => ok && track('email_copy'))}
      className="label relative inline-flex min-w-[9.5rem] items-center justify-start gap-2 md:justify-end py-2 text-fog transition-colors hover:text-paper"
    >
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email address copied to clipboard' : ''}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <m.span
            key="copied"
            aria-hidden="true"
            className="flex items-center gap-2 text-gold"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_LEDGER }}
          >
            <span className="block size-1.5 rotate-45 bg-gold" />
            Channel copied
          </m.span>
        ) : (
          <m.span
            key="copy"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: EASE_LEDGER }}
          >
            <span aria-hidden="true" className="block h-px w-4 bg-current" />
            Copy email
          </m.span>
        )}
      </AnimatePresence>
    </button>
  )
}
