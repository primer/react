import {useState} from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export function useOverflow<T extends HTMLElement>(ref: React.RefObject<T>) {
  const [hasOverflow, setHasOverflow] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const element = ref.current
    if (element === null) {
      return
    }

    const checkOverflow = () => {
      const overflow = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
      setHasOverflow(overflow)
    }

    // Check immediately on mount
    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return hasOverflow
}
