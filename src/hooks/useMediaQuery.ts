import { useCallback, useSyncExternalStore } from 'react'

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/** Matches the `choreo` CSS variant: large screens with motion allowed. */
export const CHOREO_QUERY =
  '(min-width: 64rem) and (min-height: 43rem) and (prefers-reduced-motion: no-preference)'

export function useChoreography() {
  return useMediaQuery(CHOREO_QUERY)
}

export function useFinePointer() {
  return useMediaQuery('(pointer: fine) and (hover: hover)')
}
