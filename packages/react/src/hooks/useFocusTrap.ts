import React from 'react'
import {focusTrap} from '@primer/behaviors'
import {useProvidedRefOrCreate} from './useProvidedRefOrCreate'
import {useOnOutsideClick} from './useOnOutsideClick'
import {useDependencyListEffect} from '../internal/hooks/useDependencyListEffect'

export interface FocusTrapHookSettings {
  /**
   * Ref that will be used for the trapping container. If not provided, one will
   * be created by this hook and returned.
   */
  containerRef?: React.RefObject<HTMLElement | null>

  /**
   * Ref for the element that should receive focus when the focus trap is first enabled. If
   * not provided, one will be created by this hook and returned. Its use is optional.
   */
  initialFocusRef?: React.RefObject<HTMLElement | null>

  /**
   * Set to true to disable the focus trap and clean up listeners. Can be re-enabled at
   * any time.
   */
  disabled?: boolean

  /**
   * If true, when this focus trap is cleaned up, restore focus to the element that had
   * focus immediately before the focus trap was enabled. (Default: false)
   */
  restoreFocusOnCleanUp?: boolean

  /**
   * If passed, when this focus trap is cleaned up, restore focus to this element instead
   * of element with focus immediately before the focus trap was enabled.
   *
   * Overrides restoreFocusOnCleanUp
   */
  returnFocusRef?: React.RefObject<HTMLElement | null>
  /**
   * If true, it should allow focus to escape the trap when clicking outside of the trap container and mark it as disabled.
   *
   * Overrides restoreFocusOnCleanUp and returnFocusRef
   */
  allowOutsideClick?: boolean
}

/**
 * Hook used to trap focus inside a container. Returns a ref that can be added to the container
 * that should trap focus.
 * @param settings {FocusTrapHookSettings}
 */
export function useFocusTrap(
  settings?: FocusTrapHookSettings,
  dependencies: React.DependencyList = [],
): {containerRef: React.RefObject<HTMLElement | null>; initialFocusRef: React.RefObject<HTMLElement | null>} {
  const containerRef = useProvidedRefOrCreate(settings?.containerRef)
  const initialFocusRef = useProvidedRefOrCreate(settings?.initialFocusRef)
  const disabled = settings?.disabled
  const allowOutsideClick = settings?.allowOutsideClick ?? false
  const returnFocusRef = settings?.returnFocusRef
  const restoreFocusOnCleanUp = settings?.restoreFocusOnCleanUp ?? false
  const abortController = React.useRef<AbortController>()
  const previousFocusedElement = React.useRef<Element | null>(null)
  const outsideClickedRef = React.useRef(false)

  // This function removes the event listeners that enable the focus trap and restores focus
  // to the previously-focused element (if necessary).
  function disableTrap() {
    abortController.current?.abort()
    abortController.current = undefined
    if (allowOutsideClick && outsideClickedRef.current) {
      return
    }
    if (returnFocusRef?.current instanceof HTMLElement) {
      returnFocusRef.current.focus()
    } else if (restoreFocusOnCleanUp && previousFocusedElement.current instanceof HTMLElement) {
      previousFocusedElement.current.focus()
      previousFocusedElement.current = null
    }
  }

  useDependencyListEffect(
    () => {
      if (containerRef.current instanceof HTMLElement) {
        if (!disabled) {
          outsideClickedRef.current = false
          if (!previousFocusedElement.current) {
            previousFocusedElement.current = document.activeElement
          }
          abortController.current = focusTrap(containerRef.current, initialFocusRef.current ?? undefined)
          return () => {
            disableTrap()
          }
        } else {
          disableTrap()
        }
      }
    },
    () => [
      containerRef,
      initialFocusRef,
      disabled,
      allowOutsideClick,
      returnFocusRef,
      restoreFocusOnCleanUp,
      ...dependencies,
    ],
  )
  useOnOutsideClick({
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    onClickOutside: () => {
      if (allowOutsideClick) {
        outsideClickedRef.current = true
        abortController.current?.abort()
      }
    },
  })

  return {containerRef, initialFocusRef}
}
