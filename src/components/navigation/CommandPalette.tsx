import { AnimatePresence, m } from 'motion/react'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { PROJECTS_PATH, isHomePage } from '../../data/navigation'
import { profile } from '../../data/profile'
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard'
import { track } from '../../lib/analytics'
import { EASE_LEDGER } from '../../lib/motion'
import { downloadCv, goToSection, openLinkedIn } from '../../lib/navigate'
import { lockScroll } from '../../lib/smoothScroll'

export type Command = {
  id: string
  label: string
  hint: string
  group: 'Builds' | 'Navigate' | 'Channel'
  run: () => void
}

type Props = {
  open: boolean
  onClose: () => void
  extra?: Command[]
}

export function CommandPalette({ open, onClose, extra }: Props) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const returnFocus = useRef<HTMLElement | null>(null)
  const { copied, copy } = useCopyToClipboard()
  const listId = useId()

  const commands = useMemo<Command[]>(() => {
    const nav = (id: string) => () => {
      onClose()
      requestAnimationFrame(() => goToSection(id))
    }
    const pageExtras = (extra ?? []).map((c) => ({
      ...c,
      run: () => {
        onClose()
        requestAnimationFrame(c.run)
      },
    }))
    return [
      ...pageExtras,
      { id: 'work', label: 'Work', hint: 'Case files', group: 'Navigate', run: nav('work') },
      {
        id: 'projects',
        label: 'Projects',
        hint: 'All builds',
        group: 'Navigate',
        run: () => {
          onClose()
          if (isHomePage()) location.assign(PROJECTS_PATH)
          else requestAnimationFrame(() => goToSection('top'))
        },
      },
      { id: 'experience', label: 'Experience', hint: 'Career trace', group: 'Navigate', run: nav('trace') },
      { id: 'systems', label: 'Systems', hint: 'eFinancials production system', group: 'Navigate', run: nav('efinancials') },
      { id: 'skills', label: 'Skills', hint: 'Engineering stack map', group: 'Navigate', run: nav('systems') },
      { id: 'evidence', label: 'Evidence', hint: 'Engineering signals', group: 'Navigate', run: nav('evidence') },
      { id: 'contact', label: 'Contact', hint: 'Open channel', group: 'Navigate', run: nav('contact') },
      {
        id: 'cv',
        label: 'Download CV',
        hint: 'PDF',
        group: 'Channel',
        run: () => {
          downloadCv()
          onClose()
        },
      },
      {
        id: 'linkedin',
        label: 'LinkedIn',
        hint: profile.linkedinHandle,
        group: 'Channel',
        run: () => {
          openLinkedIn()
          onClose()
        },
      },
      {
        id: 'copy',
        label: 'Copy email',
        hint: profile.email,
        group: 'Channel',
        run: () => {
          void copy(profile.email).then((ok) => ok && track('email_copy'))
        },
      },
    ]
  }, [onClose, copy, extra])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q))
  }, [commands, query])

  useEffect(() => {
    if (!open) return
    returnFocus.current = document.activeElement as HTMLElement | null
    track('command_palette_open')
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    lockScroll(true)
    const coarse = window.matchMedia('(pointer: coarse)').matches
    requestAnimationFrame(() => (coarse ? dialogRef.current : inputRef.current)?.focus())
    return () => {
      root.style.overflow = previous
      lockScroll(false)
      setQuery('')
      setActiveIndex(0)
      returnFocus.current?.focus?.({ preventScroll: true })
    }
  }, [open])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (filtered.length ? (i - 1 + filtered.length) % filtered.length : 0))
    } else if (event.key === 'Enter' && !(event.target instanceof HTMLButtonElement)) {
      event.preventDefault()
      filtered[activeIndex]?.run()
    } else if (event.key === 'Tab') {
      const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('input, button')
      if (!focusables?.length) return
      const first = focusables[0]!
      const last = focusables[focusables.length - 1]!
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  const activeId = filtered[activeIndex] ? `${listId}-${filtered[activeIndex].id}` : undefined

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-50 flex items-start justify-center bg-graphite/80 px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            data-lenis-prevent
            tabIndex={-1}
            onKeyDown={onKeyDown}
            className="w-full max-w-xl border border-line bg-charcoal shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] outline-none"
            initial={{ y: 12, scaleY: 0.98 }}
            animate={{ y: 0, scaleY: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_LEDGER }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span className="label text-ember" aria-hidden="true">
                &gt;
              </span>
              <label htmlFor={`${listId}-input`} className="sr-only">
                Search commands
              </label>
              <input
                ref={inputRef}
                id={`${listId}-input`}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActiveIndex(0)
                }}
                placeholder="Jump to a section or channel"
                className="meta h-14 flex-1 bg-transparent text-paper placeholder:text-dim focus:outline-none"
              />
              <button type="button" onClick={onClose} className="label px-2 py-1 text-dim hover:text-paper">
                Esc
              </button>
            </div>

            <ul id={listId} role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto py-2">
              {filtered.length === 0 && <li className="meta px-4 py-3 text-dim">No matching command.</li>}
              {filtered.map((command, i) => {
                const showGroup = i === 0 || filtered[i - 1]?.group !== command.group
                const isActive = i === activeIndex
                const isCopied = command.id === 'copy' && copied
                return (
                  <li key={command.id} role="presentation">
                    {showGroup && (
                      <p className="label px-4 pt-3 pb-1 text-dim" aria-hidden="true">
                        {command.group}
                      </p>
                    )}
                    <button
                      type="button"
                      id={`${listId}-${command.id}`}
                      role="option"
                      aria-selected={isActive}
                      tabIndex={-1}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={command.run}
                      className={`flex w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors duration-150 ${
                        isActive ? 'bg-graphite text-paper' : 'text-fog'
                      }`}
                    >
                      <span className="flex items-baseline gap-3">
                        <span
                          aria-hidden="true"
                          className={`h-px w-3 self-center transition-colors ${isActive ? 'bg-ember' : 'bg-line'}`}
                        />
                        <span className="text-[0.95rem]">{isCopied ? 'Channel copied' : command.label}</span>
                      </span>
                      <span className={`label ${isCopied ? 'text-gold' : 'text-dim'}`}>
                        {isCopied ? '✓' : command.hint}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            <p className="label flex justify-between border-t border-line px-4 py-2.5 text-dim" aria-hidden="true">
              <span>↑ ↓ to move · Enter to run</span>
              <span className="hidden sm:inline">Every destination is also on the page</span>
            </p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
