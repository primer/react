/**
 * Apply CSS containment optimizations to isolate an element during resize/drag.
 * - contain: limits layout/paint recalc to this subtree
 * - pointer-events: skip hit-testing large child trees
 */
export function setContainmentOptimizations(element: HTMLElement | null) {
  if (!element) return
  element.style.contain = 'layout style paint'
  element.style.pointerEvents = 'none'
}

/**
 * Remove CSS containment optimizations after resize/drag completes.
 */
export function removeContainmentOptimizations(element: HTMLElement | null) {
  if (!element) return
  element.style.contain = ''
  element.style.pointerEvents = ''
}

type DraggingStylesParams = {
  handle: HTMLElement | null
  pane: HTMLElement | null
  content: HTMLElement | null
}

/** Apply visual feedback and performance optimizations during drag */
export function setDraggingStyles({handle, pane, content}: DraggingStylesParams) {
  handle?.style.setProperty('background-color', 'var(--bgColor-accent-emphasis)')
  handle?.style.setProperty('--draggable-handle--drag-opacity', '1')
  // Disable transition for instant visual feedback during drag
  handle?.style.setProperty('--draggable-handle--transition', 'none')
  pane?.style.setProperty('will-change', 'width')
  setContainmentOptimizations(content)
  setContainmentOptimizations(pane)
}

/** Remove drag styles and restore normal state */
export function removeDraggingStyles({handle, pane, content}: DraggingStylesParams) {
  handle?.style.removeProperty('background-color')
  handle?.style.removeProperty('--draggable-handle--drag-opacity')
  handle?.style.removeProperty('--draggable-handle--transition')
  pane?.style.removeProperty('will-change')
  removeContainmentOptimizations(content)
  removeContainmentOptimizations(pane)
}
