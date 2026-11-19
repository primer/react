import {announce as liveRegionAnnounce, announceFromElement} from '@primer/live-region-element'
import {useCallback, useEffect, useRef, type RefObject} from 'react'
import {useEffectCallback} from './useEffectCallback'
import {isVisible} from '../utils/isVisible'

export interface UseAnnounceOptions {
  /**
   * Specify if the element is hidden
   * @default false
   */
  hidden?: boolean

  /**
   * Provide a delay in milliseconds before the announcement is made. This will
   * only work with `polite` announcements
   */
  delayMs?: number

  /**
   * The politeness level to use for the announcement
   * @default 'polite'
   */
  politeness?: 'assertive' | 'polite'
}

export interface AnnounceController {
  /**
   * Announce the provided message, or the element's accessible text content
   * when omitted.
   */
  announce: (message?: string) => void
  /**
   * Cancel any pending announcement and clear the deduplication cache.
   */
  cancel: () => void
}

function getTextContent(element: HTMLElement): string {
  let value = ''
  if (element.hasAttribute('aria-label')) {
    value = element.getAttribute('aria-label')!
  } else if (element.textContent) {
    value = element.textContent
  }
  return value ? value.trim() : ''
}

export function useAnnounce(ref: RefObject<HTMLElement | null>, options: UseAnnounceOptions = {}): AnnounceController {
  const {hidden = false, delayMs, politeness = 'polite'} = options
  // Tracked in a ref rather than state because it is only used to dedupe
  // announcements and is never rendered. Using state here would trigger a React
  // commit on every content change.
  const previousAnnouncementText = useRef<string | null>(null)
  const savedAnnouncement = useRef<ReturnType<typeof liveRegionAnnounce> | null>(null)

  const cancel = useCallback(() => {
    if (savedAnnouncement.current !== null) {
      savedAnnouncement.current.cancel()
      savedAnnouncement.current = null
    }
    previousAnnouncementText.current = null
  }, [])

  const announce = useEffectCallback((message?: string) => {
    const {current: element} = ref
    if (!element) {
      return
    }

    if (hidden) {
      return
    }

    // PERFORMANCE: Check text content before getComputedStyle to avoid forcing
    // a style recalculation when there's nothing to announce. getComputedStyle
    // triggers a synchronous reflow that can cost hundreds of milliseconds on
    // large DOM trees (e.g. TreeView with 14K+ nodes).
    const textContent = message === undefined ? getTextContent(element) : message.trim()
    if (!textContent) {
      return
    }

    if (textContent === previousAnnouncementText.current) {
      return
    }

    if (!isVisible(element)) {
      return
    }

    savedAnnouncement.current?.cancel()
    const announceOptions =
      politeness === 'assertive'
        ? {
            politeness,
            from: element,
          }
        : {
            politeness,
            delayMs,
            from: element,
          }

    savedAnnouncement.current =
      message === undefined
        ? announceFromElement(element, announceOptions)
        : liveRegionAnnounce(textContent, announceOptions)
    previousAnnouncementText.current = textContent
  })

  useEffect(() => cancel, [cancel])

  return {announce, cancel}
}
