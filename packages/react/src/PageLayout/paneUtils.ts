type DraggingStylesParams = {
  handle: HTMLElement | null
  pane: HTMLElement | null
  contentWrapper: HTMLElement | null
}

const DATA_DRAGGING_ATTR = 'data-dragging'

/** Apply visual feedback and performance optimizations during drag */
export function setDraggingStyles({handle, pane, contentWrapper}: DraggingStylesParams) {
  // Handle visual feedback (must be inline for instant response)
  // Use CSS variable to control ::before pseudo-element background color.
  // This avoids cascade conflicts between inline styles and pseudo-element backgrounds.
  handle?.style.setProperty('--draggable-handle--bg-color', 'var(--bgColor-accent-emphasis)')
  handle?.style.setProperty('--draggable-handle--drag-opacity', '1')
  handle?.style.setProperty('--draggable-handle--transition', 'none')

  // Capture current dimensions and set contain-intrinsic-size BEFORE setting data-dragging
  // This ensures the element maintains its size when content-visibility: auto is applied
  // Use 'auto' for width since it changes during drag, allowing browser to track actual size
  if (pane) {
    const rect = pane.getBoundingClientRect()
    pane.style.setProperty('contain-intrinsic-size', `auto ${rect.width}px auto ${rect.height}px`)
  }
  if (contentWrapper) {
    const rect = contentWrapper.getBoundingClientRect()
    contentWrapper.style.setProperty('contain-intrinsic-size', `auto ${rect.width}px auto ${rect.height}px`)
  }

  // Set attribute for CSS containment (O(1) direct selector, not descendant)
  pane?.setAttribute(DATA_DRAGGING_ATTR, 'true')
  contentWrapper?.setAttribute(DATA_DRAGGING_ATTR, 'true')
}

/** Remove drag styles and restore normal state */
export function removeDraggingStyles({handle, pane, contentWrapper}: DraggingStylesParams) {
  handle?.style.removeProperty('--draggable-handle--bg-color')
  handle?.style.removeProperty('--draggable-handle--drag-opacity')
  handle?.style.removeProperty('--draggable-handle--transition')

  pane?.removeAttribute(DATA_DRAGGING_ATTR)
  contentWrapper?.removeAttribute(DATA_DRAGGING_ATTR)

  // Remove contain-intrinsic-size after removing data-dragging
  pane?.style.removeProperty('contain-intrinsic-size')
  contentWrapper?.style.removeProperty('contain-intrinsic-size')
}
