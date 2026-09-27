import { useEffect, useState } from 'react'

/** Tracks which section currently crosses the reading line just below the nav. */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? '')

  useEffect(() => {
    const visible = new Map<string, number>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top)
          else visible.delete(entry.target.id)
        }
        if (visible.size) {
          const next = ids.find((id) => visible.has(id))
          if (next) setActive(next)
        }
      },
      { rootMargin: '-30% 0px -65% 0px' },
    )
    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return active
}
