import {iterateFocusableElements} from '../utils/iterateFocusable'
import {polyfill as eventListenerSignalPolyfill} from '../polyfills/eventListenerSignal'

eventListenerSignalPolyfill()

interface FocusTrapMetadata {
  container: HTMLElement
  controller: AbortController
  originalSignal: AbortSignal
}

const suspendedTrapStack: FocusTrapMetadata[] = []
let activeTrap: FocusTrapMetadata | undefined = undefined

function tryReactivate() {
  const trapToReactivate = suspendedTrapStack.pop()
  if (trapToReactivate) {
    focusTrap(trapToReactivate.container, trapToReactivate.originalSignal)
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
  return iterateFocusableElements(container, lastChild).next().value
}

export function focusTrap(container: HTMLElement, signal: AbortSignal): void {
  container.setAttribute("data-focus-trap", "active");
  let lastFocusedChild: HTMLElement | undefined = undefined
  const firstFocusableChild = getFocusableChild(container)
  const lastFocusableChild = getFocusableChild(container, true)
  function ensureTrapZoneHasFocus(focusedElement: EventTarget | null) {
    if (focusedElement instanceof HTMLElement) {
      if (container.contains(focusedElement)) {
        // If a child of the trap zone was focused, remember it
        lastFocusedChild = focusedElement
      } else {
        if (lastFocusedChild && lastFocusedChild.tabIndex !== -1) {
          lastFocusedChild.focus()
        } else {
          firstFocusableChild?.focus()
        }
      }
    }
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
    activeTrap.container.setAttribute("data-focus-trap", "suspended");
    activeTrap.controller.abort()
    suspendedTrapStack.push(suspendedTrap)
  }

  // When this trap is canceled, either by the user or by us for suspension
  wrappingController.signal.addEventListener('abort', () => {
    activeTrap = undefined
  })

  // Only when user-canceled
  signal.addEventListener('abort', () => {
    container.removeAttribute("data-focus-trap");
    tryReactivate()
  })

  document.addEventListener(
    'focusin',
    (event: FocusEvent) => {
      ensureTrapZoneHasFocus(event.target)
    },
    {signal: wrappingController.signal}
  )

  // focus the first element
  ensureTrapZoneHasFocus(document.activeElement)

  activeTrap = {
    container,
    controller: wrappingController,
    originalSignal: signal
  }

  // If we are activating a focus trap for a container that was previously
  // suspended, just remove it from the suspended list.
  const suspendedTrapIndex = suspendedTrapStack.findIndex(t => t.container === container)
  if (suspendedTrapIndex >= 0) {
    suspendedTrapStack.splice(suspendedTrapIndex, 1)
  }
}
