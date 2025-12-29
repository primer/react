type DraggingStylesParams = {
  handle: HTMLElement | null
  pane: HTMLElement | null
  content: HTMLElement | null
}

const DATA_DRAGGING_ATTR = 'data-dragging'

/** Apply visual feedback and performance optimizations during drag */
export function setDraggingStyles({handle, pane, content}: DraggingStylesParams) {
  // Handle visual feedback (must be inline for instant response)
  handle?.style.setProperty('background-color', 'var(--bgColor-accent-emphasis)')
  handle?.style.setProperty('--draggable-handle--drag-opacity', '1')
  handle?.style.setProperty('--draggable-handle--transition', 'none')

  // Set attribute for CSS containment (O(1) direct selector, not descendant)
  pane?.setAttribute(DATA_DRAGGING_ATTR, 'true')
  content?.setAttribute(DATA_DRAGGING_ATTR, 'true')
}

/** Remove drag styles and restore normal state */
export function removeDraggingStyles({handle, pane, content}: DraggingStylesParams) {
  handle?.style.removeProperty('background-color')
  handle?.style.removeProperty('--draggable-handle--drag-opacity')
  handle?.style.removeProperty('--draggable-handle--transition')

  pane?.removeAttribute(DATA_DRAGGING_ATTR)
  content?.removeAttribute(DATA_DRAGGING_ATTR)
}
