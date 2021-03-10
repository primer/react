import {isTabbable, iterateTabbableElements} from '../utils/iterateTabbable'
import {polyfill as eventListenerSignalPolyfill} from '../polyfills/eventListenerSignal'
import {isMacOS} from '../utils/userAgent'

eventListenerSignalPolyfill()

export type Direction = 'previous' | 'next'

export type FocusMovementKeys =
  | 'ArrowLeft'
  | 'ArrowDown'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'h'
  | 'j'
  | 'k'
  | 'l'
  | 'a'
  | 's'
  | 'w'
  | 'd'
  | 'Tab'
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'

export const KeyBits = {
  // Left and right arrow keys (previous and next, respectively)
  ArrowHorizontal: 0b000000001,

  // Up and down arrow keys (previous and next, respectively)
  ArrowVertical: 0b000000010,

  // The "J" and "K" keys (next and previous, respectively)
  JK: 0b000000100,

  // The "H" and "L" keys (previous and next, respectively)
  HL: 0b000001000,

  // The Home and End keys (previous and next, respectively, to end)
  HomeAndEnd: 0b000010000,

  // The PgUp and PgDn keys (previous and next, respectively, to end)
  PageUpDown: 0b100000000,

  // The "W" and "S" keys (previous and next, respectively)
  WS: 0b000100000,

  // The "A" and "D" keys (previous and next, respectively)
  AD: 0b001000000,

  // The Tab key (next)
  TAB: 0b010000000,

  // These are set below
  ArrowAll: 0,
  HJKL: 0,
  WASD: 0,
  ALL: 0
}
;(KeyBits.ArrowAll = KeyBits.ArrowHorizontal | KeyBits.ArrowVertical),
  (KeyBits.HJKL = KeyBits.JK | KeyBits.HL),
  (KeyBits.WASD = KeyBits.WS | KeyBits.AD),
  (KeyBits.ALL = KeyBits.ArrowAll | KeyBits.HJKL | KeyBits.HomeAndEnd | KeyBits.PageUpDown | KeyBits.WASD | KeyBits.TAB)

const KEY_TO_BIT = {
  ArrowLeft: 0b00000001,
  ArrowDown: 0b00000010,
  ArrowUp: 0b00000010,
  ArrowRight: 0b00000001,
  h: 0b00001000,
  j: 0b00000100,
  k: 0b00000100,
  l: 0b00001000,
  a: 0b01000000,
  s: 0b00100000,
  w: 0b00100000,
  d: 0b01000000,
  Tab: 0b10000000,
  Home: 0b00010000,
  End: 0b00010000,
  PageUp: 0b100000000,
  PageDown: 0b100000000
} as {[k in FocusMovementKeys]: number}

const KEY_TO_DIRECTION = {
  ArrowLeft: 'previous',
  ArrowDown: 'next',
  ArrowUp: 'previous',
  ArrowRight: 'next',
  h: 'previous',
  j: 'next',
  k: 'previous',
  l: 'next',
  a: 'previous',
  s: 'next',
  w: 'previous',
  d: 'next',
  Tab: 'next',
  Home: 'previous',
  End: 'next',
  PageUp: 'previous',
  PageDown: 'next'
} as {[k in FocusMovementKeys]: Direction}

/**
 * Options that control the behavior of the arrow focus behavior.
 */
export interface ArrowFocusOptions {
  /**
   * If true, when the last element in the container is focused, focusing the _next_ item
   * should cause the first element in the container to be focused. Likewise, if the first
   * item in the list is focused, focusing the _previous_ item should cause the last element
   * in the container to be focused. Default: false.
   */
  circular?: boolean

  /**
   * If set, this will be called to get the next focusable element. If this function
   * returns null, we will try to determine the next direction outselves. Use the
   * `bindKeys` option to customize which keys are listened to.
   *
   * The function can accept a Direction, indicating the direction focus should move,
   * a boolean indicating whether or not focus should move to the end of the list of
   * elements in the given direction, the HTMLElement that was previously focused, and
   * lastly the `KeyboardEvent` object created by the original `"keydown"` event.
   *
   * The `toEnd` argument is true if:
   *   - Home or End key used
   *   - Command key used (macOS)
   *   - Control key used (Windows or Linux)
   */
  getNextFocusable?: (
    direction: Direction,
    toEnd: boolean,
    from: Element | undefined,
    event: KeyboardEvent
  ) => HTMLElement | undefined

