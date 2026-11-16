'use client'

import React from 'react'

/** Groups of keys that can move focus between the elements of a focus zone. */
export type FocusZoneKeys = 'ArrowVertical' | 'ArrowHorizontal' | 'HomeAndEnd' | 'PageUpDown' | 'Tab'

export interface FocusZoneOptions {
  /** Keys that move focus between elements. */
  bindKeys: readonly FocusZoneKeys[]
  /**
   * Whether arrow keys wrap past either end of the zone, or stop there. Tab never wraps, so focus can leave.
   * @default 'stop'
   */
  focusOutBehavior?: 'stop' | 'wrap'
  /**
   * Which element receives focus when Tab enters the zone: the most recently focused one, or the end nearest the
   * direction of travel.
   * @default 'previous'
   */
  focusInStrategy?: 'previous' | 'closest'
}

export interface UseFocusZoneOptions extends FocusZoneOptions {
  /**
   * Leaves the container's focusable elements in the normal tab order.
   * @default false
   */
  disabled?: boolean
}

type Direction = 'previous' | 'next' | 'start' | 'end'

const keyGroups: Partial<Record<string, FocusZoneKeys>> = {
  ArrowUp: 'ArrowVertical',
  ArrowDown: 'ArrowVertical',
  ArrowLeft: 'ArrowHorizontal',
  ArrowRight: 'ArrowHorizontal',
  Home: 'HomeAndEnd',
  End: 'HomeAndEnd',
  PageUp: 'PageUpDown',
  PageDown: 'PageUpDown',
  Tab: 'Tab',
}

