import {isTabbable, iterateFocusableElements} from '../utils/iterateFocusableElements'
import {polyfill as eventListenerSignalPolyfill} from '../polyfills/eventListenerSignal'

eventListenerSignalPolyfill()

interface FocusTrapMetadata {
  container: HTMLElement
  controller: AbortController
  initialFocus?: HTMLElement
  originalSignal: AbortSignal
}

const suspendedTrapStack: FocusTrapMetadata[] = []
let activeTrap: FocusTrapMetadata | undefined = undefined

function tryReactivate() {
  const trapToReactivate = suspendedTrapStack.pop()
  if (trapToReactivate) {
    focusTrap(trapToReactivate.container, trapToReactivate.initialFocus, trapToReactivate.originalSignal)
  }
}

// @todo If AbortController.prototype.follow is ever implemented, that
// could replace this function. @see https://github.com/whatwg/dom/issues/920
function followSignal(signal: AbortSignal): AbortController {
  const controller = new AbortController()
  signal.addEventListener('abort', () => {
    controller.abort()
  })
  return controller
}

/**
 * Returns the first focusable child of `container`. If `lastChild` is true,
 * returns the last focusable child of `container`.
 * @param container
 * @param lastChild
 */
function getFocusableChild(container: HTMLElement, lastChild = false) {
  return iterateFocusableElements(container, {reverse: lastChild, strict: true, onlyTabbable: true}).next().value
}

/**
 * Traps focus within the given container.
 * @param container The container in which to trap focus
 * @returns AbortController - call `.abort()` to disable the focus trap
 */
export function focusTrap(container: HTMLElement, initialFocus?: HTMLElement): AbortController

/**
 * Traps focus within the given container.
 * @param container The container in which to trap focus
 * @param abortSignal An AbortSignal to control the focus trap.
 */
export function focusTrap(container: HTMLElement, initialFocus: HTMLElement | undefined, abortSignal: AbortSignal): void
export function focusTrap(
  container: HTMLElement,
  initialFocus?: HTMLElement,
  abortSignal?: AbortSignal
): AbortController | void {
  // Set up an abort controller if a signal was not passed in
  const controller = new AbortController()
  const signal = abortSignal ?? controller.signal

  container.setAttribute('data-focus-trap', 'active')
  let lastFocusedChild: HTMLElement | undefined = undefined
  const firstFocusableChild = getFocusableChild(container)
  const lastFocusableChild = getFocusableChild(container, true)

  // Ensure focus remains in the trap zone by checking that a given recently-focused
  // element is inside the trap zone. If it isn't, redirect focus to a suitable
  // element within the trap zone. If need to redirect focus and a suitable element
  // is not found, return false.
  function ensureTrapZoneHasFocus(focusedElement: EventTarget | null): boolean {
    if (focusedElement instanceof HTMLElement) {
      if (container.contains(focusedElement)) {
        // If a child of the trap zone was focused, remember it
        lastFocusedChild = focusedElement
        return true
      } else {
        if (lastFocusedChild && isTabbable(lastFocusedChild)) {
          lastFocusedChild.focus()
          return true
        } else {
          // eslint-disable-next-line @typescript-eslint/no-extra-semi
          const toFocus = initialFocus ?? firstFocusableChild
          if (toFocus) {
            toFocus.focus()
            return true
          }
        }
      }
    }
    return false
  }

  const wrappingController = followSignal(signal)

  // Wrap focus from beginning to end
  firstFocusableChild?.addEventListener(
    'keydown',
    event => {
      if (event.key === 'Tab' && event.shiftKey && !event.defaultPrevented) {
        event.preventDefault()
        lastFocusableChild?.focus()
      }
    },
    {signal: wrappingController.signal}
  )

  // Wrap focus from end to beginning
  lastFocusableChild?.addEventListener(
    'keydown',
    event => {
      if (event.key === 'Tab' && !event.shiftKey && !event.defaultPrevented) {
        event.preventDefault()
        firstFocusableChild?.focus()
      }
    },
    {signal: wrappingController.signal}
  )

  if (activeTrap) {
    const suspendedTrap = activeTrap
    activeTrap.container.setAttribute('data-focus-trap', 'suspended')
    activeTrap.controller.abort()
    suspendedTrapStack.push(suspendedTrap)
  }

  // When this trap is canceled, either by the user or by us for suspension
  wrappingController.signal.addEventListener('abort', () => {
    activeTrap = undefined
  })

  // Only when user-canceled
  signal.addEventListener('abort', () => {
    container.removeAttribute('data-focus-trap')
    const suspendedTrapIndex = suspendedTrapStack.findIndex(t => t.container === container)
    if (suspendedTrapIndex >= 0) {
      suspendedTrapStack.splice(suspendedTrapIndex, 1)
    }
    tryReactivate()
  })

  // Prevent focus leaving the trap container
  document.addEventListener(
    'focusin',
    (event: FocusEvent) => {
      if (!ensureTrapZoneHasFocus(event.target)) {
        // Couldn't find a suitable element to focus, so assume that the trap zone UI
        // has been hidden or removed - clean up the listeners.
        wrappingController.abort()
      }
    },
    {signal: wrappingController.signal}
  )

  // focus the first element
  ensureTrapZoneHasFocus(document.activeElement)

  activeTrap = {
    container,
    controller: wrappingController,
    initialFocus,
    originalSignal: signal
  }

  // If we are activating a focus trap for a container that was previously
  // suspended, just remove it from the suspended list.
  const suspendedTrapIndex = suspendedTrapStack.findIndex(t => t.container === container)
  if (suspendedTrapIndex >= 0) {
    suspendedTrapStack.splice(suspendedTrapIndex, 1)
  }
  if (!abortSignal) {
    return controller
  }
}
