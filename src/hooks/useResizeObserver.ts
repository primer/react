import useLayoutEffect from '../utils/useIsomorphicLayoutEffect'

export function useResizeObserver(callback: () => void, element?: Element | null) {
  useLayoutEffect(() => {
    const observer = new window.ResizeObserver(() => callback())
    observer.observe(element ?? document.documentElement)
    return () => {
      observer.disconnect()
    }
  }, [callback, element])
}
