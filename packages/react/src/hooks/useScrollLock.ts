import {useEffect, useRef} from 'react'

// Global ref count for nested dialogs — only remove scroll lock when the last dialog closes
let activeScrollLocks = 0

/**
 * Prevents background scrolling while active.
 * Compensates for scrollbar removal to prevent layout shift.
 * Handles nested dialogs via ref counting — scroll lock is only
 * removed when the last active lock is released.
 */
export function useScrollLock(enabled: boolean): void {
  const isLocked = useRef(false)

  useEffect(() => {
    if (enabled && !isLocked.current) {
      isLocked.current = true
      activeScrollLocks++

      if (activeScrollLocks === 1) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
        document.body.style.setProperty('--dialog-scrollbar-gutter', `${scrollbarWidth}px`)
        document.body.style.paddingRight = `${scrollbarWidth}px`
        document.body.style.overflow = 'hidden'
      }

      return () => {
        isLocked.current = false
        activeScrollLocks--

        if (activeScrollLocks === 0) {
          document.body.style.removeProperty('--dialog-scrollbar-gutter')
          document.body.style.removeProperty('padding-right')
          document.body.style.removeProperty('overflow')
        }
      }
    }
  }, [enabled])
}
