import {queryFocusable} from './domUtils'
import {polyfill as eventListenerSignalPolyfill} from '../polyfills/eventListenerSignal'

eventListenerSignalPolyfill()

export function focusTrap(container: Element, signal: AbortSignal): void {
  const focusable = queryFocusable(container)

  document.addEventListener(
    'focusin',
    (event: FocusEvent) => {
      if (event.target instanceof Node) {
        const nodeComparison = container.compareDocumentPosition(event.target)

        if ((nodeComparison & Node.DOCUMENT_POSITION_CONTAINED_BY) === 0) {
          // Only act if the newly focused element is outside the container
          if (nodeComparison & Node.DOCUMENT_POSITION_PRECEDING) {
            // The focused Element is before the container
            focusable[0].focus()
          } else if (nodeComparison & Node.DOCUMENT_POSITION_FOLLOWING) {
            // The focused Element is after the container
            focusable[focusable.length - 1].focus()
          } else {
            // Unsure! Maybe the container is not attached to #document? Do nothing.
          }
        }
      }
    },
    {signal} as AddEventListenerOptions
  )

  // focus the first element
  if (!container.contains(document.activeElement)) {
    focusable[0].focus()
  }
}
