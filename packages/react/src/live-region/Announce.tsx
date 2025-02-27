import {announceFromElement} from '@primer/live-region-element'
import React, {useEffect, useRef, useState, type ElementRef} from 'react'
import Box from '../Box'
import {useEffectOnce} from '../internal/hooks/useEffectOnce'
import {useEffectCallback} from '../internal/hooks/useEffectCallback'

export type AnnounceProps = React.ComponentPropsWithoutRef<typeof Box> & {
  /**
   * Specify if the content of the element should be announced when this
   * component is rendered and is not hidden
   * @default false
   */
  announceOnShow?: boolean

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

/**
 * `Announce` is a component that will announce the text content of the
 * `children` passed in to screen readers using the given politeness level. It
 * will also announce any changes to the text content of `children`
 */
export function Announce({
  announceOnShow = true,
  children,
  delayMs,
  hidden = false,
  politeness = 'polite',
  ...rest
}: AnnounceProps) {
  const ref = useRef<ElementRef<'div'>>(null)
  const [previousAnnouncementText, setPreviousAnnouncementText] = useState<string | null>(null)
  const savedAnnouncement = useRef<ReturnType<typeof announceFromElement> | null>(null)
  const announce = useEffectCallback(() => {
    const {current: element} = ref
    if (!element) {
      return
    }

    if (hidden) {
      return
    }

    const style = window.getComputedStyle(element)
    if (style.display === 'none') {
      return
    }

    if (style.visibility === 'hidden') {
      return
    }

    const textContent = computeTextEquivalent(element)
    if (textContent === previousAnnouncementText) {
      return
    }

    savedAnnouncement.current?.cancel()
    savedAnnouncement.current = announceFromElement(
      element,
      politeness === 'assertive'
        ? {
            politeness,
          }
        : {
            politeness,
            delayMs,
          },
    )
    setPreviousAnnouncementText(textContent)
  })

  // Announce the initial message, this is wrapped in `useEffectOnce` so that it
  // does not announce twice in StrictMode
  useEffectOnce(() => {
    if (announceOnShow) {
      announce()
    }
  })

  useEffect(() => {
    const {current: container} = ref
    if (container === null) {
      return
    }

    // When the text of the container changes, announce the new text
    const observer = new MutationObserver(() => {
      announce()
    })

    observer.observe(container, {
      subtree: true,
      characterData: true,
      childList: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [announce])

  useEffect(() => {
    return () => {
      if (savedAnnouncement.current !== null) {
        savedAnnouncement.current.cancel()
        savedAnnouncement.current = null
      }
    }
  }, [])

  return (
    <Box {...rest} ref={ref}>
      {children}
    </Box>
  )
}

type TextEquivalentOptions = {
  allowHidden: boolean
}

const defaultOptions: TextEquivalentOptions = {
  allowHidden: false,
}

/**
 * Simplified version of the algorithm to compute the text equivalent of an
 * element.
 *
 * @see https://www.w3.org/TR/accname-1.2/#computation-steps
 */
function computeTextEquivalent(
  elementOrText: HTMLElement | Text,
  options: TextEquivalentOptions = defaultOptions,
): string {
  if (elementOrText instanceof Text) {
    return elementOrText.textContent?.trim() ?? ''
  }

  if (elementOrText.shadowRoot) {
    return Array.from(elementOrText.shadowRoot.childNodes)
      .map(node => {
        if (node instanceof Text) {
          return computeTextEquivalent(node, options)
        }

        if (node instanceof HTMLElement) {
          return computeTextEquivalent(node, options)
        }

        return null
      })
      .filter(Boolean)
      .join(' ')
  }

  const style = window.getComputedStyle(elementOrText)
  if (style.display === 'none' || style.visibility === 'hidden') {
    return ''
  }

  if (options.allowHidden === false && elementOrText.getAttribute('aria-hidden') === 'true') {
    return ''
  }

  if (elementOrText.hasAttribute('aria-labelledby')) {
    const idrefs = elementOrText.getAttribute('aria-labelledby')!
    return idrefs
      .split(' ')
      .map(idref => {
        const item = document.getElementById(idref)
        if (item) {
          return computeTextEquivalent(item, {allowHidden: true})
        }
        return null
      })
      .filter(Boolean)
      .join(' ')
  }

  const role = elementOrText.getAttribute('role')

  if (role === 'combobox' || role === 'listbox') {
    const options = elementOrText.querySelectorAll('option[aria-selected="true"]')
    return Array.from(options)
      .map(option => {
        if (option instanceof HTMLOptionElement) {
          return option.value.trim()
        }
        return null
      })
      .filter(Boolean)
      .join(', ')
  }

  if (role === 'range') {
    if (elementOrText.hasAttribute('aria-valuetext')) {
      return elementOrText.getAttribute('aria-valuetext')!.trim()
    }

    if (elementOrText.hasAttribute('aria-valuenow')) {
      return elementOrText.getAttribute('aria-valuenow')!.trim()
    }
    return elementOrText.textContent?.trim() ?? ''
  }

  if (elementOrText.hasAttribute('aria-label')) {
    return elementOrText.getAttribute('aria-label')!.trim()
  }

  return elementOrText.textContent?.trim() ?? ''
}
