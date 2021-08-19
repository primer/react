import React from 'react'

export function useResizeObserver(callback: () => void) {
  React.useLayoutEffect(() => {
    const observer = new window.ResizeObserver(() => callback())
    observer.observe(document.documentElement)
    return () => {
      observer.disconnect()
    }
  }, [callback])
}
