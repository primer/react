import {useCallback, useEffect, useRef, useState, startTransition} from 'react'
import {getCharacterCountState, SCREEN_READER_DELAY} from './character-counter'

/**
 * Provides a debounced, screen-reader-only announcement of the remaining
 * character count for an input that has a `characterLimit`.
 *
 * Call the returned `announce` from the input's change handler with the new
 * content length, and render the returned `screenReaderMessage` into a polite
 * live region. Announcements are debounced and applied as a transition so they
 * never block typing, and any pending announcement is cleared on unmount.
 */
export function useCharacterCountAnnouncement(characterLimit?: number): {
  screenReaderMessage: string
  announce: (length: number) => void
} {
  const [screenReaderMessage, setScreenReaderMessage] = useState('')
  const timeoutRef = useRef<number | null>(null)

  const announce = useCallback(
    (length: number) => {
      if (!characterLimit || typeof window === 'undefined') {
        return
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      const {message} = getCharacterCountState(length, characterLimit)
      timeoutRef.current = window.setTimeout(() => {
        startTransition(() => {
          setScreenReaderMessage(message)
        })
      }, SCREEN_READER_DELAY)
    },
    [characterLimit],
  )

  // Clear any pending announcement when the consumer unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {screenReaderMessage, announce}
}
