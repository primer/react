/**
 * Height threshold (in pixels) above which content-visibility optimizations are applied.
 * Avoids overhead on small content that doesn't benefit from rendering optimizations.
 */
const TALL_CONTENT_THRESHOLD = 1000

/**
 * Apply CSS containment optimizations to isolate an element during resize/drag.
 * - contain: limits layout/paint recalc to this subtree
 * - content-visibility: skip rendering off-screen content (valuable for large DOMs)
 * - contain-intrinsic-size: prevents layout thrashing from size estimation when using content-visibility
 * - pointer-events: skip hit-testing large child trees
 */
export function setContainmentOptimizations(element: HTMLElement | null) {
  if (!element) return
  element.style.contain = 'layout style paint'
  element.style.pointerEvents = 'none'

  // Only apply content-visibility for tall content to avoid overhead on small elements
  const height = element.offsetHeight
  if (height > TALL_CONTENT_THRESHOLD) {
    element.style.contentVisibility = 'auto'
    element.style.containIntrinsicSize = `auto ${height}px`
  }
}

/**
 * Remove CSS containment optimizations after resize/drag completes.
 */
export function removeContainmentOptimizations(element: HTMLElement | null) {
  if (!element) return
  element.style.contain = ''
  element.style.contentVisibility = ''
  element.style.containIntrinsicSize = ''
  element.style.pointerEvents = ''
}

type DraggingStylesParams = {
  handle: HTMLElement | null
  pane: HTMLElement | null
  content: HTMLElement | null
}

/** Apply visual feedback and performance optimizations during drag */
export function setDraggingStyles({handle, pane, content}: DraggingStylesParams) {
  // Handle visual feedback
  handle?.style.setProperty('background-color', 'var(--bgColor-accent-emphasis)')
  handle?.style.setProperty('--draggable-handle--drag-opacity', '1')
  // Disable transition for instant visual feedback during drag
  handle?.style.setProperty('--draggable-handle--transition', 'none')

  // Pane: minimal containment (always visible during drag)
  if (pane) {
    pane.style.contain = 'layout style paint'
    pane.style.pointerEvents = 'none'
  }

  // Content: containment + conditional content-visibility for tall content
  if (content) {
    content.style.contain = 'layout style paint'
    content.style.pointerEvents = 'none'

    const height = content.offsetHeight
    if (height > TALL_CONTENT_THRESHOLD) {
      content.style.contentVisibility = 'auto'
      content.style.containIntrinsicSize = `auto ${height}px`
    }
  }
}

/** Remove drag styles and restore normal state */
export function removeDraggingStyles({handle, pane, content}: DraggingStylesParams) {
  handle?.style.removeProperty('background-color')
  handle?.style.removeProperty('--draggable-handle--drag-opacity')
  handle?.style.removeProperty('--draggable-handle--transition')

  if (pane) {
    pane.style.contain = ''
    pane.style.pointerEvents = ''
  }

  if (content) {
    content.style.contain = ''
    content.style.pointerEvents = ''
    content.style.contentVisibility = ''
    content.style.containIntrinsicSize = ''
  }
}