const disableableTags = new Set(['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'OPTGROUP', 'OPTION', 'FIELDSET'])
const nonEditableInputTypes = new Set([
  'button',
  'checkbox',
  'color',
  'file',
  'hidden',
  'image',
  'radio',
  'range',
  'reset',
  'submit',
])

function getDirection(event: KeyboardEvent): Direction {
  switch (event.key) {
    case 'Tab':
      return event.shiftKey ? 'previous' : 'next'
    case 'Home':
    case 'PageUp':
      return 'start'
    case 'End':
    case 'PageDown':
      return 'end'
    case 'ArrowUp':
    case 'ArrowLeft':
      return event.metaKey || event.ctrlKey ? 'start' : 'previous'
    default:
      return event.metaKey || event.ctrlKey ? 'end' : 'next'
  }
}

function isFocusable(element: HTMLElement) {
  if (element instanceof HTMLInputElement && element.type === 'hidden') return false
  if (disableableTags.has(element.tagName) && (element as HTMLButtonElement).disabled) return false
  if (element.hasAttribute('tabindex')) return true
  const editable = element.getAttribute('contenteditable')
  if (editable === 'true' || editable === 'plaintext-only') return true
  if (element instanceof HTMLAnchorElement && !element.hasAttribute('href')) return false
  return element.tabIndex !== -1
}

function isHidden(element: HTMLElement) {
  return element.hidden || element.hasAttribute('inert') || element.getAttribute('aria-hidden') === 'true'
}

/** Focusable descendants in document order, skipping hidden, inert, and `aria-hidden` subtrees. */
function getFocusableElements(container: HTMLElement) {
  const walker = container.ownerDocument.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: node => {
      if (!(node instanceof HTMLElement)) return NodeFilter.FILTER_SKIP
      if (isHidden(node)) return NodeFilter.FILTER_REJECT
      return isFocusable(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  const elements: HTMLElement[] = []
  while (walker.nextNode()) elements.push(walker.currentNode as HTMLElement)
  return elements
}

function isEditable(element: Element | null): element is HTMLElement {
  if (!(element instanceof HTMLElement)) return false
  const readOnly = element.getAttribute('aria-readonly') === 'true' || element.hasAttribute('readonly')
  const type = element.getAttribute('type')?.toLowerCase() ?? 'text'
  const editable =
    element instanceof HTMLSelectElement ||
    element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLInputElement && !nonEditableInputTypes.has(type)) ||
    element.isContentEditable
  return editable && !readOnly
}

/** Keys that an editable control or select needs for itself, such as moving the caret. */
function shouldIgnoreKey(event: KeyboardEvent, element: Element | null) {
  if (!isEditable(element)) return false
  const {key} = event
  // A select changes its value, or opens, with the vertical arrows.
  if (element instanceof HTMLSelectElement)
    return (key === 'ArrowUp' || key === 'ArrowDown') && !event.metaKey && !event.ctrlKey
  if (key === 'Home' || key === 'End') return true
  const input = element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element : null
  const atStart = input !== null && input.selectionStart === 0 && input.selectionEnd === 0
  const atEnd =
    input !== null && input.selectionStart === input.value.length && input.selectionEnd === input.value.length
  if (key === 'ArrowLeft' && !atStart) return true
  if (key === 'ArrowRight' && !atEnd) return true
  if (input instanceof HTMLTextAreaElement || element.isContentEditable) {
    if (key === 'PageUp' || key === 'PageDown') return true
    if (key === 'ArrowUp' && !atStart) return true
    if (key === 'ArrowDown' && !atEnd) return true
  }
  return false
}

/**
 * Moves focus between the focusable descendants of `container` with the bound keys, keeping a single element in the
 * tab order (a roving tabindex). Elements added, removed, hidden, or disabled later are picked up automatically, and
 * every element's own `tabindex` is restored by the returned cleanup.
 */
export function focusZone(container: HTMLElement, options: FocusZoneOptions): () => void {
  const {bindKeys, focusOutBehavior = 'stop', focusInStrategy = 'previous'} = options
  const document = container.ownerDocument
  const savedTabIndex = new Map<HTMLElement, string | null>()
  const writtenTabIndex = new WeakMap<HTMLElement, string>()
  let elements: HTMLElement[] = []
  let current: HTMLElement | undefined
  let tabDirection: 'previous' | 'next' | undefined

  function writeTabIndex(element: HTMLElement, value: string) {
    if (element.getAttribute('tabindex') === value) return
    writtenTabIndex.set(element, value)
    element.setAttribute('tabindex', value)
  }

  function restoreTabIndex(element: HTMLElement, value: string | null | undefined) {
    if (value === undefined) return
    if (value === null) element.removeAttribute('tabindex')
    else element.setAttribute('tabindex', value)
  }

  function sync() {
    const next = getFocusableElements(container)
    const nextSet = new Set(next)
    for (const [element, saved] of savedTabIndex) {
      if (nextSet.has(element)) continue
      savedTabIndex.delete(element)
      restoreTabIndex(element, saved)
    }
    for (const element of next) {
      if (!savedTabIndex.has(element)) savedTabIndex.set(element, element.getAttribute('tabindex'))
    }
    elements = next
    if (!current || !nextSet.has(current)) {
      current = next.find(element => element === document.activeElement) ?? next[0]
    }
    for (const element of next) writeTabIndex(element, element === current ? '0' : '-1')
  }

  function setCurrent(element: HTMLElement) {
    if (element === current) return
    const previous = current
    current = element
    if (previous && savedTabIndex.has(previous)) writeTabIndex(previous, '-1')
    writeTabIndex(element, '0')
  }

  function getCandidates(direction: Direction, key: string) {
    const count = elements.length
    const index = current ? elements.indexOf(current) : -1
    const indexes = Array.from({length: count}, (_, offset) => offset)
    const wrap = focusOutBehavior === 'wrap' && key !== 'Tab'
    switch (direction) {
      case 'start':
        return indexes
      case 'end':
        return indexes.reverse()
      case 'next':
        return [...indexes.slice(index + 1), ...(wrap ? indexes.slice(0, Math.max(index, 0)) : [])]
      default: {
        const before = index < 0 ? [] : indexes.slice(0, index).reverse()
        return [...before, ...(wrap ? indexes.slice(index + 1).reverse() : [])]
      }
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    const group = keyGroups[event.key]
    if (!group || !bindKeys.includes(group) || event.defaultPrevented || event.isComposing) return
    if (shouldIgnoreKey(event, document.activeElement)) return

    let moved = false
    for (const index of getCandidates(getDirection(event), event.key)) {
      const candidate = elements[index]
      if (candidate === current) break
      candidate.focus()
      // Skip elements that cannot take focus, such as ones hidden with CSS.
      if (document.activeElement === candidate) {
        moved = true
        break
      }
    }
    if (moved || event.key !== 'Tab') event.preventDefault()
  }

  function handleFocusIn(event: FocusEvent) {
    const target = event.target
    const direction = tabDirection
    tabDirection = undefined
    if (!(target instanceof HTMLElement) || !savedTabIndex.has(target)) return

    const from = event.relatedTarget
    const entering = !(from instanceof Node && container.contains(from))
    if (focusInStrategy === 'closest' && entering && direction) {
      const edge = direction === 'previous' ? elements.at(-1) : elements.at(0)
      if (edge && edge !== target) {
        edge.focus()
        return
      }
    }
    setCurrent(target)
  }

  function handleDocumentKeyDown(event: KeyboardEvent) {
    if (event.key !== 'Tab') return
    tabDirection = event.shiftKey ? 'previous' : 'next'
    // Only the focus change caused by this key press counts as Tab entry.
    setTimeout(() => {
      tabDirection = undefined
    })
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      const element = record.target
      if (record.attributeName !== 'tabindex' || !(element instanceof HTMLElement) || !savedTabIndex.has(element)) {
        continue
      }
      const value = element.getAttribute('tabindex')
      // Another writer, such as a React re-render, changed the element's own tabindex.
      if (value !== writtenTabIndex.get(element) || record.oldValue === value) savedTabIndex.set(element, value)
    }
    sync()
  })

  sync()
  observer.observe(container, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    attributeFilter: ['aria-hidden', 'contenteditable', 'disabled', 'hidden', 'href', 'inert', 'tabindex'],
  })
  container.addEventListener('keydown', handleKeyDown)
  container.addEventListener('focusin', handleFocusIn)
  if (focusInStrategy === 'closest') document.addEventListener('keydown', handleDocumentKeyDown, true)

  return () => {
    observer.disconnect()
    container.removeEventListener('keydown', handleKeyDown)
    container.removeEventListener('focusin', handleFocusIn)
    document.removeEventListener('keydown', handleDocumentKeyDown, true)
    for (const [element, saved] of savedTabIndex) restoreTabIndex(element, saved)
    savedTabIndex.clear()
  }
}

/**
 * Returns a ref callback that turns the referenced container into a focus zone: arrow keys (or the other bound keys)
 * move focus between its focusable descendants while only one of them stays in the tab order.
 */
export function useFocusZone<T extends HTMLElement>({
  bindKeys,
  disabled = false,
  focusInStrategy = 'previous',
  focusOutBehavior = 'stop',
}: UseFocusZoneOptions): React.RefCallback<T> {
  const keys = bindKeys.join(' ')
  const cleanupRef = React.useRef<(() => void) | null>(null)
  return React.useCallback(
    (container: T | null) => {
      cleanupRef.current?.()
      cleanupRef.current = null
      if (!container || disabled) return
      cleanupRef.current = focusZone(container, {
        bindKeys: keys.split(' ') as FocusZoneKeys[],
        focusInStrategy,
        focusOutBehavior,
      })
    },
    [disabled, focusInStrategy, focusOutBehavior, keys],
  )
}
