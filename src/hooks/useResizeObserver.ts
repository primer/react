import React from 'react'
import {useIsomorphicEffect} from '../utils/useIsomorphicEffect'


export function useResizeObserver(callback: () => void) {
  useIsomorphicEffect(() => {
    const observer = new window.ResizeObserver(() => callback())
    observer.observe(document.documentElement)
    return () => {
      observer.disconnect()
    }
  }, [callback])
}
