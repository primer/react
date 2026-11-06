const mirroredProperties = [
  'boxSizing',
  'width',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'borderStyle',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontFamily',
  'fontSize',
  'fontWeight',
  'fontStyle',
  'fontVariant',
  'letterSpacing',
  'lineHeight',
  'textIndent',
  'textTransform',
  'textAlign',
  'direction',
  'tabSize',
] as const

/** Spike-only mirror: viewport coordinates, including wrapping and textarea scrolling. */
export function measureCaret(input: HTMLTextAreaElement): DOMRect {
  const styles = getComputedStyle(input)
  const bounds = input.getBoundingClientRect()
  const mirror = document.createElement('div')
  for (const property of mirroredProperties) mirror.style[property] = styles[property]
  Object.assign(mirror.style, {
    position: 'fixed',
    visibility: 'hidden',
    pointerEvents: 'none',
    left: `${bounds.left}px`,
    top: `${bounds.top}px`,
    height: 'auto',
    whiteSpace: 'pre-wrap',
    overflowWrap: 'break-word',
    overflowY: input.scrollHeight > input.clientHeight ? 'scroll' : 'hidden',
  })
  mirror.textContent = input.value.slice(0, input.selectionStart)
  const marker = document.createElement('span')
  marker.textContent = '\u200b'
  mirror.append(marker)
  document.body.append(mirror)
  try {
    const caret = marker.getBoundingClientRect()
    return new DOMRect(
      caret.left - input.scrollLeft,
      caret.top - input.scrollTop,
      0,
      caret.height || Number.parseFloat(styles.fontSize),
    )
  } finally {
    mirror.remove()
  }
}
