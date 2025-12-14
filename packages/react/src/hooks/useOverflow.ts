import {useEffect, useState} from 'react'

export function useOverflow<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [hasOverflow, setHasOverflow] = useState(false)

  useEffect(() => {
    if (ref.current === null) {
      return
    }

    const observer = new ResizeObserver(entries => {
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

    observer.observe(ref.current)
    return () => {
      observer.disconnect()
    }
  }, [ref])

  return hasOverflow
}
