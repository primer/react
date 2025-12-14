import {useEffect, useRef, useState} from 'react'

export function useOverflow<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [hasOverflow, setHasOverflow] = useState(false)
  // Track pending frame to throttle ResizeObserver callbacks for better INP
  const pendingFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    const observer = new ResizeObserver(entries => {
      // Throttle with requestAnimationFrame to coalesce rapid resize events
      if (pendingFrameRef.current !== null) {
        cancelAnimationFrame(pendingFrameRef.current)
      }
      pendingFrameRef.current = requestAnimationFrame(() => {
        pendingFrameRef.current = null
        for (const entry of entries) {
          if (
            entry.target.scrollHeight > entry.target.clientHeight ||
            entry.target.scrollWidth > entry.target.clientWidth
          ) {
            setHasOverflow(true)
            break
          }
        }
      })
    })

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
      if (pendingFrameRef.current !== null) {
        cancelAnimationFrame(pendingFrameRef.current)
      }
    }
  }, [ref])

  return hasOverflow
}
