import React from 'react'

export function useResizeObserver(callback: (window: ResizeObserverEntry) => void) {
  React.useLayoutEffect(() => {
    const observer = new window.ResizeObserver(entries => callback(entries[0]))
    observer.observe(document.documentElement)
    return () => {
      observer.disconnect()
    }
  }, [callback])
}
