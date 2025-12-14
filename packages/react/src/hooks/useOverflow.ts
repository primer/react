import {useEffect, useState} from 'react'

export function useOverflow<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    // Track whether this is the first callback (fires immediately on observe())
    let isFirstCallback = true
    let pendingFrame: number | null = null
    let latestEntries: ResizeObserverEntry[] | null = null

    const checkOverflow = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        if (
          entry.target.scrollHeight > entry.target.clientHeight ||
          entry.target.scrollWidth > entry.target.clientWidth
        ) {
          setHasOverflow(true)
          return
        }
      }
      setHasOverflow(false)
    }

    const observer = new ResizeObserver(entries => {
      // First callback must be immediate - ResizeObserver fires synchronously
      // on observe() and consumers may depend on this timing
      if (isFirstCallback) {
        isFirstCallback = false
        checkOverflow(entries)
        return
      }

      // Subsequent callbacks are throttled to reduce layout thrashing
      // during rapid resize events (e.g., window drag)
      latestEntries = entries
      if (pendingFrame === null) {
        pendingFrame = requestAnimationFrame(() => {
          pendingFrame = null
          if (latestEntries) {
            checkOverflow(latestEntries)
          }
        })
      }
    })

    observer.observe(ref.current)
    return () => {
      if (pendingFrame !== null) {
        cancelAnimationFrame(pendingFrame)
      }
      observer.disconnect()
    }
  }, [ref])

  return hasOverflow
}
