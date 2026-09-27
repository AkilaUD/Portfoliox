import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopyToClipboard(resetAfter = 2200) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const area = document.createElement('textarea')
        area.value = text
        area.setAttribute('readonly', '')
        area.style.position = 'fixed'
        area.style.opacity = '0'
        document.body.appendChild(area)
        area.select()
        const ok = document.execCommand('copy')
        area.remove()
        if (!ok) return false
      }
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), resetAfter)
      return true
    },
    [resetAfter],
  )

  return { copied, copy }
}
