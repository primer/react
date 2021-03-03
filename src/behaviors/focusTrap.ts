import {iterateFocusableElements} from './domUtils'
import {polyfill as eventListenerSignalPolyfill} from '../polyfills/eventListenerSignal'

eventListenerSignalPolyfill()

interface FocusTrapMetadata {
  container: HTMLElement
  controller: AbortController
  originalSignal: AbortSignal
}

const suspendedTrapStack: FocusTrapMetadata[] = []
let activeTrap: FocusTrapMetadata | undefined = undefined

export function focusTrap(container: HTMLElement, signal: AbortSignal): void {
  function ensureTrapFocus(focusedElement: EventTarget | null) {
    if (focusedElement instanceof HTMLElement) {
      if (container.contains(focusedElement)) {
        // If a child of the trap zone was focused, remember it
        lastFocusedChild = focusedElement
      } else {
        if (lastFocusedChild && lastFocusedChild.tabIndex !== -1) {
          lastFocusedChild.focus()
        } else {
          iterateFocusableElements(container).next()?.value.focus()
        }
      }
    }
  }
  let lastFocusedChild: HTMLElement | undefined = undefined

  // @todo If AbortController.prototype.follow is ever implemented, that could replace
  // the next few lines. @see https://github.com/whatwg/dom/issues/920
  const controller = new AbortController()
  signal.addEventListener('abort', () => {
    controller.abort()
    activeTrap = undefined;
    const trapToReactivate = suspendedTrapStack.pop();
    if (trapToReactivate) {
      focusTrap(trapToReactivate.container, trapToReactivate.originalSignal)
    }
  })

  if (activeTrap) {
    suspendedTrapStack.push(activeTrap)
    activeTrap.controller.abort()
  }

  document.addEventListener(
    'focusin',
    (event: FocusEvent) => {
      ensureTrapFocus(event.target)
    },
    {signal: controller.signal} as AddEventListenerOptions
  )

  // focus the first element
  ensureTrapFocus(document.activeElement)

  activeTrap = {
    container,
    controller,
    originalSignal: signal
  }
}