  /**
   * Bit flags that identify keys that will be bound to. Each available key either
   * moves focus to the "next" element or the "previous" element, so it is best
   * to only bind the keys that make sense to move focus in your UI. Use the `KeyBits`
   * object to discover supported keys.
   *
   * Use the bitwise "OR" operator (`|`) to combine key types. For example,
   * `KeyBits.WASD | KeyBits.HJKL` represents all of W, A, S, D, H, J, K, and L.
   *
   * A note on KeyBits.PageUpDown: This behavior does not support paging, so by default
   * using these keys will result in the same behavior as Home and End. To override this
   * behavior, implement `getNextFocusable`.
   *
   * The default for this setting is `KeyBits.ArrowVertical | KeyBits.HomeAndEnd`, unless
   * `getNextFocusable` is provided, in which case `KeyBits.ArrowAll | KeyBits.HomeAndEnd`
   * is used as the default.
   */
  bindKeys?: number

  /**
   * If provided, this signal can be used to disable the behavior and remove any
   * event listeners.
   */
  abortSignal?: AbortSignal

  /**
   * This option allows customization of the behavior that determines which of the
   * focusable elements should be focused when focus enters the container via the Tab key.
   *
   * When set to "first", whenever focus enters the container via Tab, we will focus the
   * first focusable element. When set to "previous", the most recently focused element
   * will be focused (fallback to first if there was no previous).
   *
   * If a function is provided, this function should return the HTMLElement intended
   * to receive focus. This is useful if you want to focus the currently "selected"
   * item or element.
   *
   * Default: "previous"
   *
   * For more information, @see https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_general_within
   */
  focusInStrategy?: 'first' | 'previous' | ((previousFocusedElement: Element) => HTMLElement | undefined)
}

