/**
 * Copy plain text to the clipboard. Call from a user interaction.
 * Rejects when the browser cannot write to the clipboard.
 */
export async function copyText(text: string): Promise<void> {
  if (typeof navigator !== 'undefined' && 'clipboard' in navigator) {
    await navigator.clipboard.writeText(text)
    return
  }

  const body = typeof document !== 'undefined' ? document.querySelector('body') : null
  if (!body) {
    throw new Error('Clipboard copying requires a browser document')
  }

  const selection = document.getSelection()
  if (!selection) {
    throw new Error('Clipboard copying requires a selection')
  }

  const ranges = Array.from({length: selection.rangeCount}, (_, index) => selection.getRangeAt(index).cloneRange())
  const node = document.createElement('pre')
  node.textContent = text
  Object.assign(node.style, {position: 'fixed', top: '0', width: '1px', height: '1px', opacity: '0'})
  body.appendChild(node)

  try {
    const range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
    if (!document.execCommand('copy')) {
      throw new Error('The browser could not copy text to the clipboard')
    }
  } finally {
    node.remove()
    selection.removeAllRanges()
    for (const range of ranges) {
      selection.addRange(range)
    }
  }
}