export function arrowFocus(container: HTMLElement, options?: ArrowFocusOptions): AbortController {
  const tabbableElements = Array.from(iterateTabbableElements(container))
  const savedTabIndex = new WeakMap<HTMLElement, string | null>()
  const bindKeys =
    options?.bindKeys ?? (options?.getNextFocusable ? KeyBits.ArrowAll : KeyBits.ArrowVertical) | KeyBits.HomeAndEnd
  const circular = options?.circular ?? false
  const focusInStrategy = options?.focusInStrategy ?? 'previous'

  function beginFocusManagement(element: HTMLElement) {
    // Set tabindex="-1" on all tabbable elements, but save the original
    // value in case we need to disable the behavior
    if (!savedTabIndex.has(element)) {
      savedTabIndex.set(element, element.getAttribute('tabindex'))
    }
    element.setAttribute('tabindex', '-1')

    allSeenTabbableElements.add(element)
  }

  function endFocusManagement(element: HTMLElement) {
    const tabbableElementIndex = tabbableElements.findIndex(e => e === element)
    if (tabbableElementIndex >= 0) {
      tabbableElements.splice(tabbableElementIndex, 1)
    }
    savedTabIndex.delete(element)
  }

  // We are going to keep track of all tabbable elements we've encountered. This will be
  // necessary if one of these elements is removed from the container and subsequently
  // re-added. Since we are settings tabindex="-1" on each of these elements, once it
  // re-enters the container, we will not otherwise recognize it as a tabbable element.
  // This implementation makes the assumption that once something is identified as a
  // tabbable element, it will always be a tabbable element.
  const allSeenTabbableElements = new WeakSet<HTMLElement>(tabbableElements)

  // Take all tabbable elements within container under management
  for (const elem of tabbableElements) {
    beginFocusManagement(elem)
  }

  // Open the first tabbable element for tabbing
  tabbableElements[0].setAttribute('tabindex', '0')

  // If the DOM structure of the container changes, make sure we keep our state up-to-date
  // with respect to the focusable elements cache and its order
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const addedNode of mutation.addedNodes) {
        if (addedNode instanceof HTMLElement && (isTabbable(addedNode) || allSeenTabbableElements.has(addedNode))) {
          beginFocusManagement(addedNode)
        }
      }
      for (const removedNode of mutation.removedNodes) {
        if (removedNode instanceof HTMLElement && savedTabIndex.has(removedNode)) {
          endFocusManagement(removedNode)
        }
      }
    }
  })

  observer.observe(container, {
    subtree: true,
    childList: true
  })

  const controller = new AbortController()
  const signal = options?.abortSignal ?? controller.signal

  let currentFocusedIndex = 0
  let currentFocusedElement: HTMLElement = tabbableElements[0]

  // This is called whenever focus enters the container
  container.addEventListener(
    'focusin',
    event => {
      if (event.target instanceof HTMLElement) {
        // Set tab indexes and internal state based on the focus handling strategy
        if (focusInStrategy === 'previous') {
          currentFocusedElement.setAttribute('tabindex', '-1')
          event.target.setAttribute('tabindex', '0')
        } else if (focusInStrategy === 'first') {
          if (event.relatedTarget instanceof Element && !container.contains(event.relatedTarget)) {
            currentFocusedIndex = 0
          }
        } else if (typeof focusInStrategy === 'function') {
          if (event.relatedTarget instanceof Element && !container.contains(event.relatedTarget)) {
            const elementToFocus = focusInStrategy(event.relatedTarget)
            const requestedFocusElementIndex = tabbableElements.findIndex(e => e === elementToFocus)
            if (requestedFocusElementIndex >= 0 && elementToFocus instanceof HTMLElement) {
              currentFocusedIndex = requestedFocusElementIndex

              // Since we are calling focus() this handler will run again synchronously. Therefore,
              // we don't want to let this invocation finish since it will clobber the value of
              // currentFocusedElement.
              elementToFocus.focus()
              return
            } else {
              // Should we warn here?
              console.warn('Element requested is not a known focusable element.')
            }
          } else {
            console.log("current", currentFocusedElement)
            console.log("next", event.target)
            currentFocusedElement.setAttribute('tabindex', '-1')
            event.target.setAttribute('tabindex', '0')
          }
        }
        console.log("Setting current focused element to", event.target)
        currentFocusedElement = event.target
      }
    },
    {signal}
  )

  // Handles keypresses only when the container has active focus
  // @todo handle inputs
  container.addEventListener(
    'keydown',
    event => {
      if (event.key in KEY_TO_DIRECTION) {
        const keyBit = KEY_TO_BIT[event.key as keyof typeof KEY_TO_BIT]

        // Check if the pressed key (keyBit) is one that is being used for focus (bindKeys)
        if (!event.defaultPrevented && (keyBit & bindKeys) > 0) {
          const isMac = isMacOS()

          // These conditions decide if we should move focus to the first/last element in the container
          const toEnd =
            event.key === 'Home' ||
            event.key === 'End' ||
            (isMac && event.metaKey) ||
            (!isMac && event.ctrlKey) ||
            event.key === 'PageUp' ||
            event.key === 'PageDown'

          // Moving forward or backward?
          let direction = KEY_TO_DIRECTION[event.key as keyof typeof KEY_TO_DIRECTION]
          if (event.key === 'Tab' && event.shiftKey) {
            direction = 'previous'
          }

          let nextElementToFocus: HTMLElement | undefined = undefined

          // If there is a custom function that retrieves the next focusable element, try calling that first.
          if (options?.getNextFocusable) {
            nextElementToFocus = options.getNextFocusable(direction, toEnd, document.activeElement ?? undefined, event)
          }
          if (!nextElementToFocus) {
            const lastFocusedIndex = currentFocusedIndex
            if (direction === 'previous') {
              if (toEnd) {
                currentFocusedIndex = 0
              } else {
                currentFocusedIndex -= 1
              }
            } else if (direction === 'next') {
              if (toEnd) {
                currentFocusedIndex = tabbableElements.length - 1
              } else {
                currentFocusedIndex += 1
              }
            }
            if (currentFocusedIndex < 0) {
              if (circular) {
                currentFocusedIndex = tabbableElements.length - 1
              } else {
                currentFocusedIndex = 0
              }
            }
            if (currentFocusedIndex >= tabbableElements.length) {
              if (circular) {
                currentFocusedIndex = 0
              } else {
                currentFocusedIndex = tabbableElements.length - 1
              }
            }
            if (lastFocusedIndex !== currentFocusedIndex) {
              nextElementToFocus = tabbableElements[currentFocusedIndex]
            }
          }
          if (nextElementToFocus) {
            nextElementToFocus.focus()
          }
          event.preventDefault()
        }
      }
    },
    {signal}
  )
  return controller
}
